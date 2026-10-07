// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// ===== HAMBURGER MENU TOGGLE =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ===== SCROLL REVEAL ANIMATION =====
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealOnScroll = () => {
    revealElements.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        const revealPoint = 100;

        if (elementTop < windowHeight - revealPoint) {
            el.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll, { passive: true });
window.addEventListener('load', revealOnScroll);


// =========================================================
//   THREE.JS WEBGL TRUE 3D BOX & POUCH 360° ENGINE
//   "Plaisir Gourmet Cat Food pouch & display box"
// =========================================================

const hero3DCanvas = document.getElementById('hero3DCanvas');
const heroProductShowcase = document.getElementById('heroProductShowcase');
const heroGlowAura = document.getElementById('heroGlowAura');
const heroBadgeTitle = document.getElementById('heroBadgeTitle');
const heroBadgePrice = document.getElementById('heroBadgePrice');
const heroFlavorSwitch = document.getElementById('heroFlavorSwitch');
const floatingIngredients = document.querySelectorAll('.floating-ingredient');

// Three.js Scene Variables
let scene, camera, renderer;
let mainProductGroup, boxMesh, pouchMesh, shadowMesh, particleGroup;
let pouchFrontMaterial, pouchBackMaterial, foilMaterial;
let keyLight, fillLight, rimLight, spotLight;

// Physics & Animation State
let currentRotY = 0;
let targetRotY = 0;
let currentRotX = 0;
let targetRotX = 0;
let currentRotZ = 0;
let targetRotZ = 0;
let currentTranslateY = 0;
let targetTranslateY = 0;

let scrollRotationY = 0;
let scrollPitchX = 0;
let scrollProgress = 0;

let mouseTiltX = 0;
let mouseTiltY = 0;
let isHoveringHero = false;

// Drag to Rotate State
let isDragging = false;
let startX = 0;
let startY = 0;
let dragDeltaX = 0;
let dragDeltaY = 0;
let dragVelocityX = 0;
let dragVelocityY = 0;

const lerp = (start, end, factor) => start + (end - start) * factor;

// Initialize Three.js 3D Scene
function initThree3DScene() {
    if (!hero3DCanvas || typeof THREE === 'undefined') return;

    const width = hero3DCanvas.clientWidth || 520;
    const height = hero3DCanvas.clientHeight || 480;

    // 1. Scene & Camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 0.2, 6.8);

    // 2. WebGL Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: hero3DCanvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 3. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.15);
    scene.add(ambientLight);

    keyLight = new THREE.DirectionalLight(0xffffff, 1.35);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    fillLight = new THREE.DirectionalLight(0xFFB300, 0.65);
    fillLight.position.set(-4, -2, 3);
    scene.add(fillLight);

    rimLight = new THREE.PointLight(0xAB47BC, 2.8, 15);
    rimLight.position.set(0, 3, -4);
    scene.add(rimLight);

    spotLight = new THREE.SpotLight(0xffffff, 1.6, 16, Math.PI / 4, 0.4);
    spotLight.position.set(0, 6, 5);
    spotLight.target.position.set(0, 0, 0);
    scene.add(spotLight);
    scene.add(spotLight.target);

    // 4. Main 3D Model Group
    mainProductGroup = new THREE.Group();
    scene.add(mainProductGroup);

    // Texture Loader Helper
    const textureLoader = new THREE.TextureLoader();
    const loadTex = (url) => {
        const tex = textureLoader.load(url);
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        return tex;
    };

    const frontBoxTex = loadTex('box-front-display.png');
    const backBoxTex = loadTex('box-back-display.png');
    const sideBoxTex = loadTex('box-side-display.png');
    const topBoxTex = loadTex('box-top-view.png');
    const foilEdgeTex = loadTex('pouch-foil-edge.png');
    const frontPouchTex = loadTex('pouch-salmon-perfect.png');
    const backPouchTex = loadTex('pouch-back-perfect.png');

    // ----------------------------------------------------
    // 5. BUILD SOLID VOLUMETRIC 3D DISPLAY BOX
    // ----------------------------------------------------
    const boxGeo = new THREE.BoxGeometry(2.1, 2.7, 1.4);
    const boxSideMat = new THREE.MeshStandardMaterial({ map: sideBoxTex, roughness: 0.35, metalness: 0.15 });
    const boxTopMat = new THREE.MeshStandardMaterial({ map: topBoxTex, roughness: 0.45, metalness: 0.1 });
    const boxBottomMat = new THREE.MeshStandardMaterial({ color: 0x2A0845, roughness: 0.6, metalness: 0.1 });
    const boxFrontMat = new THREE.MeshStandardMaterial({ map: frontBoxTex, roughness: 0.28, metalness: 0.2 });
    const boxBackMat = new THREE.MeshStandardMaterial({ map: backBoxTex, roughness: 0.35, metalness: 0.15 });

    const boxMaterials = [
        boxSideMat,   // Right (+X)
        boxSideMat,   // Left (-X)
        boxTopMat,    // Top (+Y)
        boxBottomMat, // Bottom (-Y)
        boxFrontMat,  // Front (+Z)
        boxBackMat    // Back (-Z)
    ];

    boxMesh = new THREE.Mesh(boxGeo, boxMaterials);
    boxMesh.position.set(0.65, -0.02, -0.3);
    boxMesh.castShadow = true;
    boxMesh.receiveShadow = true;
    mainProductGroup.add(boxMesh);

    // ----------------------------------------------------
    // 6. BUILD SOLID VOLUMETRIC 3D STANDING POUCH
    // ----------------------------------------------------
    const pouchGeo = new THREE.BoxGeometry(1.65, 2.38, 0.18);
    pouchFrontMaterial = new THREE.MeshStandardMaterial({ map: frontPouchTex, roughness: 0.2, metalness: 0.3 });
    pouchBackMaterial = new THREE.MeshStandardMaterial({ map: backPouchTex, roughness: 0.28, metalness: 0.18 });
    foilMaterial = new THREE.MeshStandardMaterial({ map: foilEdgeTex, roughness: 0.15, metalness: 0.85 });

    const pouchMaterials = [
        foilMaterial,       // Right (+X)
        foilMaterial,       // Left (-X)
        foilMaterial,       // Top (+Y)
        foilMaterial,       // Bottom (-Y)
        pouchFrontMaterial, // Front (+Z)
        pouchBackMaterial   // Back (-Z)
    ];

    pouchMesh = new THREE.Mesh(pouchGeo, pouchMaterials);
    pouchMesh.position.set(-0.9, -0.15, 0.45);
    pouchMesh.rotation.y = -0.2;
    pouchMesh.rotation.z = -0.04;
    pouchMesh.castShadow = true;
    pouchMesh.receiveShadow = true;
    mainProductGroup.add(pouchMesh);

    // ----------------------------------------------------
    // 7. DYNAMIC FLOOR SHADOW PLANE
    // ----------------------------------------------------
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 512;
    shadowCanvas.height = 512;
    const shadowCtx = shadowCanvas.getContext('2d');
    const shadowGrad = shadowCtx.createRadialGradient(256, 256, 0, 256, 256, 230);
    shadowGrad.addColorStop(0, 'rgba(32, 16, 48, 0.55)');
    shadowGrad.addColorStop(0.45, 'rgba(74, 20, 140, 0.22)');
    shadowGrad.addColorStop(0.8, 'rgba(74, 20, 140, 0.06)');
    shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
    shadowCtx.fillStyle = shadowGrad;
    shadowCtx.fillRect(0, 0, 512, 512);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(5.8, 4.4);
    const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: 0.85, depthWrite: false });
    shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.48;
    scene.add(shadowMesh);

    // ----------------------------------------------------
    // 8. 3D ORBITING SPARKLE STAR SYSTEM
    // ----------------------------------------------------
    particleGroup = new THREE.Group();
    const particleGeo = new THREE.SphereGeometry(0.045, 8, 8);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xFFD700, roughness: 0.2, metalness: 0.8, emissive: 0xFFA000, emissiveIntensity: 0.5 });
    const purpleMat = new THREE.MeshStandardMaterial({ color: 0xCE93D8, roughness: 0.3, metalness: 0.5, emissive: 0x8E24AA, emissiveIntensity: 0.5 });

    for (let i = 0; i < 30; i++) {
        const pMesh = new THREE.Mesh(particleGeo, i % 2 === 0 ? goldMat : purpleMat);
        const radius = 2.4 + Math.random() * 1.6;
        const theta = Math.random() * Math.PI * 2;
        const yPos = (Math.random() - 0.5) * 3.2;
        pMesh.position.set(Math.cos(theta) * radius, yPos, Math.sin(theta) * radius);
        pMesh.userData = { radius, theta, speed: 0.008 + Math.random() * 0.012, yBase: yPos };
        particleGroup.add(pMesh);
    }
    scene.add(particleGroup);

    // Resize Handler
    window.addEventListener('resize', () => {
        if (!hero3DCanvas) return;
        const w = hero3DCanvas.clientWidth;
        const h = hero3DCanvas.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
    });
}

