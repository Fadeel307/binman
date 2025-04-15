// BinMan Mobile App 3D Model using Three.js
document.addEventListener('DOMContentLoaded', function() {
    // Check if the 3D model container exists in the page
    const container = document.getElementById('threed-trash-can');
    if (!container) return;

    // Get loading spinner
    const loadingSpinner = container.querySelector('.loading-spinner');

    // Initialize scene, camera, and renderer
    let scene, camera, renderer, phone, phoneGroup;
    let isAnimating = false;
    let isHovered = false;
    let clock = new THREE.Clock();
    let particles;
    let orbitingTextGroup;

    // Set up scene
    function init() {
        // Create scene with transparent background
        scene = new THREE.Scene();
        
        // Set up camera
        camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 0, 5);
        
        // Set up renderer with anti-aliasing and shadow support
        renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Hide loading spinner and append renderer
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }
        container.appendChild(renderer.domElement);
        
        // Make renderer responsive
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        
        // Add controls
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.maxPolarAngle = Math.PI / 1.5;
        controls.minPolarAngle = Math.PI / 3;
        controls.rotateSpeed = 0.4;
        controls.enableZoom = true;
        controls.enablePan = false;
        controls.maxDistance = 10;
        controls.minDistance = 3;
        
        // Set up lighting for cinematic effect
        setupLighting();
        
        // Create the phone model as the central stationary object
        createPhoneModel();
        
        // Create orbiting 3D text
        createOrbitingText();
        
        // Add environment with particles for space effect
        addEnvironment();
        
        // Add interactive effects
        addInteractivity();
        
        // Start the animation loop
        animate();
    }

    // Set up advanced lighting for cinematic rendering
    function setupLighting() {
        // Ambient light for general illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);
        
        // Key light from top-right
        const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
        keyLight.position.set(5, 5, 5);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 1024;
        keyLight.shadow.mapSize.height = 1024;
        scene.add(keyLight);
        
        // Fill light from left
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
        fillLight.position.set(-5, 0, 5);
        scene.add(fillLight);
        
        // Rim light from behind with green tint
        const rimLight = new THREE.DirectionalLight(0x4BF3A0, 1.0);
        rimLight.position.set(0, 0, -10);
        scene.add(rimLight);
        
        // Spotlight to follow the orbiting text
        const spotLight = new THREE.SpotLight(0x4BF3A0, 2.0, 30, Math.PI / 4, 0.3, 1);
        spotLight.position.set(0, 5, 5);
        spotLight.target.position.set(0, 0, 0);
        scene.add(spotLight);
        scene.add(spotLight.target);
    }

    // Add particles for space-like environment
    function addEnvironment() {
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 150;
        
        const posArray = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            // Place particles in a spherical volume around the scene
            const radius = 15 + Math.random() * 10;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
            posArray[i+1] = radius * Math.sin(phi) * Math.sin(theta);
            posArray[i+2] = radius * Math.cos(phi);
            
            // Green/blue/white colors for space effect
            colors[i] = 0.0 + Math.random() * 0.2;     // R
            colors[i+1] = 0.6 + Math.random() * 0.4;   // G
            colors[i+2] = 0.4 + Math.random() * 0.6;   // B
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);
    }

    // Function to animate particles
    function animateParticles() {
        if (!particles) return;
        
        const time = clock.getElapsedTime() * 0.1;
        particles.rotation.y = time * 0.05;
    }

    // Create a modern smartphone model
    function createPhoneModel() {
        // Create a group to hold the phone
        phoneGroup = new THREE.Group();
        phoneGroup.position.set(0, 0, 0);
        scene.add(phoneGroup);
        
        // Create the base phone geometry (iPhone-like with rounded corners)
        const phoneWidth = 2;
        const phoneHeight = 4;
        const phoneDepth = 0.2;
        const phoneBorderRadius = 0.3;
        
        // Create rounded rectangle shape for phone
        const phoneShape = new THREE.Shape();
        roundedRect(phoneShape, -phoneWidth/2, -phoneHeight/2, phoneWidth, phoneHeight, phoneBorderRadius);
        
        // Create phone geometry with some depth
        const extrudeSettings = {
            steps: 1,
            depth: phoneDepth,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.05,
            bevelSegments: 3
        };
        
        const phoneGeometry = new THREE.ExtrudeGeometry(phoneShape, extrudeSettings);
        
        // Create material for the phone body - sleek black
        const phoneMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x111111,
            metalness: 0.7,
            roughness: 0.2,
            clearcoat: 0.8,
            clearcoatRoughness: 0.2
        });
        
        // Create the phone mesh
        phone = new THREE.Mesh(phoneGeometry, phoneMaterial);
        phone.castShadow = true;
        phone.receiveShadow = true;
        phoneGroup.add(phone);
        
        // Add screen to the phone
        const screenWidth = phoneWidth * 0.9;
        const screenHeight = phoneHeight * 0.9;
        const screenShape = new THREE.Shape();
        roundedRect(screenShape, -screenWidth/2, -screenHeight/2, screenWidth, screenHeight, phoneBorderRadius * 0.9);
        
        const screenGeometry = new THREE.ShapeGeometry(screenShape);
        screenGeometry.translate(0, 0, phoneDepth/2 + 0.01);
        
        // Create screen material - dark with subtle glow
        const screenMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x050505,
            emissive: 0x222222,
            emissiveIntensity: 0.2,
            metalness: 0.8,
            roughness: 0.2,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
        });
        
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        phoneGroup.add(screen);
        
        // Add subtle floating animation to the phone
        gsap.to(phoneGroup.position, {
            y: '+=0.05',
            duration: 2.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
    
    // Create orbiting 3D text
    function createOrbitingText() {
        // Create a group for the text
        orbitingTextGroup = new THREE.Group();
        scene.add(orbitingTextGroup);
        
        // Load font for 3D text
        const fontLoader = new THREE.FontLoader();
        
        // Load Helvetica font (default Three.js font)
        fontLoader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', function(font) {
            // Create text geometries and materials
            
            // "Welcome to" text
            const welcomeTextGeo = new THREE.TextGeometry('Welcome to', {
                font: font,
                size: 0.29,
                height: 0.08,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.02,
                bevelSize: 0.015,
                bevelOffset: 0,
                bevelSegments: 5
            });
            
            // Center text geometry
            welcomeTextGeo.computeBoundingBox();
            const welcomeTextWidth = welcomeTextGeo.boundingBox.max.x - welcomeTextGeo.boundingBox.min.x;
            welcomeTextGeo.translate(-welcomeTextWidth/2, 0, 0);
            
            // Create text materials
            const welcomeTextMaterial = new THREE.MeshPhongMaterial({
                color: 0x00AA55,        // Darker green base color
                emissive: 0x00AA55,     // Same color for emission
                emissiveIntensity: 0.8,  // Stronger emissive intensity
                shininess: 50
            });
            
            // "BinMan" text (larger)
            const binmanTextGeo = new THREE.TextGeometry('BinMan', {
                font: font,
                size: 0.5,
                height: 0.15,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            });
            
            // Center text geometry
            binmanTextGeo.computeBoundingBox();
            const binmanTextWidth = binmanTextGeo.boundingBox.max.x - binmanTextGeo.boundingBox.min.x;
            binmanTextGeo.translate(-binmanTextWidth/2, 0, 0);
            
            // Create text materials
            const binmanTextMaterial = new THREE.MeshPhongMaterial({
                color: 0x00AA55,        // Darker green
                emissive: 0x00AA55,     // Same color for emission
                emissiveIntensity: 1.2,  // Even stronger for BinMan text
                shininess: 60
            });
            
            // "Your Smart Waste Assistant" text
            const assistantTextGeo = new THREE.TextGeometry('Your Smart Waste Assistant', {
                font: font,
                size: 0.15,
                height: 0.04,
                curveSegments: 6,
                bevelEnabled: true,
                bevelThickness: 0.01,
                bevelSize: 0.005,
                bevelOffset: 0,
                bevelSegments: 3
            });
            
            // Center text geometry
            assistantTextGeo.computeBoundingBox();
            const assistantTextWidth = assistantTextGeo.boundingBox.max.x - assistantTextGeo.boundingBox.min.x;
            assistantTextGeo.translate(-assistantTextWidth/2, 0, 0);
            
            // Create text materials
            const assistantTextMaterial = new THREE.MeshPhongMaterial({
                color: 0x00AA55,        // Darker green
                emissive: 0x00AA55,     // Same color for emission
                emissiveIntensity: 0.7,  // Slightly less intense than welcome
                shininess: 45
            });
            
            // Create the FRONT text group
            const frontTextContainer = new THREE.Group();
            
            // Create mesh instances for front text
            const frontWelcome = new THREE.Mesh(welcomeTextGeo, welcomeTextMaterial);
            const frontBinman = new THREE.Mesh(binmanTextGeo, binmanTextMaterial);
            const frontAssistant = new THREE.Mesh(assistantTextGeo, assistantTextMaterial);
            
            // Position the texts
            frontWelcome.position.y = 0.4;
            frontBinman.position.y = -0.1;
            frontAssistant.position.y = -0.5;
            
            // Add to front container
            frontTextContainer.add(frontWelcome);
            frontTextContainer.add(frontBinman);
            frontTextContainer.add(frontAssistant);
            
            // Position in front of phone
            frontTextContainer.position.set(0, 0, 2.5);
            orbitingTextGroup.add(frontTextContainer);
            
            // Create the BACK text group (duplicate)
            const backTextContainer = new THREE.Group();
            
            // Create back text (on opposite side)
            const backWelcome = createTextMesh("Welcome to", welcomeTextMaterial.clone(), -6, 2);
            const backBinman = createTextMesh("BinMan", binmanTextMaterial.clone(), -2.8, 0);
            const backAssistant = createTextMesh("Your Waste Management Assistant", assistantTextMaterial.clone(), -8, -2);
            
            // Rotate the back text group to face the opposite direction
            backWelcome.rotation.y = Math.PI; // 180 degrees around Y axis
            backBinman.rotation.y = Math.PI;
            backAssistant.rotation.y = Math.PI;
            
            // Position the back text on the opposite side of the phone
            backWelcome.position.z = -0.5;
            backBinman.position.z = -0.5;
            backAssistant.position.z = -0.5;
            
            // Add to back container
            backTextContainer.add(backWelcome);
            backTextContainer.add(backBinman);
            backTextContainer.add(backAssistant);
            
            // Position on opposite side
            backTextContainer.position.set(0, 0, -2.5);
            orbitingTextGroup.add(backTextContainer);
            
            // Add glow effects to both text groups
            [frontWelcome, frontBinman, frontAssistant].forEach(mesh => {
                createTextGlow(mesh, 0x00AA55, 1.5);  // Increase glow intensity
            });
            
            // Add loop to ensure back text materials are also updated
            [backWelcome, backBinman, backAssistant].forEach(mesh => {
                // Update all material properties to match front text
                if (mesh === backBinman) {
                    mesh.material.color.setHex(0x00AA55);
                    mesh.material.emissive.setHex(0x00AA55);
                    mesh.material.emissiveIntensity = 1.0;
                } else {
                    mesh.material.color.setHex(0x00AA55);
                    mesh.material.emissive.setHex(0x00AA55);
                    mesh.material.emissiveIntensity = mesh === backWelcome ? 0.8 : 0.7;
                }
                mesh.material.shininess = mesh === backBinman ? 60 : 50;
                mesh.material.needsUpdate = true;
            });
            
            // Add subtle floating animation
            gsap.to(orbitingTextGroup.position, {
                y: '+=0.1',
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        });
    }
    
    // Create a glowing effect for text
    function createTextGlow(textMesh, color, intensity) {
        // Create a point light at the text position
        const glow = new THREE.PointLight(color, intensity, 6);  // Increased range
        glow.position.set(0, 0, 0.2);
        textMesh.add(glow);
        
        // Add a second glow light for stronger effect
        const glow2 = new THREE.PointLight(color, intensity * 0.8, 4);  // Increased range and intensity
        glow2.position.set(0, 0, -0.2);
        textMesh.add(glow2);
        
        // Create pulsing animation for the glow
        gsap.to(glow, {
            intensity: intensity * 2.0,  // Increased max intensity
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        
        gsap.to(glow2, {
            intensity: intensity * 1.4,  // Increased max intensity
            duration: 2.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 0.5
        });
    }

    // Add interactivity to the phone model
    function addInteractivity() {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        // Event listeners for desktop
        renderer.domElement.addEventListener('mousemove', onMouseMove);
        renderer.domElement.addEventListener('click', onMouseClick);
        
        // Event listeners for mobile
        renderer.domElement.addEventListener('touchstart', onTouchStart);
        renderer.domElement.addEventListener('touchend', onTouchEnd);
        
        function onTouchStart(event) {
            event.preventDefault();
            mouse.x = (event.touches[0].clientX / container.clientWidth) * 2 - 1;
            mouse.y = -(event.touches[0].clientY / container.clientHeight) * 2 + 1;
            
            checkIntersection();
        }
        
        function onTouchEnd(event) {
            event.preventDefault();
            if (isHovered) {
                triggerClick();
            }
        }
        
        function onMouseMove(event) {
            // Calculate mouse position in normalized device coordinates
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            checkIntersection();
        }
        
        function checkIntersection() {
            // Update the picking ray with the camera and mouse position
            raycaster.setFromCamera(mouse, camera);
            
            // Calculate objects intersecting the picking ray
            const intersects = raycaster.intersectObjects(phoneGroup.children, true);
            
            if (intersects.length > 0) {
                if (!isHovered) {
                    isHovered = true;
                    document.body.style.cursor = 'pointer';
                    
                    // Scale up the phone slightly
                    gsap.to(phoneGroup.scale, {
                        x: 1.1,
                        y: 1.1,
                        z: 1.1,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                }
            } else {
                if (isHovered) {
                    isHovered = false;
                    document.body.style.cursor = 'auto';
                    
                    // Scale back to normal
                    gsap.to(phoneGroup.scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                }
            }
        }
        
        function onMouseClick(event) {
            if (isHovered) {
                triggerClick();
            }
        }
        
        function triggerClick() {
            if (!isAnimating) {
                isAnimating = true;
                
                // Create click effect animation
                createClickEffect();
                
                // Make phone bounce and react to click
                gsap.timeline()
                    .to(phoneGroup.scale, {
                        x: 1.2,
                        y: 1.2,
                        z: 1.2,
                        duration: 0.3,
                        ease: "power2.out"
                    })
                    .to(phoneGroup.scale, {
                        x: 1, 
                        y: 1, 
                        z: 1,
                        duration: 0.6,
                        ease: "elastic.out(1, 0.3)",
                        onComplete: function() {
                            isAnimating = false;
                        }
                    });
            }
        }
        
        function createClickEffect() {
            // Create a ring geometry for the ripple effect
            const rippleGeometry = new THREE.RingGeometry(0.1, 0.2, 32);
            const rippleMaterial = new THREE.MeshBasicMaterial({
                color: 0x4BF3A0,
                transparent: true,
                opacity: 0.7,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending
            });
            
            const ripple = new THREE.Mesh(rippleGeometry, rippleMaterial);
            ripple.position.z = 0.2;
            ripple.rotation.x = Math.PI / 2;
            phoneGroup.add(ripple);
            
            // Animate the ripple
            gsap.to(ripple.scale, {
                x: 15,
                y: 15,
                z: 15,
                duration: 1.5,
                    ease: "power2.out"
                });
                
            gsap.to(rippleMaterial, {
                    opacity: 0,
                duration: 1.5,
                    ease: "power2.out",
                    onComplete: function() {
                    phoneGroup.remove(ripple);
                    ripple.geometry.dispose();
                    rippleMaterial.dispose();
                }
            });
        }
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Get elapsed time
        const time = clock.getElapsedTime();
        
        // Animate particles for space effect
        animateParticles();
        
        // No need to orbit the text anymore as it's positioned statically
        
        // Render scene
        renderer.render(scene, camera);
    }

    // Handle window resize
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    window.addEventListener('resize', onWindowResize);

    // Helper function to draw rounded rectangles
    function roundedRect(ctx, x, y, width, height, radius) {
        if (ctx instanceof THREE.Shape) {
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
        } else {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
        }
    }

    // Initialize the scene
    init();
}); 