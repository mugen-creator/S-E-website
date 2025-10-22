// Three.js Background Effect for Hero Section
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

  // Particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 1000;
  const posArray = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  // Create circular texture
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  // Clear canvas (transparent background)
  ctx.clearRect(0, 0, 64, 64);

  // Draw circle with gradient
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.4)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(32, 32, 32, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);

  // Create size attribute for varying star sizes
  const sizes = new Float32Array(particlesCount);
  for (let i = 0; i < particlesCount; i++) {
    sizes[i] = Math.random() * 2 + 0.5;
  }
  particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  // Material with circular texture
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.3,
    color: 0xFFFFFF,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    map: texture,
    sizeAttenuation: true
  });

  // Mesh
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // Shooting Stars
  const shootingStars = [];
  const maxShootingStars = 3;

  class ShootingStar {
    constructor() {
      this.reset();
    }

    reset() {
      // Random starting position
      this.position = new THREE.Vector3(
        (Math.random() - 0.5) * 100,
        Math.random() * 50 + 20,
        (Math.random() - 0.5) * 50
      );

      // Direction and speed
      this.velocity = new THREE.Vector3(
        Math.random() * 2 + 1,
        -(Math.random() * 1.5 + 1),
        Math.random() * 0.5 - 0.25
      );

      this.life = 1.0;
      this.decay = 0.01 + Math.random() * 0.01;

      // Create trail
      const trailGeometry = new THREE.BufferGeometry();
      const trailPositions = new Float32Array(30); // 10 points for trail
      trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));

      const trailMaterial = new THREE.LineBasicMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      });

      this.trail = new THREE.Line(trailGeometry, trailMaterial);
      scene.add(this.trail);

      this.trailPoints = [];
      for (let i = 0; i < 10; i++) {
        this.trailPoints.push(this.position.clone());
      }
    }

    update() {
      this.position.add(this.velocity);
      this.life -= this.decay;

      // Update trail
      this.trailPoints.unshift(this.position.clone());
      if (this.trailPoints.length > 10) {
        this.trailPoints.pop();
      }

      const positions = this.trail.geometry.attributes.position.array;
      for (let i = 0; i < this.trailPoints.length; i++) {
        positions[i * 3] = this.trailPoints[i].x;
        positions[i * 3 + 1] = this.trailPoints[i].y;
        positions[i * 3 + 2] = this.trailPoints[i].z;
      }
      this.trail.geometry.attributes.position.needsUpdate = true;

      // Fade out
      this.trail.material.opacity = this.life * 0.8;

      // Reset if dead
      if (this.life <= 0) {
        scene.remove(this.trail);
        this.trail.geometry.dispose();
        this.trail.material.dispose();
        this.reset();
      }
    }
  }

  // Create shooting stars
  for (let i = 0; i < maxShootingStars; i++) {
    shootingStars.push(new ShootingStar());
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

    // Subtle camera movement for parallax effect
    camera.position.x = Math.sin(time * 0.1) * 2;
    camera.position.y = Math.cos(time * 0.15) * 1.5;
    camera.lookAt(0, 0, 0);

    // Mouse interaction - subtle camera tilt
    camera.position.x += mouseX * 3;
    camera.position.y += mouseY * 2;

    // Add subtle floating motion to stars
    const positions = particlesGeometry.attributes.position.array;
    const sizeAttr = particlesGeometry.attributes.size.array;
    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      const origX = originalPositions[i3];
      const origY = originalPositions[i3 + 1];
      const origZ = originalPositions[i3 + 2];

      // Gentle floating motion
      positions[i3] = origX + Math.sin(time * 0.3 + i * 0.1) * 0.5;
      positions[i3 + 1] = origY + Math.cos(time * 0.2 + i * 0.1) * 0.5;
      positions[i3 + 2] = origZ + Math.sin(time * 0.25 + i * 0.15) * 0.8;

      // Twinkle effect
      sizeAttr[i] = (Math.sin(time + i) * 0.4 + 1.0) * (Math.random() * 0.3 + 0.8);
    }
    particlesGeometry.attributes.position.needsUpdate = true;
    particlesGeometry.attributes.size.needsUpdate = true;

    // Update shooting stars
    shootingStars.forEach(star => star.update());

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

    // Clean up shooting stars
    shootingStars.forEach(star => {
      scene.remove(star.trail);
      star.trail.geometry.dispose();
      star.trail.material.dispose();
    });

    renderer.dispose();
  });
})();