// Scroll Listener: 3D rotation & floating ingredient dispersion
const onHeroScroll = () => {
    const scrollY = window.scrollY;
    scrollProgress = Math.min(scrollY / 1000, 2);

    // Smooth multi-axis 3D rotation driven by mouse scroll
    scrollRotationY = scrollY * 0.35;
    scrollPitchX = Math.sin(scrollY * 0.005) * 12;

    // Disperse DOM floating ingredients with 3D depth parallax
    floatingIngredients.forEach((el, index) => {
        const depth = parseFloat(el.dataset.depth || 2);
        const directionX = (index % 2 === 0 ? -1 : 1) * (index + 1) * 35;
        const disperseY = scrollProgress * 120 * (depth / 2);
        const disperseX = scrollProgress * directionX;
        const disperseZ = 30 + scrollProgress * 80 * depth;

        el.style.transform = `
            translate3d(${disperseX.toFixed(1)}px, ${-disperseY.toFixed(1)}px, ${disperseZ.toFixed(1)}px)
            scale(${Math.max(0.85, 1 - scrollProgress * 0.15)})
        `;
        el.style.opacity = Math.max(0.2, 1 - scrollProgress * 0.65);
    });
};

window.addEventListener('scroll', onHeroScroll, { passive: true });

// Mouse Movement & 360° Drag Interaction
if (heroProductShowcase) {
    heroProductShowcase.addEventListener('mouseenter', () => {
        isHoveringHero = true;
    });

    heroProductShowcase.addEventListener('mousemove', (e) => {
        if (isDragging) return;
        const rect = heroProductShowcase.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        mouseTiltY = (x / (rect.width / 2)) * 18;
        mouseTiltX = -(y / (rect.height / 2)) * 14;
    });

    heroProductShowcase.addEventListener('mouseleave', () => {
        isHoveringHero = false;
        mouseTiltX = 0;
        mouseTiltY = 0;
    });

    heroProductShowcase.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        dragVelocityX = 0;
        dragVelocityY = 0;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        dragDeltaX = e.clientX - startX;
        dragDeltaY = e.clientY - startY;

        dragVelocityX = dragDeltaX * 0.4;
        dragVelocityY = dragDeltaY * 0.25;

        targetRotY += dragVelocityX;
        targetRotX -= dragVelocityY;

        startX = e.clientX;
        startY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Touch Support
    heroProductShowcase.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isDragging = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        dragDeltaX = e.touches[0].clientX - startX;
        dragDeltaY = e.touches[0].clientY - startY;

        targetRotY += dragDeltaX * 0.5;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', () => {
        isDragging = false;
    });
}

