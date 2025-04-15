// Initialize the 3D scene with a person, phone, and trash
document.addEventListener('DOMContentLoaded', function() {
    console.log("Person model script loaded - initializing 3D scene");
    
    // Check for THREE.js
    if (typeof THREE === 'undefined') {
        console.error("THREE is not defined! Make sure Three.js is loaded properly.");
        document.querySelector('.loading-spinner p').textContent = "Error: Three.js library not loaded";
        return;
    }
    
    // Find container
    const modelContainer = document.getElementById('person-model-container');
    if (!modelContainer) {
        console.error("Could not find container element 'person-model-container'");
        return;
    } else {
        console.log("Found model container:", modelContainer);
    }

    // Remove loading spinner when the scene is ready
    const loadingSpinner = modelContainer.querySelector('.loading-spinner');

    // Scene variables
    let scene, camera, renderer, mixer, clock;
    let person, phone, trashBin, trashItems = [];
    let directionalLight, ambientLight, pointLight, spotLight, scannerLight;
    let holographicElements = [];
    let binGroup;
    let gridFloor;
    let particleGroup;
    
    // Animation variables
    let animations = {};
    let currentAction, previousAction;
    let animationTimers = {};
    
    // Initialize Three.js scene
    function init() {
        try {
            console.log("Starting scene initialization");
            
            // Create scene with a gradient background
            scene = new THREE.Scene();
            // Use a darker green for a more tech feel
            scene.background = new THREE.Color(0x1A4D2E);
            
            // Set up clock for animations
            clock = new THREE.Clock();
            
            // Set up camera with good default values and slight tilt for cinematic angle
            camera = new THREE.PerspectiveCamera(
                35, 
                modelContainer.clientWidth / modelContainer.clientHeight, 
                0.1, 
                100
            );
            camera.position.set(1, 2.2, 5.5);
            camera.lookAt(0, 1, 0);
            
            console.log("Camera set up complete");
            
            // Set up renderer with advanced features for realism
            renderer = new THREE.WebGLRenderer({ 
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance'
            });
            renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit for performance
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows
            
            console.log("Renderer created successfully with advanced features");
            
            // Add renderer to the container
            modelContainer.innerHTML = ''; // Clear the container first
            modelContainer.appendChild(renderer.domElement);
            
            console.log("Renderer added to container");
            
            // Enhanced lighting setup for a more realistic and tech feel
            setupAdvancedLighting();
            
            // Create a simple demonstration scene
            createSimpleScene();
            
            // Create floating particles for ambient effect
            createParticles();
            
            // Create scanner light effect
            createScannerLight();
            
            // Add window resize handler
            window.addEventListener('resize', onWindowResize);
            
            // Store initial positions for animation reference
            storeInitialPositions();
            
            // Start animation loop
            animate();
            
            console.log("3D scene initialized successfully");
            
            // Hide loading message
            if (loadingSpinner) {
                loadingSpinner.style.display = 'none';
            }
        } catch (error) {
            console.error("Error initializing the scene:", error);
            if (loadingSpinner) {
                loadingSpinner.innerHTML = '<p>Error loading 3D model:<br>' + error.message + '</p>';
                loadingSpinner.style.color = 'red';
            }
        }
    }
    
    // Enhanced lighting setup
    function setupAdvancedLighting() {
        // Ambient light for overall scene illumination
        ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);
        
        // Key directional light (main light source)
        directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
        directionalLight.position.set(5, 8, 5);
        directionalLight.castShadow = true;
        
        // Improve shadow quality
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 20;
        directionalLight.shadow.bias = -0.0001;
        
        // Set shadow camera bounds
        const shadowSize = 5;
        directionalLight.shadow.camera.left = -shadowSize;
        directionalLight.shadow.camera.right = shadowSize;
        directionalLight.shadow.camera.top = shadowSize;
        directionalLight.shadow.camera.bottom = -shadowSize;
        
        scene.add(directionalLight);
        
        // Rim light for character highlight
        const rimLight = new THREE.DirectionalLight(0x00ffaa, 0.6);
        rimLight.position.set(-3, 2, -5);
        scene.add(rimLight);
        
        // Add subtle green point light near bins for tech effect
        pointLight = new THREE.PointLight(0x00ff88, 0.6, 10);
        pointLight.position.set(0, 1.5, 1);
        scene.add(pointLight);
        
        console.log("Advanced lighting setup complete");
    }
    
    // Create a simple demonstration scene
    function createSimpleScene() {
        // Create a ground platform with tech styling
        const groundGeometry = new THREE.CircleGeometry(6, 64);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x1A7D5A, // Brighter tech green
            roughness: 0.2,
            metalness: 0.3,
            envMapIntensity: 0.5
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.01;
        ground.receiveShadow = true;
        scene.add(ground);
        
        // Add grid pattern overlay for tech feel
        const gridSize = 5.5;
        const gridGeometry = new THREE.PlaneGeometry(gridSize, gridSize);
        const gridTexture = createGridTexture();
        const gridMaterial = new THREE.MeshBasicMaterial({
            map: gridTexture,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending
        });
        
        const grid = new THREE.Mesh(gridGeometry, gridMaterial);
        grid.rotation.x = -Math.PI / 2;
        grid.position.y = 0.01;
        gridFloor = grid; // Store reference for animation
        scene.add(grid);
        
        // Create tech-enhanced african child with recycling bins
        binGroup = new THREE.Group(); // Create group to hold all bins
        scene.add(binGroup);
        
        createRecyclingBins();
        createAfricanChild();
    }
    
    // Create holographic UI elements floating in the scene
    function createHolographicUI() {
        // Create multiple UI elements in a circular arrangement
        const uiElements = new THREE.Group();
        
        // Add floating holographic panels
        const panelCount = 5;
        const radius = 3;
        
        for (let i = 0; i < panelCount; i++) {
            const angle = (i / panelCount) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            const panel = createHolographicPanel(i);
            panel.position.set(x, 1.2 + Math.sin(i * 0.7) * 0.3, z);
            panel.rotation.y = -angle + Math.PI;
            
            // Add subtle floating animation for each panel
            gsap.to(panel.position, {
                y: panel.position.y + 0.1,
                duration: 2 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: i * 0.2
            });
            
            uiElements.add(panel);
            holographicElements.push(panel);
        }
        
        scene.add(uiElements);
    }
    
    // Create a single holographic UI panel
    function createHolographicPanel(index) {
        const panel = new THREE.Group();
        
        // Panel styles based on index
        const styles = [
            { color: 0x00FFAA, title: "WASTE METRICS" },
            { color: 0x00AAFF, title: "RECYCLING DATA" },
            { color: 0xFF00AA, title: "SORTING STATUS" },
            { color: 0xFFAA00, title: "BIN CAPACITY" },
            { color: 0xAAFF00, title: "ECO IMPACT" }
        ];
        
        const style = styles[index % styles.length];
        
        // Panel background
        const bgGeometry = new THREE.PlaneGeometry(1.2, 0.8);
        const bgMaterial = new THREE.MeshBasicMaterial({
            color: style.color,
            transparent: true,
            opacity: 0.1,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
        const background = new THREE.Mesh(bgGeometry, bgMaterial);
        panel.add(background);
        
        // Panel border
        const borderGeometry = new THREE.EdgesGeometry(bgGeometry);
        const borderMaterial = new THREE.LineBasicMaterial({
            color: style.color,
            transparent: true,
            opacity: 0.5,
            linewidth: 2
        });
        const border = new THREE.LineSegments(borderGeometry, borderMaterial);
        panel.add(border);
        
        // Panel header
        const headerTexture = createPanelHeaderTexture(style.title, style.color);
        const headerGeometry = new THREE.PlaneGeometry(1, 0.15);
        const headerMaterial = new THREE.MeshBasicMaterial({
            map: headerTexture,
            transparent: true,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
        const header = new THREE.Mesh(headerGeometry, headerMaterial);
        header.position.y = 0.3;
        panel.add(header);
        
        // Add data visualization elements (lines, graphs, etc)
        addDataElements(panel, style.color, index);
        
        return panel;
    }
    
    // Add data visualization elements to a panel
    function addDataElements(panel, color, index) {
        // Create different visualizations based on panel index
        switch (index % 5) {
            case 0: // Waste metrics - bar chart
                createBarChart(panel, color);
                break;
            case 1: // Recycling data - line graph
                createLineGraph(panel, color);
                break;
            case 2: // Sorting status - pie chart
                createPieChart(panel, color);
                break;
            case 3: // Bin capacity - progress bars
                createProgressBars(panel, color);
                break;
            case 4: // Eco impact - icon grid
                createIconGrid(panel, color);
                break;
        }
    }
    
    // Create a bar chart visualization
    function createBarChart(panel, color) {
        const group = new THREE.Group();
        
        // Create bars
        const barCount = 5;
        const barWidth = 0.1;
        const spacing = 0.15;
        const maxHeight = 0.3;
        
        for (let i = 0; i < barCount; i++) {
            const height = 0.1 + Math.random() * maxHeight;
            const barGeometry = new THREE.BoxGeometry(barWidth, height, 0.01);
            const barMaterial = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.5
            });
            const bar = new THREE.Mesh(barGeometry, barMaterial);
            
            bar.position.x = -0.4 + i * spacing;
            bar.position.y = -0.1 + height / 2;
            
            group.add(bar);
            
            // Animate height
            gsap.to(bar.scale, {
                y: 0.8 + Math.random() * 0.4,
                duration: 2 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: i * 0.2
            });
        }
        
        panel.add(group);
    }
    
    // Create a line graph visualization
    function createLineGraph(panel, color) {
        const group = new THREE.Group();
        
        // Create the line
        const linePoints = [];
        const pointCount = 10;
        
        for (let i = 0; i < pointCount; i++) {
            const x = -0.45 + (i / (pointCount - 1)) * 0.9;
            const y = -0.15 + Math.sin(i * 0.5) * 0.1 + Math.random() * 0.1;
            linePoints.push(new THREE.Vector3(x, y, 0));
        }
        
        const lineCurve = new THREE.CatmullRomCurve3(linePoints);
        const lineGeometry = new THREE.TubeGeometry(lineCurve, 50, 0.01, 8, false);
        const lineMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.7
        });
        const line = new THREE.Mesh(lineGeometry, lineMaterial);
        group.add(line);
        
        panel.add(group);
    }
    
    // Create a pie chart visualization
    function createPieChart(panel, color) {
        const group = new THREE.Group();
        
        const radius = 0.2;
        const segments = 4;
        
        for (let i = 0; i < segments; i++) {
            const startAngle = (i / segments) * Math.PI * 2;
            const endAngle = ((i + 1) / segments) * Math.PI * 2;
            
            const arcShape = new THREE.Shape();
            arcShape.moveTo(0, 0);
            arcShape.lineTo(Math.cos(startAngle) * radius, Math.sin(startAngle) * radius);
            arcShape.absarc(0, 0, radius, startAngle, endAngle, false);
            arcShape.lineTo(0, 0);
            
            const arcGeometry = new THREE.ShapeGeometry(arcShape);
            const arcMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color(color).offsetHSL(i * 0.1, 0, 0),
                transparent: true,
                opacity: 0.6,
                side: THREE.DoubleSide
            });
            
            const arc = new THREE.Mesh(arcGeometry, arcMaterial);
            arc.position.y = -0.1;
            group.add(arc);
            
            // Animate segments
            gsap.to(arc.position, {
                z: 0.02 * (i + 1),
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: i * 0.3
            });
        }
        
        panel.add(group);
    }
    
    // Create progress bars visualization
    function createProgressBars(panel, color) {
        const group = new THREE.Group();
        
        // Create multiple progress bars
        const barCount = 4;
        
        for (let i = 0; i < barCount; i++) {
            // Bar container
            const containerGeometry = new THREE.BoxGeometry(0.8, 0.08, 0.01);
            const containerMaterial = new THREE.MeshBasicMaterial({
                color: 0xFFFFFF,
                transparent: true,
                opacity: 0.2
            });
            const container = new THREE.Mesh(containerGeometry, containerMaterial);
            container.position.y = 0.1 - i * 0.12;
            
            // Progress fill
            const progress = 0.3 + Math.random() * 0.5;
            const fillGeometry = new THREE.BoxGeometry(0.8 * progress, 0.08, 0.015);
            const fillMaterial = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.6
            });
            const fill = new THREE.Mesh(fillGeometry, fillMaterial);
            fill.position.x = (0.8 * (progress - 1)) / 2;
            
            container.add(fill);
            group.add(container);
            
            // Animate fill width
            gsap.to(fill.scale, {
                x: 0.8 + Math.random() * 0.3,
                duration: 3 + i * 0.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }
        
        panel.add(group);
    }
    
    // Create icon grid visualization
    function createIconGrid(panel, color) {
        const group = new THREE.Group();
        
        // Create a grid of icons
        const rows = 2;
        const cols = 3;
        const size = 0.12;
        const spacing = 0.18;
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const iconGeometry = new THREE.CircleGeometry(size / 2, 16);
                const iconMaterial = new THREE.MeshBasicMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0.7
                });
                const icon = new THREE.Mesh(iconGeometry, iconMaterial);
                
                icon.position.x = -0.2 + j * spacing;
                icon.position.y = 0 - i * spacing;
                
                group.add(icon);
                
                // Animate icon opacity
                gsap.to(iconMaterial, {
                    opacity: 0.2,
                    duration: 1 + Math.random() * 2,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: (i * cols + j) * 0.2
                });
            }
        }
        
        panel.add(group);
    }
    
    // Create a text texture for panel headers
    function createPanelHeaderTexture(text, color) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const context = canvas.getContext('2d');
        
        // Fill with transparent background
        context.fillStyle = 'rgba(0,0,0,0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw text
        context.font = 'bold 24px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = new THREE.Color(color).getStyle();
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        
        // Add glow
        context.shadowBlur = 15;
        context.shadowColor = new THREE.Color(color).getStyle();
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        
        return new THREE.CanvasTexture(canvas);
    }
    
    // Animation loop
    function animate() {
        try {
            requestAnimationFrame(animate);
            
            // Get elapsed time
            const delta = clock.getDelta();
            const time = clock.getElapsedTime();
            
            // Character animations
            if (person) {
                // Breathing animation - subtle chest movement
                person.traverse((child) => {
                    if (child.name === 'torso') {
                        child.position.y = (child.userData.originalY || 0) + Math.sin(time * 0.8) * 0.01;
                    }
                });
                
                // Subtle bobbing animation - up and down movement
                person.position.y = Math.sin(time) * 0.03;
                
                // Subtle swaying - side to side movement
                person.position.x = Math.sin(time * 0.4) * 0.03;
                
                // Scanner animation if it exists
                person.traverse((child) => {
                    if (child.name === 'scanner') {
                        child.rotation.z = Math.sin(time * 2) * 0.1;
                    }
                });
                
                // Occasional head movement (glancing)
                person.traverse((child) => {
                    if (child.name === 'head') {
                        // Every ~8-10 seconds, look around
                        const lookAround = Math.sin(time * 0.15) > 0.9;
                        if (lookAround) {
                            const turnAmount = Math.sin(time * 0.5) * 0.2;
                            child.rotation.y = turnAmount;
                        } else {
                            // Return slowly to forward
                            child.rotation.y *= 0.95;
                        }
                    }
                });
            }
            
            // Bin animations - if binGroup exists
            if (binGroup && binGroup.children.length > 0) {
                binGroup.children.forEach((bin, index) => {
                    // Bin glowing effect
                    bin.traverse((part) => {
                        if (part.material && part.material.emissive) {
                            const binTime = time + index * 1.5;
                            const emissiveIntensity = 0.5 + Math.sin(binTime) * 0.2;
                            part.material.emissiveIntensity = emissiveIntensity;
                        }
                    });
                    
                    // Bin lid animation - every ~12-15 seconds, make one bin open
                    const shouldOpen = Math.sin(time * 0.08 + index) > 0.95;
                    bin.traverse((part) => {
                        if (part.name === 'lid') {
                            if (shouldOpen) {
                                // Open the lid gradually
                                part.rotation.x = THREE.MathUtils.lerp(
                                    part.rotation.x || 0, 
                                    -Math.PI/6, 
                                    delta * 2
                                );
                            } else {
                                // Close the lid gradually
                                part.rotation.x = THREE.MathUtils.lerp(
                                    part.rotation.x || 0, 
                                    0, 
                                    delta * 2
                                );
                            }
                        }
                    });
                });
            }
            
            // Update floating particles
            if (particleGroup) {
                updateParticles(time);
            }
            
            // Floor grid pulsing
            if (gridFloor && gridFloor.material) {
                gridFloor.material.opacity = 0.15 + Math.sin(time * 0.5) * 0.05;
            }
            
            // Scanner light sweeping
            if (scannerLight) {
                const sweepProgress = (time % 15) / 15; // 0-1 over 15 seconds
                scannerLight.position.x = -5 + sweepProgress * 10; // -5 to 5
            }
            
            // Animate point lights for tech effects
            if (pointLight) {
                pointLight.intensity = 0.6 + Math.sin(time * 2) * 0.2;
            }
            
            // Render scene
            renderer.render(scene, camera);
        } catch (error) {
            console.error("Error in animation loop:", error);
        }
    }
    
    // Update particle positions
    function updateParticles(time) {
        if (!particleGroup) return;
        
        particleGroup.children.forEach((particle, i) => {
            // Move particle
            particle.position.x += particle.userData.direction.x;
            particle.position.y += Math.sin(time * 0.5 + i) * 0.001; // Gentle bobbing
            particle.position.z += particle.userData.direction.z;
            
            // Reset if it moves too far
            const distance = particle.position.length();
            if (distance > 8) {
                // Reset to opposite side of the scene
                particle.position.multiplyScalar(-0.8);
            }
            
            // Pulse opacity for twinkling effect
            if (particle.material) {
                particle.material.opacity = (0.2 + Math.random() * 0.3) * (0.7 + Math.sin(time * 0.5 + i) * 0.3);
            }
        });
    }
    
    // Create green floating particles in the scene
    function createParticles() {
        // Particle group
        particleGroup = new THREE.Group();
        particleGroup.name = 'particles';
        
        // Create multiple particles
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            // Particle geometry
            const particleGeometry = new THREE.SphereGeometry(0.01 + Math.random() * 0.01, 8, 8);
            const particleMaterial = new THREE.MeshBasicMaterial({
                color: 0x00FF88,
                transparent: true,
                opacity: 0.2 + Math.random() * 0.3
            });
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            // Random start position in a dome shape above the scene
            const theta = Math.random() * Math.PI * 2;
            const radius = 1 + Math.random() * 5;
            const height = Math.random() * 3;
            
            particle.position.set(
                radius * Math.cos(theta),
                height,
                radius * Math.sin(theta)
            );
            
            // Store original position and movement data
            particle.userData = {
                speed: 0.1 + Math.random() * 0.2,
                direction: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.01,
                    (Math.random() - 0.5) * 0.02
                )
            };
            
            particleGroup.add(particle);
        }
        
        scene.add(particleGroup);
    }
    
    // Create a scanning light beam effect
    function createScannerLight() {
        // Create a spotlight for the scanning effect
        scannerLight = new THREE.SpotLight(0x00FFFF, 0.5, 10, Math.PI / 8, 0.5, 1);
        scannerLight.position.set(-5, 5, 0);
        scannerLight.target.position.set(0, 0, 0);
        scene.add(scannerLight);
        scene.add(scannerLight.target);
        
        // Add slight flicker to the light
        gsap.to(scannerLight, {
            intensity: 0.7,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
    
    // Store initial positions for animation reference
    function storeInitialPositions() {
        // Store original positions of character parts
        if (person) {
            person.traverse((child) => {
                if (child.isMesh || child.isGroup) {
                    child.userData.originalY = child.position.y;
                    child.userData.originalPosition = child.position.clone();
                    child.userData.originalRotation = child.rotation.clone();
                }
            });
        }
    }
    
    // Create individual high-tech recycling bin
    function createTechBin(color, label) {
        const bin = new THREE.Group();
        
        // Bin body with beveled edges for a more modern look
        const bodyGeometry = new THREE.BoxGeometry(0.8, 0.9, 0.8);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.3, // More shiny
            metalness: 0.5,  // More metallic
            envMapIntensity: 0.7,
            emissive: color,
            emissiveIntensity: 0.2
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.45;
        body.castShadow = true;
        body.receiveShadow = true;
        body.name = 'body';
        bin.add(body);
        
        // Add panel lines for a tech look
        addPanelLines(body, color);
        
        // Lid with scanner bar
        const lidGeometry = new THREE.BoxGeometry(0.85, 0.1, 0.85);
        const lidMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(color).multiplyScalar(0.8),
            roughness: 0.2,
            metalness: 0.7,
            emissive: color,
            emissiveIntensity: 0.1
        });
        const lid = new THREE.Mesh(lidGeometry, lidMaterial);
        lid.position.y = 0.95;
        lid.castShadow = true;
        lid.name = 'lid'; // Name for animation targeting
        bin.add(lid);
        
        // Add scanner light bar
        const scannerBarGeometry = new THREE.BoxGeometry(0.7, 0.02, 0.1);
        const scannerBarMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00ffff,
            transparent: true,
            opacity: 0.8
        });
        const scannerBar = new THREE.Mesh(scannerBarGeometry, scannerBarMaterial);
        scannerBar.position.set(0, 1.01, 0.3);
        scannerBar.name = 'scanner_bar';
        bin.add(scannerBar);
        
        // Add scanning light effect
        const scannerLight = new THREE.PointLight(0x00ffff, 0.5, 0.8);
        scannerLight.position.set(0, 1.01, 0.3);
        bin.add(scannerLight);
        
        // Animate scanner light
        gsap.to(scannerLight, {
            intensity: 1.0,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        
        // Add glowing label with bin type
        addBinLabel(bin, label, color);
        
        // Add glowing light strip down the front
        const stripGeometry = new THREE.PlaneGeometry(0.05, 0.7);
        const stripMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(color).multiplyScalar(1.5),
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        
        const lightStrip = new THREE.Mesh(stripGeometry, stripMaterial);
        lightStrip.position.set(0, 0.45, 0.41);
        lightStrip.name = 'light_strip';
        bin.add(lightStrip);
        
        // Bin feet with more tech styling
        for (let x = -1; x <= 1; x += 2) {
            for (let z = -1; z <= 1; z += 2) {
                const footGeometry = new THREE.CylinderGeometry(0.06, 0.04, 0.1, 6);
                const footMaterial = new THREE.MeshStandardMaterial({
                    color: 0x333333,
                    roughness: 0.3,
                    metalness: 0.8
                });
                const foot = new THREE.Mesh(footGeometry, footMaterial);
                foot.position.set(x * 0.35, -0.05, z * 0.35);
                bin.add(foot);
            }
        }
        
        // Add floating label that appears on hover/open
        const hoverLabel = createHoverLabel(label, color);
        hoverLabel.position.y = 1.5;  // Position above bin
        hoverLabel.visible = false;   // Hide initially
        hoverLabel.name = 'hover_label';
        bin.add(hoverLabel);
        
        return bin;
    }
    
    // Create a hover label that appears above bins
    function createHoverLabel(text, color) {
        const label = new THREE.Group();
        
        // Background panel
        const bgGeometry = new THREE.PlaneGeometry(0.6, 0.2);
        const bgMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide
        });
        const bg = new THREE.Mesh(bgGeometry, bgMaterial);
        label.add(bg);
        
        // Create text texture
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const context = canvas.getContext('2d');
        
        // Clear background
        context.fillStyle = 'rgba(0,0,0,0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw text
        context.font = 'bold 32px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = '#FFFFFF';
        context.fillText(text, canvas.width/2, canvas.height/2);
        
        // Add glow
        context.shadowBlur = 15;
        context.shadowColor = new THREE.Color(color).getStyle();
        context.fillText(text, canvas.width/2, canvas.height/2);
        
        const texture = new THREE.CanvasTexture(canvas);
        
        // Text mesh
        const textGeometry = new THREE.PlaneGeometry(0.5, 0.16);
        const textMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide
        });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.z = 0.01;
        label.add(textMesh);
        
        return label;
    }
    
    // Create African child figure as shown in the reference image
    function createAfricanChild() {
        const child = new THREE.Group();
        
        // Define materials with better textures
        const skinMaterial = new THREE.MeshStandardMaterial({
            color: 0x8D5524, // Brown skin tone
            roughness: 0.6, // More realistic skin
            metalness: 0.1
        });
        
        const shirtMaterial = new THREE.MeshStandardMaterial({
            color: 0xFF7F50, // Coral/orange shirt as in image
            roughness: 0.7, // Fabric texture
            metalness: 0.1
        });
        
        const undershirtMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF, // White undershirt
            roughness: 0.7,
            metalness: 0.1
        });
        
        const pantsMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333, // Darker pants for tech aesthetic
            roughness: 0.7,
            metalness: 0.2
        });
        
        const shoeMaterial = new THREE.MeshStandardMaterial({
            color: 0x222222, // Dark gray shoes
            roughness: 0.4, // More polished
            metalness: 0.6 // Slightly metallic boots
        });
        
        const hairMaterial = new THREE.MeshStandardMaterial({
            color: 0x0F0F0F, // Black hair
            roughness: 1.0,
            metalness: 0.0
        });
        
        // Tech materials
        const techGlassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x111111,
            roughness: 0.1,
            metalness: 0.9,
            transparent: true,
            opacity: 0.7,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
        });
        
        const techGlowMaterial = new THREE.MeshBasicMaterial({
            color: 0x00FFAA,
            transparent: true,
            opacity: 0.8
        });
        
        const techDisplayMaterial = new THREE.MeshBasicMaterial({
            color: 0x00AAFF,
            transparent: true,
            opacity: 0.8
        });
        
        // Create head
        const headGeometry = new THREE.SphereGeometry(0.2, 24, 24);
        const head = new THREE.Mesh(headGeometry, skinMaterial);
        head.position.y = 1.5;
        head.castShadow = true;
        head.name = 'head'; // Add name for animation
        child.add(head);
        
        // Create hair (short afro)
        const hairGeometry = new THREE.SphereGeometry(0.22, 24, 24);
        const hair = new THREE.Mesh(hairGeometry, hairMaterial);
        hair.position.y = 1.53;
        hair.scale.set(1, 0.7, 1);
        hair.castShadow = true;
        child.add(hair);
        
        // Create face
        
        // Eyes
        const eyeWhiteMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
        const eyeGeometry = new THREE.SphereGeometry(0.03, 16, 16);
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeWhiteMaterial);
        leftEye.position.set(0.08, 1.52, 0.17);
        leftEye.scale.set(1, 1, 0.5);
        child.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeWhiteMaterial);
        rightEye.position.set(-0.08, 1.52, 0.17);
        rightEye.scale.set(1, 1, 0.5);
        child.add(rightEye);
        
        // Pupils
        const pupilMaterial = new THREE.MeshStandardMaterial({ color: 0x553311 });
        const pupilGeometry = new THREE.SphereGeometry(0.015, 16, 16);
        
        const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        leftPupil.position.set(0.08, 1.52, 0.19);
        child.add(leftPupil);
        
        const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        rightPupil.position.set(-0.08, 1.52, 0.19);
        child.add(rightPupil);
        
        // Create simple smile
        const smileMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const smileGeometry = new THREE.TorusGeometry(0.06, 0.01, 16, 16, Math.PI);
        const smile = new THREE.Mesh(smileGeometry, smileMaterial);
        smile.position.set(0, 1.44, 0.18);
        smile.rotation.set(Math.PI / 2, 0, 0);
        child.add(smile);
        
        // Add tech AR glasses
        const glassesFrame = new THREE.Group();
        glassesFrame.name = 'glasses';
        
        // Frame
        const frameGeometry = new THREE.BoxGeometry(0.22, 0.04, 0.01);
        const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0x222222,
            roughness: 0.2,
            metalness: 0.8
        });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        glassesFrame.add(frame);
        
        // Left lens
        const lensGeometry = new THREE.BoxGeometry(0.08, 0.05, 0.01);
        const leftLens = new THREE.Mesh(lensGeometry, techGlassMaterial);
        leftLens.position.x = 0.07;
        glassesFrame.add(leftLens);
        
        // Right lens
        const rightLens = new THREE.Mesh(lensGeometry, techGlassMaterial);
        rightLens.position.x = -0.07;
        glassesFrame.add(rightLens);
        
        // Add LED indicators to glasses
        const ledGeometry = new THREE.BoxGeometry(0.01, 0.01, 0.01);
        const leftLed = new THREE.Mesh(ledGeometry, techGlowMaterial);
        leftLed.position.set(0.11, 0.02, 0.01);
        glassesFrame.add(leftLed);
        
        // Add tiny light to LED
        const ledLight = new THREE.PointLight(0x00FFAA, 0.2, 0.1);
        ledLight.position.copy(leftLed.position);
        glassesFrame.add(ledLight);
        
        // Animate LED
        gsap.to(ledLight, {
            intensity: 0.4,
            duration: 0.8,
            repeat: -1,
            yoyo: true
        });
        
        // Position glasses on face
        glassesFrame.position.set(0, 1.52, 0.2);
        child.add(glassesFrame);
        
        // Create torso
        const torsoGeometry = new THREE.BoxGeometry(0.35, 0.4, 0.2);
        const torso = new THREE.Mesh(torsoGeometry, shirtMaterial);
        torso.position.y = 1.2;
        torso.castShadow = true;
        torso.name = 'torso'; // Add name for animation
        child.add(torso);
        
        // BinMan logo on shirt
        addTechLogo(torso);
        
        // Create white undershirt showing at collar
        const collarGeometry = new THREE.BoxGeometry(0.15, 0.08, 0.05);
        const collar = new THREE.Mesh(collarGeometry, undershirtMaterial);
        collar.position.set(0, 1.35, 0.1);
        collar.castShadow = true;
        child.add(collar);
        
        // Create arms
        const upperArmGeometry = new THREE.CylinderGeometry(0.06, 0.05, 0.25, 16);
        
        const leftUpperArm = new THREE.Mesh(upperArmGeometry, shirtMaterial);
        leftUpperArm.position.set(0.22, 1.2, 0);
        leftUpperArm.rotation.z = -Math.PI/12; // Slightly angled
        leftUpperArm.castShadow = true;
        leftUpperArm.name = 'left_upper_arm';
        child.add(leftUpperArm);
        
        const rightUpperArm = new THREE.Mesh(upperArmGeometry, shirtMaterial);
        rightUpperArm.position.set(-0.22, 1.2, 0);
        rightUpperArm.rotation.z = Math.PI/12; // Slightly angled
        rightUpperArm.castShadow = true;
        rightUpperArm.name = 'right_upper_arm';
        child.add(rightUpperArm);
        
        // Create lower arms
        const lowerArmGeometry = new THREE.CylinderGeometry(0.05, 0.04, 0.25, 16);
        
        const leftLowerArm = new THREE.Mesh(lowerArmGeometry, skinMaterial);
        leftLowerArm.position.set(0.26, 1.0, 0);
        leftLowerArm.rotation.z = -Math.PI/10;
        leftLowerArm.castShadow = true;
        leftLowerArm.name = 'left_lower_arm';
        child.add(leftLowerArm);
        
        const rightLowerArm = new THREE.Mesh(lowerArmGeometry, skinMaterial);
        rightLowerArm.position.set(-0.26, 1.0, 0);
        rightLowerArm.rotation.z = Math.PI/10;
        rightLowerArm.castShadow = true;
        rightLowerArm.name = 'right_lower_arm';
        child.add(rightLowerArm);
        
        // Add smartwatch to left wrist
        const smartwatch = createSmartwatch();
        smartwatch.position.set(0.26, 0.9, 0.06);
        child.add(smartwatch);
        
        // Create hands
        const handGeometry = new THREE.SphereGeometry(0.04, 16, 16);
        
        const leftHand = new THREE.Mesh(handGeometry, skinMaterial);
        leftHand.position.set(0.3, 0.85, 0);
        leftHand.scale.set(1, 0.8, 0.6);
        leftHand.castShadow = true;
        leftHand.name = 'left_hand';
        child.add(leftHand);
        
        const rightHand = new THREE.Mesh(handGeometry, skinMaterial);
        rightHand.position.set(-0.3, 0.85, 0);
        rightHand.scale.set(1, 0.8, 0.6);
        rightHand.castShadow = true;
        rightHand.name = 'right_hand';
        child.add(rightHand);
        
        // Create legs
        const pantsGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.2);
        const pants = new THREE.Mesh(pantsGeometry, pantsMaterial);
        pants.position.y = 0.85;
        pants.castShadow = true;
        pants.name = 'pants';
        child.add(pants);
        
        // Add tech utility belt
        const beltGeometry = new THREE.BoxGeometry(0.34, 0.05, 0.24);
        const beltMaterial = new THREE.MeshStandardMaterial({
            color: 0x222222,
            roughness: 0.3,
            metalness: 0.7
        });
        const belt = new THREE.Mesh(beltGeometry, beltMaterial);
        belt.position.y = 0.95;
        belt.name = 'belt';
        child.add(belt);
        
        // Add belt LED
        const beltLedGeometry = new THREE.BoxGeometry(0.05, 0.02, 0.01);
        const beltLed = new THREE.Mesh(beltLedGeometry, techGlowMaterial);
        beltLed.position.set(0, 0.95, 0.13);
        child.add(beltLed);
        
        // Belt LED light
        const beltLight = new THREE.PointLight(0x00FFAA, 0.2, 0.3);
        beltLight.position.copy(beltLed.position);
        child.add(beltLight);
        
        // Animate belt LED
        gsap.to(beltLight, {
            intensity: 0.4,
            duration: 1.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        
        // Create pant legs
        const legGeometry = new THREE.CylinderGeometry(0.07, 0.05, 0.4, 16);
        
        const leftLeg = new THREE.Mesh(legGeometry, pantsMaterial);
        leftLeg.position.set(0.1, 0.5, 0);
        leftLeg.castShadow = true;
        leftLeg.name = 'left_leg';
        child.add(leftLeg);
        
        const rightLeg = new THREE.Mesh(legGeometry, pantsMaterial);
        rightLeg.position.set(-0.1, 0.5, 0);
        rightLeg.castShadow = true;
        rightLeg.name = 'right_leg';
        child.add(rightLeg);
        
        // Create tech boots
        const bootGeometry = new THREE.BoxGeometry(0.12, 0.1, 0.18);
        
        const leftBoot = new THREE.Mesh(bootGeometry, shoeMaterial);
        leftBoot.position.set(0.1, 0.23, 0.05);
        leftBoot.castShadow = true;
        leftBoot.name = 'left_boot';
        child.add(leftBoot);
        
        const rightBoot = new THREE.Mesh(bootGeometry, shoeMaterial);
        rightBoot.position.set(-0.1, 0.23, 0.05);
        rightBoot.castShadow = true;
        rightBoot.name = 'right_boot';
        child.add(rightBoot);
        
        // Add tech details to boots - light lines
        const bootLightGeometry = new THREE.BoxGeometry(0.08, 0.01, 0.01);
        const bootLightMaterial = new THREE.MeshBasicMaterial({
            color: 0x00FFAA,
            transparent: true,
            opacity: 0.8
        });
        
        const leftBootLight = new THREE.Mesh(bootLightGeometry, bootLightMaterial);
        leftBootLight.position.set(0.1, 0.21, 0.15);
        child.add(leftBootLight);
        
        const rightBootLight = new THREE.Mesh(bootLightGeometry, bootLightMaterial);
        rightBootLight.position.set(-0.1, 0.21, 0.15);
        child.add(rightBootLight);
        
        // Create handheld scanner device instead of water bottle
        const scanner = createHandheldScanner();
        scanner.position.set(0.35, 0.85, 0.06);
        scanner.rotation.y = Math.PI / 4;
        scanner.rotation.z = Math.PI / 2;
        child.add(scanner);
        
        // Add holographic projection from the scanner
        const hologram = createHolographicDisplay();
        hologram.position.set(0.4, 0.95, 0.15);
        hologram.rotation.y = Math.PI / 4;
        child.add(hologram);
        
        // Position the child next to the recycling bins
        child.position.set(0, 0, -0.2);
        child.rotation.y = Math.PI / 6; // Slight turn toward the camera
        scene.add(child);
        
        // Add gentle bobbing animation
        gsap.to(child.position, {
            y: 0.05,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        
        person = child; // Assign to the global person variable for animation
    }
    
    // Start initializing the scene
    init();
}); 