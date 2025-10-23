// Simple Ocean Wave Animation using Canvas 2D
(function() {
  'use strict';

  const heroBackground = document.getElementById('heroBackground');

  if (!heroBackground) {
    return;
  }

  // Create canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.style.display = 'block';
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';

  heroBackground.appendChild(canvas);

  // Set canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Wave parameters
  const waves = [
    {
      y: canvas.height * 0.7,
      length: 0.01,
      amplitude: 40,
      frequency: 0.002,
      color: 'rgba(44, 95, 125, 0.5)'
    },
    {
      y: canvas.height * 0.75,
      length: 0.012,
      amplitude: 35,
      frequency: 0.0025,
      color: 'rgba(74, 143, 165, 0.5)'
    },
    {
      y: canvas.height * 0.8,
      length: 0.015,
      amplitude: 30,
      frequency: 0.003,
      color: 'rgba(109, 180, 200, 0.5)'
    },
    {
      y: canvas.height * 0.85,
      length: 0.018,
      amplitude: 25,
      frequency: 0.0035,
      color: 'rgba(139, 201, 217, 0.4)'
    }
  ];

  let time = 0;

  // Draw wave
  function drawWave(wave, time) {
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);

    for (let x = 0; x < canvas.width; x++) {
      const y = wave.y + Math.sin(x * wave.length + time * wave.frequency) * wave.amplitude;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.fillStyle = wave.color;
    ctx.fill();
  }

  // Draw foam particles
  const foamParticles = [];
  const foamCount = 30;

  class FoamParticle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height * 0.7 + Math.random() * (canvas.height * 0.3);
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.3 - 0.15;
      this.opacity = Math.random() * 0.5 + 0.3;
      this.life = Math.random() * 100 + 100;
      this.maxLife = this.life;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life--;

      if (this.life <= 0 || this.y < canvas.height * 0.6 || this.y > canvas.height || this.x < 0 || this.x > canvas.width) {
        this.reset();
      }
    }

    draw() {
      const alpha = (this.life / this.maxLife) * this.opacity;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    }
  }

  // Initialize foam particles
  for (let i = 0; i < foamCount; i++) {
    foamParticles.push(new FoamParticle());
  }

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    time += 1;

    // Draw waves from back to front
    waves.forEach(wave => {
      drawWave(wave, time);
    });

    // Draw and update foam particles
    foamParticles.forEach(particle => {
      particle.update();
      particle.draw();
    });
  }

  animate();
})();