// Interactive Flavor Switcher with 3D Flip Burst & Texture Swap
if (heroFlavorSwitch) {
    const buttons = heroFlavorSwitch.querySelectorAll('.flavor-switch-btn');
    const textureLoader = new THREE.TextureLoader();

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const newImg = btn.dataset.img;
            const newName = btn.dataset.name;
            const newPrice = btn.dataset.price;
            const newColor = btn.dataset.color || '#7B1FA2';

            // 3D Flip burst animation
            targetRotY += 360;

            // Load new pouch texture
            textureLoader.load(newImg, (tex) => {
                if (renderer) tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
                if (pouchFrontMaterial) {
                    pouchFrontMaterial.map = tex;
                    pouchFrontMaterial.needsUpdate = true;
                }
            });

            if (heroBadgeTitle) heroBadgeTitle.textContent = newName;
            if (heroBadgePrice) heroBadgePrice.textContent = newPrice;
            if (heroGlowAura) {
                heroGlowAura.style.background = `radial-gradient(circle, ${newColor}33 0%, #FF6E6E22 45%, transparent 70%)`;
            }
            if (rimLight) {
                rimLight.color.set(newColor);
            }
        });
    });
}

// Three.js Render & Physics Loop
function animateThreeScene() {
    requestAnimationFrame(animateThreeScene);

    // Momentum decay
    if (!isDragging) {
        dragVelocityX *= 0.92;
        dragVelocityY *= 0.92;
        targetRotY += dragVelocityX;
        targetRotX -= dragVelocityY;
    }

    // Idle breathing float
    const time = Date.now() * 0.002;
    const floatY = Math.sin(time) * 0.08;
    const floatTiltZ = Math.sin(time * 0.8) * 0.03;

    // Combined target angles (deg to rad)
    const totalYDeg = scrollRotationY + targetRotY + (isHoveringHero ? mouseTiltY : 0);
    const totalXDeg = scrollPitchX + targetRotX + (isHoveringHero ? mouseTiltX : 0);

    const targetRadY = (totalYDeg * Math.PI) / 180;
    const targetRadX = (totalXDeg * Math.PI) / 180;
    targetTranslateY = floatY - (scrollProgress * 0.3);

    // Lerp smoothing
    const lerpFactor = isDragging ? 0.35 : 0.08;
    currentRotY = lerp(currentRotY, targetRadY, lerpFactor);
    currentRotX = lerp(currentRotX, targetRadX, lerpFactor);
    currentRotZ = lerp(currentRotZ, floatTiltZ, lerpFactor);
    currentTranslateY = lerp(currentTranslateY, targetTranslateY, 0.08);

    if (mainProductGroup) {
        mainProductGroup.rotation.y = currentRotY;
        mainProductGroup.rotation.x = currentRotX;
        mainProductGroup.rotation.z = currentRotZ;
        mainProductGroup.position.y = currentTranslateY;

        const scale = isHoveringHero || isDragging ? 1.04 : 1.0;
        mainProductGroup.scale.set(scale, scale, scale);
    }

    // Animate orbiting 3D particles
    if (particleGroup) {
        particleGroup.children.forEach(p => {
            p.userData.theta += p.userData.speed;
            p.position.x = Math.cos(p.userData.theta) * p.userData.radius;
            p.position.z = Math.sin(p.userData.theta) * p.userData.radius;
            p.position.y = p.userData.yBase + Math.sin(time + p.userData.theta) * 0.15;
        });
    }

    // Shadow tracking
    if (shadowMesh) {
        shadowMesh.position.x = Math.sin(currentRotY) * 0.15;
        shadowMesh.scale.set(1 - Math.abs(currentTranslateY) * 0.2, 1 - Math.abs(currentTranslateY) * 0.2, 1);
    }

    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// Initialize on Load
window.addEventListener('load', () => {
    initThree3DScene();
    animateThreeScene();
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
        if (!scene) {
            initThree3DScene();
            animateThreeScene();
        }
    }, 100);
}


