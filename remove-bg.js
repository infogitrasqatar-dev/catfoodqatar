const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function removeWhiteBackground(inputPath, outputPath) {
    console.log(`Processing: ${inputPath}...`);
    const inputBuffer = fs.readFileSync(inputPath);
    
    const { data, info } = await sharp(inputBuffer)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

    const width = info.width;
    const height = info.height;

    const visited = new Uint8Array(width * height);
    const queue = [];

    function isWhiteish(x, y) {
        const idx = (y * width + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const minVal = Math.min(r, g, b);
        const maxVal = Math.max(r, g, b);
        const diff = maxVal - minVal;
        return minVal > 220 && diff < 25;
    }

    for (let x = 0; x < width; x++) {
        if (isWhiteish(x, 0)) { queue.push((0 * width + x)); visited[0 * width + x] = 1; }
        if (isWhiteish(x, height - 1)) { queue.push(((height - 1) * width + x)); visited[(height - 1) * width + x] = 1; }
    }
    for (let y = 0; y < height; y++) {
        if (isWhiteish(0, y)) { queue.push((y * width + 0)); visited[y * width + 0] = 1; }
        if (isWhiteish(width - 1, y)) { queue.push((y * width + (width - 1))); visited[y * width + (width - 1)] = 1; }
    }

    let head = 0;
    while (head < queue.length) {
        const curr = queue[head++];
        const cx = curr % width;
        const cy = Math.floor(curr / width);

        const nbs = [
            cx > 0 ? curr - 1 : -1,
            cx < width - 1 ? curr + 1 : -1,
            cy > 0 ? curr - width : -1,
            cy < height - 1 ? curr + width : -1
        ];

        for (const n of nbs) {
            if (n >= 0 && !visited[n]) {
                const nx = n % width;
                const ny = Math.floor(n / width);
                if (isWhiteish(nx, ny)) {
                    visited[n] = 1;
                    queue.push(n);
                }
            }
        }
    }

    for (let i = 0; i < visited.length; i++) {
        const idx = i * 4;
        if (visited[i] === 1) {
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const minVal = Math.min(r, g, b);
            
            if (minVal > 240) {
                data[idx + 3] = 0;
            } else if (minVal > 215) {
                const factor = (240 - minVal) / 25;
                data[idx + 3] = Math.round(factor * 255);
            } else {
                data[idx + 3] = 0;
            }
        }
    }

    const outputBuffer = await sharp(data, {
        raw: { width, height, channels: 4 }
    })
    .png({ quality: 100 })
    .toBuffer();

    fs.writeFileSync(outputPath, outputBuffer);
    console.log(`Saved transparent image: ${outputPath}`);
}

async function processAll() {
    const files = [
        'cat-food-hero.png',
        'cat-food-salmon.png',
        'cat-food-beef.png',
        'cat-food-trout.png',
        'cat-food-chicken.png',
        'cat-food-dry.png'
    ];

    for (const f of files) {
        const fullPath = path.join(__dirname, f);
        if (fs.existsSync(fullPath)) {
            await removeWhiteBackground(fullPath, fullPath);
        }
    }
    console.log('All product images are now transparent PNGs!');
}

processAll().catch(err => console.error(err));
