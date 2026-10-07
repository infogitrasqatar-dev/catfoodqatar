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
        return minVal > 215 && diff < 25;
    }

    for (let x = 0; x < width; x++) {
        if (isWhiteish(x, 0)) { queue.push(x); visited[x] = 1; }
        if (isWhiteish(x, height - 1)) { queue.push((height - 1) * width + x); visited[(height - 1) * width + x] = 1; }
    }
    for (let y = 0; y < height; y++) {
        if (isWhiteish(0, y)) { queue.push(y * width); visited[y * width] = 1; }
        if (isWhiteish(width - 1, y)) { queue.push(y * width + (width - 1)); visited[y * width + (width - 1)] = 1; }
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
            
            if (minVal > 235) {
                data[idx + 3] = 0;
            } else if (minVal > 210) {
                const factor = (235 - minVal) / 25;
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

async function run() {
    const heroBackRaw = path.join('C:\\Users\\Steam\\.gemini\\antigravity-ide\\brain\\fa1b04c8-19a5-481b-9222-42bc91494c01', 'cat_food_hero_back_1791379063788.jpg');
    const heroBackOut = path.join(__dirname, 'cat-food-hero-back.png');
    await removeWhiteBackground(heroBackRaw, heroBackOut);

    const pouchBackRaw = path.join(__dirname, 'pouch-back-raw.jpg');
    const pouchBackOut = path.join(__dirname, 'pouch-back.png');
    if (fs.existsSync(pouchBackRaw)) {
        await removeWhiteBackground(pouchBackRaw, pouchBackOut);
    }

    const boxBackRaw = path.join(__dirname, 'box-back-raw.jpg');
    const boxBackOut = path.join(__dirname, 'box-back.png');
    if (fs.existsSync(boxBackRaw)) {
        await removeWhiteBackground(boxBackRaw, boxBackOut);
    }
}

run().catch(console.error);