// =========================================================
//            SHOPPING CART & PRODUCT CATALOG
// =========================================================

let cart = JSON.parse(localStorage.getItem('scoopland_cart')) || [];
let currentEditingCartKey = null;

// DOM Elements
const cartToggleBtn = document.getElementById('cartToggleBtn');
const cartCloseBtn = document.getElementById('cartCloseBtn');
const cartOverlay = document.getElementById('cartOverlay');
const cartDrawer = document.getElementById('cartDrawer');
const cartDrawerBody = document.getElementById('cartDrawerBody');
const cartDrawerFooter = document.getElementById('cartDrawerFooter');
const cartBadge = document.getElementById('cartBadge');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTotal = document.getElementById('cartTotal');

// Save cart to local storage
const saveCart = () => {
    localStorage.setItem('scoopland_cart', JSON.stringify(cart));
    updateCartUI();
};

// Open/Close Cart Drawer
const toggleCart = () => {
    cartDrawer.classList.toggle('active');
    cartOverlay.classList.toggle('active');
};

if (cartToggleBtn) cartToggleBtn.addEventListener('click', toggleCart);
if (cartCloseBtn) cartCloseBtn.addEventListener('click', toggleCart);
if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

// Customizer Modal Elements
const customizerModalOverlay = document.getElementById('customizerModalOverlay');
const customizerCloseBtn = document.getElementById('customizerCloseBtn');
const customizerForm = document.getElementById('customizerForm');
const customizerImg = document.getElementById('customizerImg');
const customizerTitle = document.getElementById('customizerTitle');
const customizerDesc = document.getElementById('customizerDesc');
const customizerLivePrice = document.getElementById('customizerLivePrice');

let currentCustomizingFlavor = null;

// Update Cart Badge and Drawer Content
const updateCartUI = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        cartBadge.classList.remove('bounce');
        void cartBadge.offsetWidth;
        if (totalItems > 0) {
            cartBadge.classList.add('bounce');
        }
    }

    if (!cartDrawerBody) return;

    if (cart.length === 0) {
        cartDrawerBody.innerHTML = `
            <div class="cart-empty-message">
                <span class="empty-cart-icon">🛒</span>
                <p>Your pet cart is empty.</p>
                <p class="empty-sub">Add some gourmet pouches or kibbles to start!</p>
            </div>
        `;
        if (cartDrawerFooter) cartDrawerFooter.style.display = 'none';
    } else {
        if (cartDrawerFooter) cartDrawerFooter.style.display = 'block';
        cartDrawerBody.innerHTML = '';
        
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.qty;
            subtotal += itemTotal;
            
            // Format format and nutrition addons descriptions
            let formatLabel = item.size === 'single' ? 'Single Pouch (100g)' : (item.size === 'carton' ? '12-Pack Carton' : 'Standard 4x100g Box');
            const styleLabel = item.vessel || 'Chunks in Gravy';
            const addonsLabel = item.toppings && item.toppings.length > 0 
                ? `<div class="cart-item-customizations">
                    ${formatLabel} • ${styleLabel}<br>
                    <strong>+ Boosters:</strong> ${item.toppings.join(', ')}
                   </div>`
                : `<div class="cart-item-customizations">
                    ${formatLabel} • ${styleLabel}
                   </div>`;
            
            const cartItemHTML = `
                <div class="cart-item" data-key="${item.key}">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        ${addonsLabel}
                        <span class="cart-item-price">QAR ${item.price.toFixed(2)}</span>
                    </div>
                    <div class="cart-item-controls">
                        <button class="qty-btn minus-btn" onclick="changeQty('${item.key}', -1)">-</button>
                        <span class="qty-val">${item.qty}</span>
                        <button class="qty-btn plus-btn" onclick="changeQty('${item.key}', 1)">+</button>
                    </div>
                    <div class="cart-item-actions" style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
                        <button class="cart-item-edit" onclick="editCartItem('${item.key}')" aria-label="Edit item">✏️</button>
                        <button class="cart-item-remove" onclick="removeCartItem('${item.key}')" aria-label="Remove item">🗑️</button>
                    </div>
                </div>
            `;
            cartDrawerBody.insertAdjacentHTML('beforeend', cartItemHTML);
        });
        
        if (cartSubtotal) cartSubtotal.textContent = `QAR ${subtotal.toFixed(2)}`;
        if (cartTotal) cartTotal.textContent = `QAR ${subtotal.toFixed(2)}`;
    }
};

