const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function buildAllTextures() {
    console.log('Building dedicated 3D model box & pouch textures...');

    // 1. Box Header Front (The top arch and brand)
    const headerFrontSvg = `
    <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#4A148C" />
                <stop offset="50%" stop-color="#380E6B" />
                <stop offset="100%" stop-color="#260847" />
            </linearGradient>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFE082" />
                <stop offset="30%" stop-color="#FFD54F" />
                <stop offset="70%" stop-color="#FFB300" />
                <stop offset="100%" stop-color="#FF8F00" />
            </linearGradient>
        </defs>
        <rect width="600" height="400" fill="url(#purpleGrad)" />
        
        <!-- Header Arch Shape -->
        <path d="M 0,0 L 600,0 L 600,400 L 0,400 Z" fill="url(#purpleGrad)"/>
        
        <!-- Sub Header Banner -->
        <text x="300" y="70" font-family="'Georgia', serif" font-style="italic" font-size="34" fill="#E1BEE7" text-anchor="middle">Les Repas</text>
        <text x="300" y="145" font-family="'Georgia', serif" font-size="70" font-weight="bold" fill="url(#goldGrad)" text-anchor="middle" letter-spacing="2">Plaisir</text>
        
        <!-- Salmon and Cod Banner -->
        <rect x="50" y="180" width="500" height="50" rx="8" fill="url(#goldGrad)" />
        <text x="300" y="215" font-family="'Poppins', sans-serif" font-size="24" font-weight="900" fill="#260847" text-anchor="middle" letter-spacing="2">SÉLECTION GOURMET • CHUNKS IN GRAVY</text>
        
        <!-- Gold Fish & Herbs line art -->
        <g transform="translate(180, 260) scale(1.3)" stroke="url(#goldGrad)" stroke-width="2.5" fill="none">
            <!-- Fish 1 -->
            <path d="M10,20 C35,5 75,5 95,20 C75,35 35,35 10,20 Z"/>
            <path d="M10,20 L-5,8 L-5,32 Z"/>
            <circle cx="80" cy="18" r="2.5" fill="url(#goldGrad)"/>
            <path d="M40,14 C48,18 48,22 40,26"/>
            <!-- Fish 2 -->
            <g transform="translate(110, 0)">
                <path d="M10,20 C35,5 75,5 95,20 C75,35 35,35 10,20 Z"/>
                <path d="M10,20 L-5,8 L-5,32 Z"/>
                <circle cx="80" cy="18" r="2.5" fill="url(#goldGrad)"/>
                <path d="M40,14 C48,18 48,22 40,26"/>
            </g>
        </g>
        
        <!-- French Rosette Flag -->
        <g transform="translate(255, 335)">
            <rect x="0" y="0" width="28" height="26" fill="#002395" rx="4"/>
            <rect x="30" y="0" width="28" height="26" fill="#FFFFFF"/>
            <rect x="60" y="0" width="28" height="26" fill="#ED2939" rx="4"/>
        </g>
    </svg>
    `;
    await sharp(Buffer.from(headerFrontSvg)).png().toFile('box-header-front.png');
    console.log('Saved box-header-front.png');

    // 2. Box Header Back (Product info, nutrition table, barcode)
    const headerBackSvg = `
    <svg width="600" height="700" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#4A148C" />
                <stop offset="50%" stop-color="#380E6B" />
                <stop offset="100%" stop-color="#260847" />
            </linearGradient>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFE082" />
                <stop offset="100%" stop-color="#FFB300" />
            </linearGradient>
        </defs>
        <rect width="600" height="700" fill="url(#purpleGrad)" />
        
        <!-- Top Title -->
        <text x="300" y="55" font-family="'Georgia', serif" font-style="italic" font-size="26" fill="#E1BEE7" text-anchor="middle">Les Repas</text>
        <text x="300" y="115" font-family="'Georgia', serif" font-size="56" font-weight="bold" fill="url(#goldGrad)" text-anchor="middle">Plaisir</text>
        
        <!-- Flavor Strip -->
        <rect x="40" y="140" width="520" height="42" rx="6" fill="url(#goldGrad)" />
        <text x="300" y="169" font-family="'Poppins', sans-serif" font-size="20" font-weight="900" fill="#260847" text-anchor="middle">SALMON &amp; COD • CHUNKS IN GRAVY</text>
        
        <!-- White/Cream Info Card -->
        <rect x="40" y="205" width="520" height="450" rx="16" fill="#FBF8EE" />
        
        <text x="65" y="245" font-family="'Poppins', sans-serif" font-size="18" font-weight="900" fill="#380E6B">PRODUCT INFORMATION</text>
        <line x1="65" y1="258" x2="535" y2="258" stroke="#D1C4E9" stroke-width="2"/>
        
        <text x="65" y="290" font-family="'Poppins', sans-serif" font-size="15" font-weight="bold" fill="#333">Composition: <tspan font-weight="normal" fill="#555">Meat &amp; animal derivatives, fish (salmon 4%, cod 4%)</tspan></text>
        <text x="65" y="320" font-family="'Poppins', sans-serif" font-size="15" font-weight="bold" fill="#333">Additives (/kg): <tspan font-weight="normal" fill="#555">Vit E 30mg, Taurine 450mg, Zinc 20mg</tspan></text>
        <text x="65" y="350" font-family="'Poppins', sans-serif" font-size="15" font-weight="bold" fill="#333">Analytical: <tspan font-weight="normal" fill="#555">Crude Protein 9.0%, Crude Fat 5.0%, Moisture 82%</tspan></text>
        
        <text x="65" y="400" font-family="'Poppins', sans-serif" font-size="18" font-weight="900" fill="#380E6B">PACK &amp; SERVING DETAILS</text>
        <line x1="65" y1="413" x2="535" y2="413" stroke="#D1C4E9" stroke-width="2"/>
        
        <text x="65" y="445" font-family="'Poppins', sans-serif" font-size="15" font-weight="normal" fill="#444">Adult Cat (3-5kg): 2 to 3 pouches per day in 2 meals.</text>
        <text x="65" y="475" font-family="'Poppins', sans-serif" font-size="15" font-weight="bold" fill="#4A148C">Net Weight: 12 x 100g = 1.2 kg ℮</text>
        
        <!-- Barcode -->
        <g transform="translate(140, 520)">
            <rect x="0" y="0" width="320" height="70" fill="#FFFFFF" rx="4"/>
            ${Array.from({length: 45}).map((_, i) => {
                const x = 20 + i * 6.2;
                const w = (i % 3 === 0 ? 3.5 : (i % 2 === 0 ? 1.8 : 2.5));
                return `<rect x="${x}" y="10" width="${w}" height="45" fill="#000000"/>`;
            }).join('')}
            <text x="160" y="65" font-family="'Courier New', monospace" font-size="12" font-weight="bold" fill="#000" text-anchor="middle">3 265430 123456</text>
        </g>
        
        <text x="300" y="635" font-family="'Poppins', sans-serif" font-size="14" font-weight="bold" fill="#7E57C2" text-anchor="middle">FABRIQUÉ EN FRANCE PAR NORMANDIE PET FOOD</text>
    </svg>
    `;
    await sharp(Buffer.from(headerBackSvg)).png().toFile('box-header-back.png');
    console.log('Saved box-header-back.png');

    // 3. Box Side Panels
    const sideSvg = `
    <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#4A148C" />
                <stop offset="50%" stop-color="#380E6B" />
                <stop offset="100%" stop-color="#260847" />
            </linearGradient>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFE082" />
                <stop offset="100%" stop-color="#FFB300" />
            </linearGradient>
            <linearGradient id="peachGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#FFAB91" />
                <stop offset="100%" stop-color="#FF8A65" />
            </linearGradient>
        </defs>
        <rect width="600" height="400" fill="url(#purpleGrad)" />
        
        <text x="300" y="70" font-family="'Georgia', serif" font-style="italic" font-size="30" fill="#E1BEE7" text-anchor="middle">Les Repas</text>
        <text x="300" y="135" font-family="'Georgia', serif" font-size="64" font-weight="bold" fill="url(#goldGrad)" text-anchor="middle" letter-spacing="2">Plaisir</text>
        
        <rect x="50" y="170" width="500" height="40" rx="6" fill="url(#peachGrad)"/>
        <text x="300" y="198" font-family="'Poppins', sans-serif" font-size="19" font-weight="900" fill="#260847" text-anchor="middle" letter-spacing="1">SÉLECTION GOURMET • CHUNKS IN GRAVY</text>
        
        <!-- Gold Herbs & Fish graphics -->
        <g transform="translate(180, 230) scale(1.3)" stroke="url(#goldGrad)" stroke-width="2" fill="none">
            <path d="M10,25 C30,10 70,10 90,25 C70,40 30,40 10,25 Z"/>
            <path d="M10,25 L-5,10 L-5,40 Z"/>
            <circle cx="75" cy="22" r="3" fill="url(#goldGrad)"/>
            <path d="M35,18 C45,22 45,28 35,32"/>
            <path d="M50,16 C60,22 60,28 50,34"/>
        </g>
        
        <text x="300" y="340" font-family="'Poppins', sans-serif" font-size="22" font-weight="bold" fill="url(#goldGrad)" text-anchor="middle">Premium Cat Food</text>
        <text x="300" y="375" font-family="'Poppins', sans-serif" font-size="15" font-weight="600" fill="#CE93D8" text-anchor="middle">12 x 100g ℮ • MADE IN FRANCE</text>
    </svg>
    `;
    await sharp(Buffer.from(sideSvg)).png().toFile('box-side-panel.png');
    console.log('Saved box-side-panel.png');

    // 4. Box Front Lip
    const frontLipSvg = `
    <svg width="600" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#4A148C" />
                <stop offset="100%" stop-color="#260847" />
            </linearGradient>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFE082" />
                <stop offset="100%" stop-color="#FFB300" />
            </linearGradient>
        </defs>
        <rect width="600" height="200" fill="url(#purpleGrad)" />
        
        <!-- Rosette Flag -->
        <g transform="translate(60, 80)">
            <rect x="0" y="0" width="18" height="28" fill="#002395" rx="3"/>
            <rect x="18" y="0" width="18" height="28" fill="#FFFFFF"/>
            <rect x="36" y="0" width="18" height="28" fill="#ED2939" rx="3"/>
        </g>
        
        <text x="310" y="95" font-family="'Georgia', serif" font-size="34" font-weight="bold" fill="url(#goldGrad)" text-anchor="middle">Les Repas Plaisir</text>
        <text x="310" y="145" font-family="'Poppins', sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">PREMIUM CAT FOOD</text>
    </svg>
    `;
    await sharp(Buffer.from(frontLipSvg)).png().toFile('box-front-lip.png');
    console.log('Saved box-front-lip.png');

    // 5. Box Inner Tray / Pouches Inside
    const topRimSvg = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="cartonInside" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#21053B" />
                <stop offset="100%" stop-color="#140324" />
            </linearGradient>
            <linearGradient id="silverStrip" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#B0BEC5" />
                <stop offset="50%" stop-color="#FFFFFF" />
                <stop offset="100%" stop-color="#90A4AE" />
            </linearGradient>
        </defs>
        <rect width="512" height="512" fill="url(#cartonInside)" />
        
        <!-- Lined up foil tops -->
        <rect x="40" y="80" width="432" height="28" rx="8" fill="url(#silverStrip)"/>
        <rect x="50" y="96" width="412" height="12" rx="4" fill="#4A148C"/>
        
        <rect x="40" y="180" width="432" height="28" rx="8" fill="url(#silverStrip)"/>
        <rect x="50" y="196" width="412" height="12" rx="4" fill="#4A148C"/>
        
        <rect x="40" y="280" width="432" height="28" rx="8" fill="url(#silverStrip)"/>
        <rect x="50" y="296" width="412" height="12" rx="4" fill="#4A148C"/>
        
        <rect x="40" y="380" width="432" height="28" rx="8" fill="url(#silverStrip)"/>
        <rect x="50" y="396" width="412" height="12" rx="4" fill="#4A148C"/>
    </svg>
    `;
    await sharp(Buffer.from(topRimSvg)).png().toFile('box-top-view.png');
    console.log('Saved box-top-view.png');

    // 6. Brushed Silver Foil Edge
    const pouchFoilSvg = `
    <svg width="128" height="512" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="foilGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#9E9E9E" />
                <stop offset="25%" stop-color="#EEEEEE" />
                <stop offset="50%" stop-color="#FFFFFF" />
                <stop offset="75%" stop-color="#E0E0E0" />
                <stop offset="100%" stop-color="#757575" />
            </linearGradient>
        </defs>
        <rect width="128" height="512" fill="url(#foilGrad)" />
        ${Array.from({length: 80}).map((_, i) => `<line x1="0" y1="${i * 6.4}" x2="128" y2="${i * 6.4}" stroke="rgba(0,0,0,0.12)" stroke-width="1.5"/>`).join('')}
    </svg>
    `;
    await sharp(Buffer.from(pouchFoilSvg)).png().toFile('pouch-foil-edge.png');
    console.log('Saved pouch-foil-edge.png');

    // 7. Extract transparent pouch back
    if (fs.existsSync('pouch-back-raw.jpg')) {
        const { data: pData, info: pInfo } = await sharp('pouch-back-raw.jpg').raw().toBuffer({ resolveWithObject: true });
        const pOut = Buffer.alloc(pInfo.width * pInfo.height * 4);
        for (let i = 0; i < pInfo.width * pInfo.height; i++) {
            const r = pData[i * pInfo.channels];
            const g = pData[i * pInfo.channels + 1];
            const b = pData[i * pInfo.channels + 2];
            const isWhite = (r > 230 && g > 230 && b > 230);
            pOut[i * 4] = r;
            pOut[i * 4 + 1] = g;
            pOut[i * 4 + 2] = b;
            pOut[i * 4 + 3] = isWhite ? 0 : 255;
        }
        await sharp(pOut, { raw: { width: pInfo.width, height: pInfo.height, channels: 4 } })
            .extract({ left: 200, top: 40, width: 620, height: 900 })
            .resize(600, 880, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .toFile('pouch-back-clean.png');
        console.log('Saved pouch-back-clean.png');
    }

    // 8. Extract transparent front pouch for each flavor
    const flavors = [
        { src: 'cat-food-salmon.png', out: 'hero-pouch-salmon.png' },
        { src: 'cat-food-beef.png', out: 'hero-pouch-beef.png' },
        { src: 'cat-food-trout.png', out: 'hero-pouch-trout.png' },
        { src: 'cat-food-chicken.png', out: 'hero-pouch-chicken.png' }
    ];
    for (let f of flavors) {
        if (fs.existsSync(f.src)) {
            await sharp(f.src)
                .resize(600, 880, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                .toFile(f.out);
            console.log(`Saved ${f.out}`);
        }
    }

    console.log('All textures built successfully!');
}

buildAllTextures().catch(console.error);
