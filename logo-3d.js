// BinMan 3D Logo using Three.js
document.addEventListener('DOMContentLoaded', function() {
    const logoContainer = document.getElementById('binman-3d-logo');
    if (!logoContainer) return;

    const loadingElement = logoContainer.querySelector('.logo-loading');

    // Initialize scene, camera, and renderer
    let scene, camera, renderer, logo;
    let clock = new THREE.Clock();

    // Set up scene
    function init() {
        // Create scene
        scene = new THREE.Scene();
        
        // Set up camera
        camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
        camera.position.set(0, 0, 5);
        
        // Set up renderer with transparency
        renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(logoContainer.clientWidth, logoContainer.clientHeight);
        
        // Hide loading icon and append renderer
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        logoContainer.appendChild(renderer.domElement);
        
        // Add lighting
        setupLighting();
        
        // Create the logo
        createLogo();
        
        // Start animation
        animate();
    }

    // Set up lighting
    function setupLighting() {
        // Ambient light for base illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);
        
        // Directional light for main illumination
        const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
        mainLight.position.set(5, 5, 5);
        scene.add(mainLight);
        
        // Fill light from another angle
        const fillLight = new THREE.DirectionalLight(0x4BF3A0, 0.5);
        fillLight.position.set(-5, 0, 5);
        scene.add(fillLight);
    }

    // Create the BinMan logo (a recycling symbol)
    function createLogo() {
        // Create a group for the logo
        logo = new THREE.Group();
        scene.add(logo);
        
        // Create the recycling symbol using three arrows in a triangle
        createRecycleSymbol();
    }

    // Create a recycling symbol
    function createRecycleSymbol() {
        // Leaf green color for the logo
        const darkGreen = new THREE.MeshPhongMaterial({
            color: 0x006400, // Dark green (Leaves color)
            emissive: 0x006400,
            emissiveIntensity: 0.2,
            shininess: 100,
            specular: 0xffffff
        });
        
        // Create each arrow of the recycling symbol
        const arrowGroup = new THREE.Group();
        
        // First arrow (pointing right and down)
        const arrow1 = createArrow(darkGreen);
        arrow1.rotation.z = 0;
        arrowGroup.add(arrow1);
        
        // Second arrow (pointing left and down)
        const arrow2 = createArrow(darkGreen);
        arrow2.rotation.z = Math.PI * 2/3;
        arrowGroup.add(arrow2);
        
        // Third arrow (pointing up)
        const arrow3 = createArrow(darkGreen);
        arrow3.rotation.z = Math.PI * 4/3;
        arrowGroup.add(arrow3);
        
        // Add the arrow group to the logo
        logo.add(arrowGroup);
        
        // Scale to fit properly in the container
        logo.scale.set(0.8, 0.8, 0.8);
        
        // Add rotation animation
        gsap.to(logo.rotation, {
            y: Math.PI * 2,
            duration: 10,
            repeat: -1,
            ease: "none"
        });
        
        // Add subtle floating animation
        gsap.to(logo.position, {
            y: '+=0.05',
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }

    // Create a single arrow for the recycling symbol
    function createArrow(material) {
        const group = new THREE.Group();
        
        // Arrow body (curved rectangle)
        const curve = new THREE.EllipseCurve(
            0, 0,                   // Center
            1.2, 1.2,               // X and Y radius
            Math.PI * 0.2, Math.PI * 0.8, // Start and end angles
            false,                  // Clockwise
            0                       // Rotation
        );
        
        const points = curve.getPoints(20);
        const bodyGeometry = new THREE.BufferGeometry().setFromPoints(points);
        bodyGeometry.translate(0, -0.5, 0);
        
        // Create thickness for the curve by extruding a shape
        const bodyShape = new THREE.Shape();
        points.forEach((point, i) => {
            if (i === 0) bodyShape.moveTo(point.x, point.y);
            else bodyShape.lineTo(point.x, point.y);
        });
        
        // Close the shape by connecting back to start with straight lines
        bodyShape.lineTo(points[points.length-1].x, points[points.length-1].y - 0.15);
        bodyShape.lineTo(points[0].x, points[0].y - 0.15);
        bodyShape.lineTo(points[0].x, points[0].y);
        
        const extrudeSettings = {
            steps: 1,
            depth: 0.1,
            bevelEnabled: false
        };
        
        const extrudedGeometry = new THREE.ExtrudeGeometry(bodyShape, extrudeSettings);
        const body = new THREE.Mesh(extrudedGeometry, material);
        group.add(body);
        
        // Arrow head (triangle)
        const headGeometry = new THREE.ConeGeometry(0.25, 0.5, 8);
        headGeometry.rotateZ(-Math.PI/2);
        headGeometry.translate(1.3, -0.4, 0);
        const head = new THREE.Mesh(headGeometry, material);
        group.add(head);
        
        return group;
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Get elapsed time
        const time = clock.getElapsedTime();
        
        // Render scene
        renderer.render(scene, camera);
    }

    // Handle window resize
    function onWindowResize() {
        camera.aspect = logoContainer.clientWidth / logoContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(logoContainer.clientWidth, logoContainer.clientHeight);
    }
    
    window.addEventListener('resize', onWindowResize);

    // Initialize the scene
    init();
}); 