// Open Customizer Modal
const openCustomizer = (id, name, basePrice, image, description, existingItem = null) => {
    currentCustomizingFlavor = { id, name, basePrice, image, description };
    currentEditingCartKey = existingItem ? existingItem.key : null;
    
    if (customizerForm) {
        customizerForm.reset();
        customizerForm.querySelectorAll('.topping-item').forEach(item => {
            item.classList.remove('checked');
        });
        
        if (existingItem) {
            const sizeRadio = customizerForm.querySelector(`input[name="flavorSize"][value="${existingItem.size}"]`);
            if (sizeRadio) sizeRadio.checked = true;
            
            const vesselRadio = customizerForm.querySelector(`input[name="flavorVessel"][value="${existingItem.vessel}"]`);
            if (vesselRadio) vesselRadio.checked = true;
            
            if (existingItem.toppings && existingItem.toppings.length > 0) {
                existingItem.toppings.forEach(toppingVal => {
                    const toppingCb = customizerForm.querySelector(`input[name="flavorToppings"][value="${toppingVal}"]`);
                    if (toppingCb) {
                        toppingCb.checked = true;
                        const toppingItem = toppingCb.closest('.topping-item');
                        if (toppingItem) toppingItem.classList.add('checked');
                    }
                });
            }
        }
    }
    
    if (customizerImg) {
        customizerImg.src = image;
        customizerImg.alt = name;
    }
    if (customizerTitle) customizerTitle.textContent = name;
    if (customizerDesc) customizerDesc.textContent = description;
    
    if (customizerModalOverlay) {
        customizerModalOverlay.classList.add('active');
    }
    
    updateCustomizerPrice();
};

const closeCustomizer = () => {
    if (customizerModalOverlay) {
        customizerModalOverlay.classList.remove('active');
    }
    currentCustomizingFlavor = null;
    currentEditingCartKey = null;
};

if (customizerCloseBtn) customizerCloseBtn.addEventListener('click', closeCustomizer);
if (customizerModalOverlay) {
    customizerModalOverlay.addEventListener('click', (e) => {
        if (e.target === customizerModalOverlay) closeCustomizer();
    });
}

// Calculate and display live customized price
const updateCustomizerPrice = () => {
    if (!currentCustomizingFlavor) return;
    
    let totalPrice = currentCustomizingFlavor.basePrice;
    
    const selectedSizeRadio = customizerForm.querySelector('input[name="flavorSize"]:checked');
    if (selectedSizeRadio) {
        totalPrice += parseFloat(selectedSizeRadio.dataset.priceAdd || 0);
    }
    
    const checkedToppings = customizerForm.querySelectorAll('input[name="flavorToppings"]:checked');
    checkedToppings.forEach(cb => {
        totalPrice += parseFloat(cb.dataset.priceAdd || 0);
    });

    if (totalPrice < 3.75) totalPrice = 3.75;
    
    if (customizerLivePrice) {
        customizerLivePrice.textContent = `QAR ${totalPrice.toFixed(2)}`;
    }
};

if (customizerForm) {
    customizerForm.addEventListener('change', (e) => {
        if (e.target.name === 'flavorToppings') {
            const toppingItem = e.target.closest('.topping-item');
            if (toppingItem) {
                if (e.target.checked) {
                    toppingItem.classList.add('checked');
                } else {
                    toppingItem.classList.remove('checked');
                }
            }
        }
        updateCustomizerPrice();
    });
    
    customizerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!currentCustomizingFlavor) return;
        
        const sizeRadio = customizerForm.querySelector('input[name="flavorSize"]:checked');
        const vesselRadio = customizerForm.querySelector('input[name="flavorVessel"]:checked');
        const toppingCbs = customizerForm.querySelectorAll('input[name="flavorToppings"]:checked');
        
        const size = sizeRadio ? sizeRadio.value : 'box';
        const vessel = vesselRadio ? vesselRadio.value : 'Chunks in Gravy';
        
        const toppings = [];
        toppingCbs.forEach(cb => toppings.push(cb.value));
        
        let price = currentCustomizingFlavor.basePrice;
        if (sizeRadio) price += parseFloat(sizeRadio.dataset.priceAdd || 0);
        toppingCbs.forEach(cb => price += parseFloat(cb.dataset.priceAdd || 0));
        if (price < 3.75) price = 3.75;
        
        const key = currentCustomizingFlavor.id + '_' + size + '_' + vessel.replace(/\s+/g, '') + '_' + toppings.slice().sort().join(',');
        
        if (currentEditingCartKey) {
            const editIdx = cart.findIndex(item => item.key === currentEditingCartKey);
            if (editIdx !== -1) {
                const editItem = cart[editIdx];
                const duplicateIdx = cart.findIndex((item, idx) => item.key === key && idx !== editIdx);
                
                if (duplicateIdx !== -1) {
                    cart[duplicateIdx].qty += editItem.qty;
                    cart.splice(editIdx, 1);
                } else {
                    editItem.key = key;
                    editItem.price = price;
                    editItem.size = size;
                    editItem.vessel = vessel;
                    editItem.toppings = toppings;
                }
            }
        } else {
            const existingItem = cart.find(item => item.key === key);
            if (existingItem) {
                existingItem.qty += 1;
            } else {
                cart.push({
                    key: key,
                    id: currentCustomizingFlavor.id,
                    name: currentCustomizingFlavor.name,
                    basePrice: currentCustomizingFlavor.basePrice,
                    price: price,
                    image: currentCustomizingFlavor.image,
                    qty: 1,
                    size: size,
                    vessel: vessel,
                    toppings: toppings
                });
            }
        }
        
        saveCart();
        closeCustomizer();
        
        if (!cartDrawer.classList.contains('active')) {
            toggleCart();
        }
    });
}

