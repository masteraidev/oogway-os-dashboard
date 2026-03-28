// Three.js scene for OOGWAY OS
let scene, camera, renderer, particles, grid, centralOrb, rings = [];
let mouseX = 0, mouseY = 0;

export function initThreeScene() {
    const container = document.getElementById('three-container');
    
    // Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.001);
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 100;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Create scene elements
    createParticleField();
    createGridFloor();
    createCentralOrb();
    createOrbitingRings();
    
    // Event listeners
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onMouseMove);
    
    // Start animation loop
    animate();
}

function createParticleField() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];
    
    for (let i = 0; i < 5000; i++) {
        vertices.push(
            Math.random() * 400 - 200,
            Math.random() * 400 - 200,
            Math.random() * 400 - 200
        );
        
        // Cyan to purple gradient
        const color = new THREE.Color();
        color.setHSL(0.5 + Math.random() * 0.2, 1, 0.5);
        colors.push(color.r, color.g, color.b);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function createGridFloor() {
    const gridHelper = new THREE.GridHelper(200, 50, 0x00ffff, 0x4400ff);
    gridHelper.position.y = -50;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.3;
    scene.add(gridHelper);
    grid = gridHelper;
}

function createCentralOrb() {
    const geometry = new THREE.SphereGeometry(15, 32, 32);
    const material = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    centralOrb = new THREE.Mesh(geometry, material);
    scene.add(centralOrb);
    
    // Inner glow
    const glowGeometry = new THREE.SphereGeometry(12, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x9d4edd,
        transparent: true,
        opacity: 0.3
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    centralOrb.add(glow);
}

function createOrbitingRings() {
    const ringCount = 3;
    for (let i = 0; i < ringCount; i++) {
        const geometry = new THREE.TorusGeometry(25 + i * 10, 0.5, 16, 100);
        const material = new THREE.MeshBasicMaterial({
            color: i === 0 ? 0xffd700 : i === 1 ? 0x00ffff : 0x9d4edd,
            transparent: true,
            opacity: 0.6
        });
        const ring = new THREE.Mesh(geometry, material);
        ring.rotation.x = Math.PI / 2 + (i * 0.2);
        ring.rotation.y = i * 0.5;
        rings.push(ring);
        scene.add(ring);
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

export function updateThreeScene() {
    // Update based on mouse
    camera.position.x += (mouseX * 20 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 20 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    // Rotate central orb
    centralOrb.rotation.y += 0.01;
    centralOrb.rotation.x += 0.005;
    
    // Pulse effect
    const pulse = 1 + Math.sin(Date.now() * 0.003) * 0.1;
    centralOrb.scale.set(pulse, pulse, pulse);
    
    // Rotate rings
    rings.forEach((ring, i) => {
        ring.rotation.z += 0.005 * (i + 1);
        ring.position.y = Math.sin(Date.now() * 0.001 + i) * 2;
    });
    
    // Animate particles based on mouse
    if (particles) {
        particles.rotation.y += 0.001;
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += Math.sin(Date.now() * 0.001 + i) * 0.05;
        }
        particles.geometry.attributes.position.needsUpdate = true;
    }
}

function animate() {
    requestAnimationFrame(animate);
    updateThreeScene();
    renderer.render(scene, camera);
}