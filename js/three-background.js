// Three.js Realistic Ocean Wave Background Effect for Hero Section
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
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  heroBackground.appendChild(renderer.domElement);

  // Camera position - positioned to look at ocean from above
  camera.position.set(0, 8, 15);
  camera.lookAt(0, 0, 0);

  // Create realistic ocean waves using PlaneGeometry
  const waveGeometry = new THREE.PlaneGeometry(100, 100, 128, 128);

  // Store original positions
  const originalPositions = new Float32Array(waveGeometry.attributes.position.array.length);
  for (let i = 0; i < originalPositions.length; i++) {
    originalPositions[i] = waveGeometry.attributes.position.array[i];
  }

  // Create ocean material with gradient
  const oceanMaterial = new THREE.MeshPhongMaterial({
    color: 0x2C5F7D,
    transparent: true,
    opacity: 0.9,
    shininess: 100,
    flatShading: false,
    side: THREE.DoubleSide
  });

  const ocean = new THREE.Mesh(waveGeometry, oceanMaterial);
  ocean.rotation.x = -Math.PI / 2;
  ocean.position.y = -3;
  scene.add(ocean);

  // Create second layer of waves (lighter color for depth)
  const waveGeometry2 = new THREE.PlaneGeometry(100, 100, 64, 64);
  const oceanMaterial2 = new THREE.MeshPhongMaterial({
    color: 0x4A8FA5,
    transparent: true,
    opacity: 0.6,
    shininess: 80,
    flatShading: false,
    side: THREE.DoubleSide
  });

  const ocean2 = new THREE.Mesh(waveGeometry2, oceanMaterial2);
  ocean2.rotation.x = -Math.PI / 2;
  ocean2.position.y = -2.5;
  scene.add(ocean2);

  // Add lighting for realistic effect
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(directionalLight);

  // Add point light for shimmer effect
  const pointLight = new THREE.PointLight(0x8BC9D9, 1, 50);
  pointLight.position.set(0, 5, 0);
  scene.add(pointLight);

  // Create foam/shore particles (wave crest)
  const foamParticlesGeometry = new THREE.BufferGeometry();
  const foamParticlesCount = 500;
  const foamPosArray = new Float32Array(foamParticlesCount * 3);

  for (let i = 0; i < foamParticlesCount * 3; i += 3) {
    foamPosArray[i] = (Math.random() - 0.5) * 80;     // x
    foamPosArray[i + 1] = Math.random() * 2 - 1;       // y
    foamPosArray[i + 2] = (Math.random() - 0.5) * 80; // z
  }

  foamParticlesGeometry.setAttribute('position', new THREE.BufferAttribute(foamPosArray, 3));

  // Create circular foam texture
  const foamCanvas = document.createElement('canvas');
  foamCanvas.width = 64;
  foamCanvas.height = 64;
  const foamCtx = foamCanvas.getContext('2d');
  const foamGradient = foamCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
  foamGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  foamGradient.addColorStop(0.5, 'rgba(232, 244, 248, 0.8)');
  foamGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  foamCtx.fillStyle = foamGradient;
  foamCtx.fillRect(0, 0, 64, 64);
  const foamTexture = new THREE.CanvasTexture(foamCanvas);

  const foamMaterial = new THREE.PointsMaterial({
    size: 0.8,
    color: 0xFFFFFF,
    transparent: true,
    opacity: 0.7,
    map: foamTexture,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const foamParticles = new THREE.Points(foamParticlesGeometry, foamMaterial);
  foamParticles.position.y = -2;
  scene.add(foamParticles);

  // Create shore line foam (wave breaking)
  const shoreFoam = [];
  const shoreFoamCount = 8;

  class ShoreFoam {
    constructor(index) {
      this.index = index;
      this.reset();
    }

    reset() {
      const angle = (this.index / shoreFoamCount) * Math.PI * 2;
      const radius = 15 + Math.random() * 10;

      this.position = new THREE.Vector3(
        Math.cos(angle) * radius,
        -2,
        Math.sin(angle) * radius
      );

      this.life = 1.0;
      this.decay = 0.003 + Math.random() * 0.002;
      this.scale = 1 + Math.random() * 2;

      // Create foam plane
      const foamGeom = new THREE.PlaneGeometry(this.scale * 3, this.scale * 0.5);
      const foamMat = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      });

      this.mesh = new THREE.Mesh(foamGeom, foamMat);
      this.mesh.rotation.x = -Math.PI / 2;
      this.mesh.position.copy(this.position);
      scene.add(this.mesh);
    }

    update(time) {
      this.life -= this.decay;

      // Gentle wave motion
      this.mesh.position.y = -2 + Math.sin(time * 2 + this.index) * 0.3;

      // Fade out
      this.mesh.material.opacity = this.life * 0.6;

      // Scale up slightly as it fades
      const scale = this.scale * (1 + (1 - this.life) * 0.5);
      this.mesh.scale.set(scale, scale, scale);

      if (this.life <= 0) {
        scene.remove(this.mesh);
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
        this.reset();
      }
    }
  }

  for (let i = 0; i < shoreFoamCount; i++) {
    shoreFoam.push(new ShoreFoam(i));
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

  function animate() {
    animationId = requestAnimationFrame(animate);
    time += 0.01;

    // Animate ocean waves with multiple sine waves
    const positions = ocean.geometry.attributes.position.array;
    const positions2 = ocean2.geometry.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {
      const x = originalPositions[i];
      const z = originalPositions[i + 1];

      // Create realistic wave pattern using multiple sine waves
      const wave1 = Math.sin(x * 0.5 + time) * 0.3;
      const wave2 = Math.sin(z * 0.3 + time * 1.5) * 0.2;
      const wave3 = Math.sin((x + z) * 0.2 + time * 0.8) * 0.25;

      positions[i + 2] = wave1 + wave2 + wave3;
    }

    for (let i = 0; i < positions2.length; i += 3) {
      const x = originalPositions[i];
      const z = originalPositions[i + 1];

      const wave1 = Math.sin(x * 0.4 + time * 1.2) * 0.4;
      const wave2 = Math.sin(z * 0.5 + time * 0.9) * 0.3;

      positions2[i + 2] = wave1 + wave2;
    }

    ocean.geometry.attributes.position.needsUpdate = true;
    ocean2.geometry.attributes.position.needsUpdate = true;

    // Animate foam particles
    const foamPositions = foamParticlesGeometry.attributes.position.array;
    for (let i = 0; i < foamParticlesCount; i++) {
      const i3 = i * 3;
      const x = foamPositions[i3];
      const z = foamPositions[i3 + 2];

      // Float on wave surface
      foamPositions[i3 + 1] = -2 + Math.sin(x * 0.3 + time) * 0.5 + Math.sin(z * 0.2 + time * 1.3) * 0.3;

      // Drift motion
      foamPositions[i3] += Math.sin(time + i) * 0.01;
      foamPositions[i3 + 2] += Math.cos(time + i) * 0.01;
    }
    foamParticlesGeometry.attributes.position.needsUpdate = true;

    // Update shore foam
    shoreFoam.forEach(foam => foam.update(time));

    // Gentle camera sway
    camera.position.x = Math.sin(time * 0.3) * 2 + mouseX * 3;
    camera.position.y = 8 + Math.cos(time * 0.2) * 0.5 + mouseY * 2;
    camera.lookAt(0, -2, 0);

    // Animate point light for shimmer
    pointLight.position.x = Math.sin(time * 0.5) * 10;
    pointLight.position.z = Math.cos(time * 0.5) * 10;
    pointLight.intensity = 0.8 + Math.sin(time * 2) * 0.3;

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

    ocean.geometry.dispose();
    ocean.material.dispose();
    ocean2.geometry.dispose();
    ocean2.material.dispose();
    foamParticlesGeometry.dispose();
    foamMaterial.dispose();
    foamTexture.dispose();

    shoreFoam.forEach(foam => {
      scene.remove(foam.mesh);
      foam.mesh.geometry.dispose();
      foam.mesh.material.dispose();
    });

    renderer.dispose();
  });
})();