window.changeQty = (key, delta) => {
    const item = cart.find(item => item.key === key);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter(item => item.key !== key);
        }
        saveCart();
    }
};

window.removeCartItem = (key) => {
    cart = cart.filter(item => item.key !== key);
    saveCart();
};

window.editCartItem = (key) => {
    const item = cart.find(i => i.key === key);
    if (!item) return;
    
    const card = document.querySelector(`.flavor-card[data-id="${item.id}"]`);
    let basePrice = item.basePrice;
    let description = '';
    if (card) {
        basePrice = parseFloat(card.dataset.price);
        const descEl = card.querySelector('.flavor-card-content p');
        description = descEl ? descEl.textContent : '';
    }
    
    if (cartDrawer && cartDrawer.classList.contains('active')) {
        toggleCart();
    }
    
    openCustomizer(item.id, item.name, basePrice, item.image, description, item);
};

// Add to Cart Card button click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart-btn')) {
        const card = e.target.closest('.flavor-card');
        if (card) {
            const id = parseInt(card.dataset.id);
            const name = card.dataset.name;
            const price = parseFloat(card.dataset.price);
            const image = card.dataset.image;
            
            const descEl = card.querySelector('.flavor-card-content p');
            const description = descEl ? descEl.textContent : '';
            
            openCustomizer(id, name, price, image, description);
        }
    }
});

updateCartUI();


// =========================================================
//              CHECKOUT & REALTIME TRACKING
// =========================================================

const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModalOverlay = document.getElementById('checkoutModalOverlay');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const checkoutForm = document.getElementById('checkoutForm');
const checkoutFormStep = document.getElementById('checkoutFormStep');
const checkoutTrackerStep = document.getElementById('checkoutTrackerStep');
const closeTrackerBtn = document.getElementById('closeTrackerBtn');

let currentOrderId = null;
let currentTrackingOrderId = localStorage.getItem('scoopland_active_order_id') || null;

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        toggleCart();
        if (checkoutModalOverlay) {
            checkoutModalOverlay.classList.add('active');
            checkoutFormStep.classList.add('active');
            checkoutTrackerStep.classList.remove('active');
            closeTrackerBtn.style.display = 'none';
        }
    });
}

const closeModal = () => {
    if (checkoutModalOverlay) checkoutModalOverlay.classList.remove('active');
};
if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
if (checkoutModalOverlay) {
    checkoutModalOverlay.addEventListener('click', (e) => {
        if (e.target === checkoutModalOverlay) closeModal();
    });
}

// Handle Order Placement
if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('custName').value.trim();
        const phone = document.getElementById('custPhone').value.trim();
        const address = document.getElementById('custAddress').value.trim();
        const notes = document.getElementById('custNotes').value.trim();
        
        currentOrderId = 'PL-' + Math.floor(10000000 + Math.random() * 90000000);
        
        const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        
        const newOrder = {
            id: currentOrderId,
            customer: name,
            phone: phone,
            address: address,
            notes: notes,
            items: [...cart],
            total: totalAmount,
            status: 'Ordered',
            timestamp: new Date().toLocaleString()
        };
        
        const orders = JSON.parse(localStorage.getItem('scoopland_orders')) || [];
        orders.unshift(newOrder);
        localStorage.setItem('scoopland_orders', JSON.stringify(orders));
        
        // Show Tracker step
        checkoutFormStep.classList.remove('active');
        checkoutTrackerStep.classList.add('active');
        
        runDeliveryTracker();
    });
}

// Order Status Steps config
const statusDetails = {
    'Ordered': {
        progress: '15%',
        stepIndex: 1,
        title: "Order Placed Successfully! 🐾",
        desc: "We've received your gourmet pet food order and verified stock with Ras International Trading warehouse.",
        animation: '<span class="animated-icon spinner">⏳</span>'
    },
    'Packing': {
        progress: '45%',
        stepIndex: 2,
        title: "Packing Fresh Pouches 📦",
        desc: "Our Doha warehouse is carefully packing your cat food boxes and inspecting batch freshness.",
        animation: '<span class="animated-icon">📦</span>'
    },
    'On the Way': {
        progress: '75%',
        stepIndex: 3,
        title: "Express Courier on the Way! 🚚",
        desc: "Your pet food delivery driver is en route across Qatar. Keep your feline companion ready!",
        animation: '<span class="animated-icon">🚚</span>'
    },
    'Delivered': {
        progress: '100%',
        stepIndex: 4,
        title: "Delivered to Your Doorstep! 🐱",
        desc: "Bon Appétit! Your cat's gourmet Plaisir feast has arrived. Thank you for shopping with us!",
        animation: '<span class="animated-icon">🎉</span>'
    }
};

