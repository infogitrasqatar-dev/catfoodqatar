const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createBoxTextures() {
    console.log('Generating high-resolution 3D Box & Pouch textures...');

    // 1. Box Side Texture (Royal Purple with gold foil text and fish line art)
    const boxSideSvg = `
    <svg width="512" height="600" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#5E188C" />
                <stop offset="50%" stop-color="#4A148C" />
                <stop offset="100%" stop-color="#380E6B" />
            </linearGradient>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFD700" />
                <stop offset="100%" stop-color="#FFA000" />
            </linearGradient>
            <linearGradient id="foilGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#FF6E6E" />
                <stop offset="100%" stop-color="#FFA07A" />
            </linearGradient>
        </defs>
        <!-- Background -->
        <rect width="512" height="600" fill="url(#purpleGrad)"/>
        
        <!-- Top decorative flap banner -->
        <rect x="0" y="40" width="512" height="70" fill="url(#goldGrad)" opacity="0.95"/>
        <text x="256" y="85" font-family="'Poppins', sans-serif" font-size="28" font-weight="900" fill="#380E6B" text-anchor="middle" letter-spacing="2">SALMON &amp; COD</text>
        
        <!-- Brand Title -->
        <text x="256" y="180" font-family="'Georgia', serif" font-style="italic" font-size="24" fill="#E1BEE7" text-anchor="middle">Les Repas</text>
        <text x="256" y="235" font-family="'Georgia', serif" font-size="52" font-weight="bold" fill="url(#goldGrad)" text-anchor="middle" letter-spacing="1">Plaisir</text>
        
        <!-- Gold Fish Illustration / Icon -->
        <g transform="translate(180, 270) scale(1.5)" stroke="url(#goldGrad)" stroke-width="2" fill="none">
            <path d="M10,25 C30,10 70,10 90,25 C70,40 30,40 10,25 Z"/>
            <path d="M10,25 L-5,10 L-5,40 Z"/>
            <circle cx="75" cy="22" r="3" fill="url(#goldGrad)"/>
            <path d="M35,18 C45,22 45,28 35,32"/>
            <path d="M50,16 C60,22 60,28 50,34"/>
        </g>
        
        <!-- Description Badge -->
        <rect x="40" y="380" width="432" height="48" rx="8" fill="url(#foilGrad)"/>
        <text x="256" y="412" font-family="'Poppins', sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF" text-anchor="middle">SÉLECTION GOURMET • CHUNKS IN GRAVY</text>
        
        <!-- French Flag Ribbon Badge -->
        <rect x="196" y="450" width="40" height="24" fill="#002395"/>
        <rect x="236" y="450" width="40" height="24" fill="#FFFFFF"/>
        <rect x="276" y="450" width="40" height="24" fill="#ED2939"/>
        <text x="256" y="500" font-family="'Poppins', sans-serif" font-size="16" font-weight="bold" fill="#E1BEE7" text-anchor="middle">MADE IN FRANCE</text>
        
        <!-- Sub details -->
        <text x="256" y="550" font-family="'Poppins', sans-serif" font-size="18" font-weight="600" fill="url(#goldGrad)" text-anchor="middle">PREMIUM CAT FOOD • 4 x 100g</text>
    </svg>
    `;

    await sharp(Buffer.from(boxSideSvg))
        .png()
        .toFile(path.join(__dirname, 'box-side.png'));
    console.log('Saved: box-side.png');

    // 2. Box Top Flap Texture
    const boxTopSvg = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="purpleTop" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#4A148C" />
                <stop offset="100%" stop-color="#310B5E" />
            </linearGradient>
            <linearGradient id="goldTop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFD700" />
                <stop offset="100%" stop-color="#FFA000" />
            </linearGradient>
        </defs>
        <rect width="512" height="512" fill="url(#purpleTop)"/>
        <rect x="20" y="20" width="472" height="472" fill="none" stroke="url(#goldTop)" stroke-width="3" stroke-dasharray="10,6"/>
        <text x="256" y="230" font-family="'Georgia', serif" font-size="44" font-weight="bold" fill="url(#goldTop)" text-anchor="middle">Les Repas Plaisir</text>
        <text x="256" y="290" font-family="'Poppins', sans-serif" font-size="22" font-weight="bold" fill="#FFFFFF" text-anchor="middle">⭐ TOP DISPLAY TRAY ⭐</text>
    </svg>
    `;

    await sharp(Buffer.from(boxTopSvg))
        .png()
        .toFile(path.join(__dirname, 'box-top.png'));
    console.log('Saved: box-top.png');

    // 3. Foil Edge Texture for Pouch Sides
    const foilEdgeSvg = `
    <svg width="64" height="512" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="silverFoil" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#C0C0C0" />
                <stop offset="25%" stop-color="#FFFFFF" />
                <stop offset="50%" stop-color="#E0E0E0" />
                <stop offset="75%" stop-color="#FFFFFF" />
                <stop offset="100%" stop-color="#A0A0A0" />
            </linearGradient>
        </defs>
        <rect width="64" height="512" fill="url(#silverFoil)"/>
    </svg>
    `;

    await sharp(Buffer.from(foilEdgeSvg))
        .png()
        .toFile(path.join(__dirname, 'pouch-edge.png'));
    console.log('Saved: pouch-edge.png');
}

createBoxTextures().catch(console.error);
