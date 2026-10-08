const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateAllClean3DAssets() {
    console.log('Generating high-precision 3D texture assets...');

    // ----------------------------------------------------
    // 1. Pouch Fronts for All 4 Flavors
    // ----------------------------------------------------
    // Salmon
    if (fs.existsSync('cat-food-salmon.png')) {
        await sharp('cat-food-salmon.png')
            .extract({ left: 95, top: 270, width: 385, height: 600 })
            .resize(512, 768, { fit: 'fill' })
            .toFile('pouch-front-salmon.png');
        console.log('Generated pouch-front-salmon.png');
    }

    // Beef
    if (fs.existsSync('cat-food-beef.png')) {
        await sharp('cat-food-beef.png')
            .extract({ left: 428, top: 382, width: 220, height: 350 })
            .resize(512, 768, { fit: 'fill' })
            .toFile('pouch-front-beef.png');
        console.log('Generated pouch-front-beef.png');
    }

    // Trout
    if (fs.existsSync('cat-food-trout.png')) {
        await sharp('cat-food-trout.png')
            .extract({ left: 428, top: 382, width: 220, height: 350 })
            .resize(512, 768, { fit: 'fill' })
            .toFile('pouch-front-trout.png');
        console.log('Generated pouch-front-trout.png');
    }

    // Chicken
    if (fs.existsSync('cat-food-chicken.png')) {
        await sharp('cat-food-chicken.png')
            .extract({ left: 428, top: 382, width: 220, height: 350 })
            .resize(512, 768, { fit: 'fill' })
            .toFile('pouch-front-chicken.png');
        console.log('Generated pouch-front-chicken.png');
    }

    // ----------------------------------------------------
    // 2. Pouch Back (Nutrition, Composition, Barcode)
    // ----------------------------------------------------
    if (fs.existsSync('cat-food-hero-back.png')) {
        await sharp('cat-food-hero-back.png')
            .extract({ left: 66, top: 228, width: 405, height: 604 })
            .resize(512, 768, { fit: 'fill' })
            .toFile('pouch-back-art.png');
        console.log('Generated pouch-back-art.png');
    }

    // ----------------------------------------------------
    // 3. Foil Edge Texture (Brushed Aluminum / Silver)
    // ----------------------------------------------------
    const foilSvg = `
    <svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="foilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#CFD8DC" />
                <stop offset="25%" stop-color="#ECEFF1" />
                <stop offset="50%" stop-color="#FFFFFF" />
                <stop offset="75%" stop-color="#B0BEC5" />
                <stop offset="100%" stop-color="#78909C" />
            </linearGradient>
        </defs>
        <rect width="256" height="256" fill="url(#foilGrad)" />
        ${Array.from({length: 64}).map((_, i) => `<line x1="0" y1="${i * 4}" x2="256" y2="${i * 4}" stroke="rgba(255,255,255,0.4)" stroke-width="1.2"/>`).join('')}
        ${Array.from({length: 64}).map((_, i) => `<line x1="0" y1="${i * 4 + 2}" x2="256" y2="${i * 4 + 2}" stroke="rgba(0,0,0,0.08)" stroke-width="1.2"/>`).join('')}
    </svg>
    `;
    await sharp(Buffer.from(foilSvg)).png().toFile('foil-silver-spec.png');
    console.log('Generated foil-silver-spec.png');

    // ----------------------------------------------------
    // 4. Box Back Panel Art (Cat & Fish Gold Logo + Back Details)
    // ----------------------------------------------------
    if (fs.existsSync('cat-food-hero-back.png')) {
        await sharp('cat-food-hero-back.png')
            .extract({ left: 470, top: 200, width: 265, height: 630 })
            .resize(512, 800, { fit: 'fill' })
            .toFile('box-back-art.png');
        console.log('Generated box-back-art.png');
    }

    // ----------------------------------------------------
    // 5. Box Header Front Art (The Arch with Logo & Banner)
    // ----------------------------------------------------
    const headerFrontSvg = `
    <svg width="600" height="700" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="purpleBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#4A148C" />
                <stop offset="50%" stop-color="#380E6B" />
                <stop offset="100%" stop-color="#240742" />
            </linearGradient>
            <linearGradient id="goldText" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFF3E0" />
                <stop offset="25%" stop-color="#FFE082" />
                <stop offset="60%" stop-color="#FFD54F" />
                <stop offset="100%" stop-color="#FFB300" />
            </linearGradient>
            <linearGradient id="goldBanner" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#FFE082" />
                <stop offset="50%" stop-color="#FFCA28" />
                <stop offset="100%" stop-color="#FFA000" />
            </linearGradient>
            <linearGradient id="softCard" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#310B5E" />
                <stop offset="100%" stop-color="#21053B" />
            </linearGradient>
        </defs>

        <!-- Background -->
        <rect width="600" height="700" fill="url(#purpleBg)" />

        <!-- Header Crest Shape at Top -->
        <path d="M 120,240 C 120,60 480,60 480,240 Z" fill="url(#purpleBg)"/>
        
        <!-- Header Top Title -->
        <text x="300" y="110" font-family="'Georgia', serif" font-style="italic" font-size="28" fill="#E1BEE7" text-anchor="middle" letter-spacing="1">LES REPAS</text>
        <text x="300" y="195" font-family="'Georgia', serif" font-size="76" font-weight="bold" font-style="italic" fill="url(#goldText)" text-anchor="middle">Plaisir</text>
        
        <!-- Gold Flavor Banner -->
        <rect x="40" y="240" width="520" height="52" rx="6" fill="url(#goldBanner)" />
        <text x="300" y="275" font-family="'Poppins', sans-serif" font-size="20" font-weight="900" fill="#240742" text-anchor="middle" letter-spacing="2">SÉLECTION GOURMET • CHUNKS IN GRAVY</text>
        
        <!-- Gold Fish & Herbs artwork -->
        <g transform="translate(160, 320) scale(1.5)" stroke="url(#goldText)" stroke-width="2.2" fill="none">
            <!-- Fish 1 -->
            <path d="M10,25 C30,10 65,10 85,25 C65,40 30,40 10,25 Z"/>
            <path d="M10,25 L-4,12 L-4,38 Z"/>
            <circle cx="70" cy="22" r="2.5" fill="url(#goldText)"/>
            <path d="M35,18 C43,22 43,28 35,32"/>
            <!-- Fish 2 -->
            <g transform="translate(95, 0)">
                <path d="M10,25 C30,10 65,10 85,25 C65,40 30,40 10,25 Z"/>
                <path d="M10,25 L-4,12 L-4,38 Z"/>
                <circle cx="70" cy="22" r="2.5" fill="url(#goldText)"/>
                <path d="M35,18 C43,22 43,28 35,32"/>
            </g>
        </g>
        
        <!-- Inner Tray Shadow & Lower Section -->
        <rect x="0" y="440" width="600" height="260" fill="url(#softCard)" />
        
        <text x="300" y="520" font-family="'Georgia', serif" font-style="italic" font-size="36" fill="#BA68C8" text-anchor="middle">Authentic French Recipe</text>
        <text x="300" y="580" font-family="'Poppins', sans-serif" font-size="22" font-weight="bold" fill="url(#goldText)" text-anchor="middle" letter-spacing="2">12 x 100g ℮ DISPLAY PACK</text>
        <text x="300" y="630" font-family="'Poppins', sans-serif" font-size="16" font-weight="600" fill="#E1BEE7" text-anchor="middle">MADE IN NORMANDY, FRANCE 🇫🇷</text>
    </svg>
    `;
    await sharp(Buffer.from(headerFrontSvg)).png().toFile('box-header-front-art.png');
    console.log('Generated box-header-front-art.png');

    // ----------------------------------------------------
    // 6. Box Side Panel Art (Angled side wall graphics)
    // ----------------------------------------------------
    const boxSideSvg = `
    <svg width="600" height="500" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="purpleSide" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#4A148C" />
                <stop offset="50%" stop-color="#380E6B" />
                <stop offset="100%" stop-color="#240742" />
            </linearGradient>
            <linearGradient id="goldSide" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFE082" />
                <stop offset="50%" stop-color="#FFD54F" />
                <stop offset="100%" stop-color="#FFB300" />
            </linearGradient>
            <linearGradient id="peachBanner" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#FFAB91" />
                <stop offset="100%" stop-color="#FF8A65" />
            </linearGradient>
        </defs>

        <rect width="600" height="500" fill="url(#purpleSide)" />

        <!-- Brand text -->
        <text x="300" y="90" font-family="'Georgia', serif" font-style="italic" font-size="32" fill="#E1BEE7" text-anchor="middle">Les Repas</text>
        <text x="300" y="165" font-family="'Georgia', serif" font-size="68" font-weight="bold" font-style="italic" fill="url(#goldSide)" text-anchor="middle">Plaisir</text>
        
        <!-- Flavor Strip -->
        <rect x="40" y="210" width="520" height="46" rx="6" fill="url(#peachBanner)" />
        <text x="300" y="242" font-family="'Poppins', sans-serif" font-size="18" font-weight="900" fill="#240742" text-anchor="middle" letter-spacing="1.5">SÉLECTION GOURMET • CHUNKS IN GRAVY</text>
        <text x="300" y="285" font-family="'Poppins', sans-serif" font-size="15" font-weight="bold" fill="#FFCCBC" text-anchor="middle">Morceaux en Sauce au Saumon &amp; Cabillaud</text>

        <!-- Gold Fish & Herbs -->
        <g transform="translate(190, 310) scale(1.4)" stroke="url(#goldSide)" stroke-width="2" fill="none">
            <path d="M10,25 C30,10 70,10 90,25 C70,40 30,40 10,25 Z"/>
            <path d="M10,25 L-5,10 L-5,40 Z"/>
            <circle cx="75" cy="22" r="3" fill="url(#goldSide)"/>
            <path d="M35,18 C45,22 45,28 35,32"/>
            <path d="M50,16 C60,22 60,28 50,34"/>
        </g>
        
        <text x="300" y="440" font-family="'Georgia', serif" font-size="26" font-weight="bold" fill="url(#goldSide)" text-anchor="middle">Premium Cat Food</text>
    </svg>
    `;
    await sharp(Buffer.from(boxSideSvg)).png().toFile('box-side-art.png');
    console.log('Generated box-side-art.png');

    // ----------------------------------------------------
    // 7. Box Front Lip Art (The lower front wall with U cutout)
    // ----------------------------------------------------
    const boxFrontLipSvg = `
    <svg width="600" height="250" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="purpleLip" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#4A148C" />
                <stop offset="50%" stop-color="#380E6B" />
                <stop offset="100%" stop-color="#240742" />
            </linearGradient>
            <linearGradient id="goldLip" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFF3E0" />
                <stop offset="30%" stop-color="#FFE082" />
                <stop offset="70%" stop-color="#FFD54F" />
                <stop offset="100%" stop-color="#FFB300" />
            </linearGradient>
        </defs>

        <rect width="600" height="250" fill="url(#purpleLip)" />

        <!-- French Rosette Flag Ribbon on Left -->
        <g transform="translate(65, 80)">
            <circle cx="28" cy="28" r="28" fill="#FFFFFF" stroke="url(#goldLip)" stroke-width="2"/>
            <path d="M12,12 L22,12 L22,44 L12,44 Z" fill="#002395"/>
            <path d="M22,12 L34,12 L34,44 L22,44 Z" fill="#FFFFFF"/>
            <path d="M34,12 L44,12 L44,44 L34,44 Z" fill="#ED2939"/>
            <polygon points="18,48 24,70 30,55 36,70 42,48" fill="#002395"/>
            <polygon points="26,48 32,70 38,55 44,70 50,48" fill="#ED2939"/>
        </g>

        <!-- Brand typography on Front Lip -->
        <text x="330" y="100" font-family="'Georgia', serif" font-size="36" font-style="italic" font-weight="bold" fill="url(#goldLip)" text-anchor="middle">Les Repas Plaisir</text>
        <text x="330" y="160" font-family="'Poppins', sans-serif" font-size="22" font-weight="bold" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">Premium Cat Food</text>
        <text x="330" y="205" font-family="'Poppins', sans-serif" font-size="14" font-weight="600" fill="#CE93D8" text-anchor="middle" letter-spacing="2">12 x 100g ℮ • FABRIQUÉ EN FRANCE</text>
    </svg>
    `;
    await sharp(Buffer.from(boxFrontLipSvg)).png().toFile('box-front-lip-art.png');
    console.log('Generated box-front-lip-art.png');

    console.log('All 3D assets generated successfully!');
}

generateAllClean3DAssets().catch(console.error);