const renderTrackerStatus = (status, prefix = 'tracker') => {
    const details = statusDetails[status] || statusDetails['Ordered'];
    
    const progressBar = document.getElementById(prefix === 'tracker' ? 'trackerProgressBar' : 'trackStatusProgressBar');
    const animContainer = document.getElementById(prefix === 'tracker' ? 'trackerAnimation' : 'trackStatusAnimation');
    const statusTitle = document.getElementById(prefix === 'tracker' ? 'trackerStatusTitle' : 'trackStatusTitle');
    const statusDesc = document.getElementById(prefix === 'tracker' ? 'trackerStatusDesc' : 'trackStatusDesc');
    const closeBtn = document.getElementById('closeTrackerBtn');

    if (progressBar) progressBar.style.width = details.progress;

    for (let i = 1; i <= 4; i++) {
        const stepEl = document.getElementById(prefix === 'tracker' ? `trackStep${i}` : `trackStatusStep${i}`);
        if (stepEl) {
            if (i <= details.stepIndex) {
                stepEl.classList.add('active');
            } else {
                stepEl.classList.remove('active');
            }
        }
    }

    if (status === 'Delivered') {
        if (closeBtn && prefix === 'tracker') {
            closeBtn.style.display = 'block';
        }
    } else {
        if (closeBtn && prefix === 'tracker') {
            closeBtn.style.display = 'none';
        }
    }

    if (animContainer) animContainer.innerHTML = details.animation;
    if (statusTitle) statusTitle.textContent = details.title;
    if (statusDesc) statusDesc.textContent = details.desc;
};

const syncActiveOrderTracker = () => {
    if (!currentTrackingOrderId) return;
    
    const orders = JSON.parse(localStorage.getItem('scoopland_orders')) || [];
    const ourOrder = orders.find(o => o.id === currentTrackingOrderId);
    if (ourOrder) {
        renderTrackerStatus(ourOrder.status, 'tracker');
        renderTrackerStatus(ourOrder.status, 'trackStatus');
        
        if (ourOrder.status === 'Delivered') {
            localStorage.removeItem('scoopland_active_order_id');
            cart = [];
            saveCart();
        }
    }
};

const runDeliveryTracker = () => {
    localStorage.setItem('scoopland_active_order_id', currentOrderId);
    currentTrackingOrderId = currentOrderId;
    syncActiveOrderTracker();
};

if (closeTrackerBtn) {
    closeTrackerBtn.addEventListener('click', () => {
        closeModal();
        if (checkoutForm) checkoutForm.reset();
    });
}


// =========================================================
//            PRODUCT FILTERS & INSTANT SEARCH
// =========================================================

const flavorSearch = document.getElementById('flavorSearch');
const filterPills = document.getElementById('filterPills');

const filterFlavors = () => {
    const query = flavorSearch ? flavorSearch.value.toLowerCase().trim() : '';
    const activePill = filterPills ? filterPills.querySelector('.filter-pill.active') : null;
    const filterValue = activePill ? activePill.dataset.filter : 'all';
    const flavorCards = document.querySelectorAll('.flavor-card');
    
    flavorCards.forEach(card => {
        const name = card.dataset.name.toLowerCase();
        const category = card.dataset.category;
        
        const matchesSearch = name.includes(query);
        const matchesCategory = filterValue === 'all' || category === filterValue;
        
        if (matchesSearch && matchesCategory) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
};

if (flavorSearch) {
    flavorSearch.addEventListener('input', filterFlavors);
}

if (filterPills) {
    filterPills.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-pill')) {
            filterPills.querySelectorAll('.filter-pill').forEach(pill => {
                pill.classList.remove('active');
            });
            e.target.classList.add('active');
            filterFlavors();
        }
    });
}


// =========================================================
//            INTERACTIVE REVIEWS SYSTEM
// =========================================================

const starRatingInput = document.getElementById('starRatingInput');
const selectedRating = document.getElementById('selectedRating');
const reviewForm = document.getElementById('reviewForm');
const testimonialsGrid = document.querySelector('.testimonials-grid');

