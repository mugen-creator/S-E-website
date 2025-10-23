// Three.js Ocean Background Effect for Hero Section
(function() {
  'use strict';

  const heroBackground = document.getElementById('heroBackground');

  if (!heroBackground || typeof THREE === 'undefined') {
    return;
  }

  // Check if device is mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (isMobile) {
    // Use static gradient background on mobile for performance
    return;
  }

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  heroBackground.appendChild(renderer.domElement);

  // Camera position
  camera.position.z = 50;

  // Ocean Particles (representing water droplets/bubbles)
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 800;
  const posArray = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  // Create circular texture for bubbles
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  // Clear canvas (transparent background)
  ctx.clearRect(0, 0, 64, 64);

  // Draw circle with gradient (bubble effect)
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(109, 180, 200, 1)');
  gradient.addColorStop(0.3, 'rgba(139, 201, 217, 0.8)');
  gradient.addColorStop(0.7, 'rgba(232, 244, 248, 0.4)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(32, 32, 32, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);

  // Create size attribute for varying bubble sizes
  const sizes = new Float32Array(particlesCount);
  for (let i = 0; i < particlesCount; i++) {
    sizes[i] = Math.random() * 3 + 0.5;
  }
  particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  // Material with circular texture (ocean colors)
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.4,
    color: 0x6DB4C8, // Ocean blue color matching logo
    transparent: true,
    opacity: 0.6,
    blending: THREE.NormalBlending,
    map: texture,
    sizeAttenuation: true
  });

  // Mesh
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // Floating Bubbles
  const floatingBubbles = [];
  const maxBubbles = 5;

  class FloatingBubble {
    constructor() {
      this.reset();
    }

    reset() {
      // Random starting position (from bottom)
      this.position = new THREE.Vector3(
        (Math.random() - 0.5) * 80,
        -50 - Math.random() * 20,
        (Math.random() - 0.5) * 50
      );

      // Upward velocity with slight horizontal drift
      this.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.3,
        Math.random() * 0.5 + 0.3,
        (Math.random() - 0.5) * 0.2
      );

      this.life = 1.0;
      this.decay = 0.005 + Math.random() * 0.005;
      this.size = Math.random() * 2 + 1;

      // Create bubble geometry
      const bubbleGeometry = new THREE.SphereGeometry(this.size, 16, 16);
      const bubbleMaterial = new THREE.MeshBasicMaterial({
        color: 0x8BC9D9,
        transparent: true,
        opacity: 0.4,
        blending: THREE.NormalBlending
      });

      this.bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
      this.bubble.position.copy(this.position);
      scene.add(this.bubble);
    }

    update() {
      // Add wave-like horizontal motion
      this.velocity.x = Math.sin(this.position.y * 0.1) * 0.1;

      this.position.add(this.velocity);
      this.bubble.position.copy(this.position);
      this.life -= this.decay;

      // Fade out
      this.bubble.material.opacity = this.life * 0.4;

      // Reset if dead or too high
      if (this.life <= 0 || this.position.y > 50) {
        scene.remove(this.bubble);
        this.bubble.geometry.dispose();
        this.bubble.material.dispose();
        this.reset();
      }
    }
  }

  // Create floating bubbles
  for (let i = 0; i < maxBubbles; i++) {
    floatingBubbles.push(new FloatingBubble());
  }

  // Mouse interaction
  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  // Animation
  let animationId;
  let time = 0;

  // Store original positions
  const originalPositions = new Float32Array(posArray);

  function animate() {
    animationId = requestAnimationFrame(animate);
    time += 0.005;

    // Gentle camera movement for ocean wave effect
    camera.position.x = Math.sin(time * 0.08) * 3;
    camera.position.y = Math.cos(time * 0.12) * 2;
    camera.lookAt(0, 0, 0);

    // Mouse interaction - subtle camera tilt
    camera.position.x += mouseX * 2;
    camera.position.y += mouseY * 1.5;

    // Add wave motion to particles
    const positions = particlesGeometry.attributes.position.array;
    const sizeAttr = particlesGeometry.attributes.size.array;
    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      const origX = originalPositions[i3];
      const origY = originalPositions[i3 + 1];
      const origZ = originalPositions[i3 + 2];

      // Wave-like motion (horizontal and vertical)
      positions[i3] = origX + Math.sin(time * 0.4 + origY * 0.05) * 2;
      positions[i3 + 1] = origY + Math.cos(time * 0.3 + origX * 0.05) * 1.5;
      positions[i3 + 2] = origZ + Math.sin(time * 0.35 + origX * 0.03) * 1;

      // Gentle size pulsing (like breathing bubbles)
      sizeAttr[i] = (Math.sin(time * 0.5 + i * 0.1) * 0.3 + 1.0) * (Math.random() * 0.2 + 0.9);
    }
    particlesGeometry.attributes.position.needsUpdate = true;
    particlesGeometry.attributes.size.needsUpdate = true;

    // Update floating bubbles
    floatingBubbles.forEach(bubble => bubble.update());

    renderer.render(scene, camera);
  }

  animate();

  // Handle resize
  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', handleResize);

  // Clean up when leaving page
  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(animationId);
    particlesGeometry.dispose();
    particlesMaterial.dispose();
    texture.dispose();

    // Clean up floating bubbles
    floatingBubbles.forEach(bubble => {
      scene.remove(bubble.bubble);
      bubble.bubble.geometry.dispose();
      bubble.bubble.material.dispose();
    });

    renderer.dispose();
  });
})();
