const sharp = require('sharp');
const fs = require('fs');

async function cleanPouchTextures() {
    console.log('Cropping and cleaning pouch textures...');

    // 1. Salmon Pouch from pouch-front.png
    // In pouch-front.png (1024x1024), the pouch itself is located from left: 260, top: 150, width: 490, height: 740
    await sharp('pouch-front.png')
        .extract({ left: 262, top: 155, width: 485, height: 730 })
        .resize(600, 880, { fit: 'fill' })
        .toFile('pouch-salmon-perfect.png');
    console.log('Saved pouch-salmon-perfect.png');

    // 2. Beef Pouch from cat-food-beef.png
    // In cat-food-beef.png, the center standing pouch is from left: 425, top: 385, width: 220, height: 355
    await sharp('cat-food-beef.png')
        .extract({ left: 425, top: 385, width: 220, height: 355 })
        .resize(600, 880, { fit: 'fill' })
        .toFile('pouch-beef-perfect.png');
    console.log('Saved pouch-beef-perfect.png');

    // 3. Trout Pouch from cat-food-trout.png
    await sharp('cat-food-trout.png')
        .extract({ left: 425, top: 385, width: 220, height: 355 })
        .resize(600, 880, { fit: 'fill' })
        .toFile('pouch-trout-perfect.png');
    console.log('Saved pouch-trout-perfect.png');

    // 4. Chicken Pouch from cat-food-chicken.png
    await sharp('cat-food-chicken.png')
        .extract({ left: 425, top: 385, width: 220, height: 355 })
        .resize(600, 880, { fit: 'fill' })
        .toFile('pouch-chicken-perfect.png');
    console.log('Saved pouch-chicken-perfect.png');

    // 5. Clean Back of Pouch from pouch-back-raw.jpg
    // In pouch-back-raw.jpg (1024x1024), the pouch itself is from left: 225, top: 60, width: 550, height: 860
    await sharp('pouch-back-raw.jpg')
        .extract({ left: 225, top: 60, width: 550, height: 860 })
        .resize(600, 880, { fit: 'fill' })
        .toFile('pouch-back-perfect.png');
    console.log('Saved pouch-back-perfect.png');
}

cleanPouchTextures().catch(console.error);