if (starRatingInput) {
    const stars = starRatingInput.querySelectorAll('.star-input');
    
    const highlightStars = (rating) => {
        stars.forEach(star => {
            const starValue = parseInt(star.dataset.rating);
            if (starValue <= rating) {
                star.classList.add('hovered');
            } else {
                star.classList.remove('hovered');
            }
        });
    };
    
    const resetStars = () => {
        const currentRating = parseInt(selectedRating.value);
        stars.forEach(star => {
            const starValue = parseInt(star.dataset.rating);
            if (starValue <= currentRating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
            star.classList.remove('hovered');
        });
    };

    stars.forEach(star => {
        star.addEventListener('mouseenter', () => {
            highlightStars(parseInt(star.dataset.rating));
        });

        star.addEventListener('click', () => {
            selectedRating.value = parseInt(star.dataset.rating);
            resetStars();
        });
    });

    starRatingInput.addEventListener('mouseleave', resetStars);
}

if (reviewForm && testimonialsGrid) {
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('reviewName').value.trim();
        const role = document.getElementById('reviewRole').value.trim() || 'Pet Parent • Qatar';
        const rating = parseInt(selectedRating.value);
        const text = document.getElementById('reviewText').value.trim();
        
        const starsStr = '★'.repeat(rating) + '☆'.repeat(5 - rating);
        const avatarLetter = name.charAt(0).toUpperCase();
        
        const cardHTML = document.createElement('div');
        cardHTML.className = 'testimonial-card reveal active';
        cardHTML.style.animation = 'fadeInUp 0.6s ease';
        
        cardHTML.innerHTML = `
            <div class="testimonial-stars" style="color: var(--accent);">${starsStr}</div>
            <p class="testimonial-text">"${text}"</p>
            <div class="testimonial-author">
                <div class="testimonial-avatar">${avatarLetter}</div>
                <div>
                    <div class="testimonial-name">${name}</div>
                    <div class="testimonial-role">${role}</div>
                </div>
            </div>
        `;
        
        testimonialsGrid.prepend(cardHTML);
        reviewForm.reset();
        selectedRating.value = 5;
        if (starRatingInput) {
            starRatingInput.querySelectorAll('.star-input').forEach(star => star.classList.add('active'));
        }
        
        cardHTML.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}


// =========================================================
//            TRACK ORDER MODAL & LOOKUP
// =========================================================

const trackOrderNavBtn = document.getElementById('trackOrderNavBtn');
const footerTrackBtn = document.getElementById('footerTrackBtn');
const trackOrderModalOverlay = document.getElementById('trackOrderModalOverlay');
const trackOrderCloseBtn = document.getElementById('trackOrderCloseBtn');
const trackLookupForm = document.getElementById('trackLookupForm');
const trackLookupStep = document.getElementById('trackLookupStep');
const trackStatusStep = document.getElementById('trackStatusStep');
const trackOrderIdInput = document.getElementById('trackOrderIdInput');
const trackLookupError = document.getElementById('trackLookupError');
const closeTrackStatusBtn = document.getElementById('closeTrackStatusBtn');

const openTrackOrderModal = (e) => {
    if (e) e.preventDefault();
    if (trackLookupStep) trackLookupStep.classList.add('active');
    if (trackStatusStep) trackStatusStep.classList.remove('active');
    if (trackLookupError) trackLookupError.style.display = 'none';
    if (trackLookupForm) trackLookupForm.reset();
    
    const activeId = localStorage.getItem('scoopland_active_order_id') || currentTrackingOrderId;
    if (activeId && trackOrderIdInput) {
        trackOrderIdInput.value = activeId;
    }
    
    if (trackOrderModalOverlay) {
        trackOrderModalOverlay.classList.add('active');
    }
};

const closeTrackOrderModal = () => {
    if (trackOrderModalOverlay) {
        trackOrderModalOverlay.classList.remove('active');
    }
};

if (trackOrderNavBtn) trackOrderNavBtn.addEventListener('click', openTrackOrderModal);
if (footerTrackBtn) footerTrackBtn.addEventListener('click', openTrackOrderModal);
if (trackOrderCloseBtn) trackOrderCloseBtn.addEventListener('click', closeTrackOrderModal);
if (trackOrderModalOverlay) {
    trackOrderModalOverlay.addEventListener('click', (e) => {
        if (e.target === trackOrderModalOverlay) closeTrackOrderModal();
    });
}

if (trackLookupForm) {
    trackLookupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!trackOrderIdInput) return;
        const orderId = trackOrderIdInput.value.trim();
        
        const orders = JSON.parse(localStorage.getItem('scoopland_orders')) || [];
        const order = orders.find(o => o.id === orderId);
        
        if (order) {
            currentTrackingOrderId = orderId;
            if (order.status !== 'Delivered') {
                localStorage.setItem('scoopland_active_order_id', orderId);
            }
            
            if (trackLookupStep) trackLookupStep.classList.remove('active');
            if (trackStatusStep) trackStatusStep.classList.add('active');
            
            renderTrackerStatus(order.status, 'trackStatus');
        } else {
            if (trackLookupError) {
                trackLookupError.textContent = `Order "${orderId}" not found. Please verify your reference ID.`;
                trackLookupError.style.display = 'block';
            }
        }
    });
}

if (closeTrackStatusBtn) {
    closeTrackStatusBtn.addEventListener('click', () => {
        if (trackLookupStep) trackLookupStep.classList.add('active');
        if (trackStatusStep) trackStatusStep.classList.remove('active');
    });
}

// Sync across tabs
window.addEventListener('storage', (e) => {
    if (e.key === 'scoopland_orders') {
        syncActiveOrderTracker();
    }
});
