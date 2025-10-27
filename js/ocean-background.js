// Ocean Wave Video Background
(function() {
  'use strict';

  const heroBackground = document.getElementById('heroBackground');

  if (!heroBackground) {
    return;
  }

  // Create video element
  const video = document.createElement('video');
  video.src = 'assets/videos/hero-background.mp4';
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.playsInline = true; // For iOS

  // Style the video
  video.style.position = 'absolute';
  video.style.top = '50%';
  video.style.left = '50%';
  video.style.transform = 'translate(-50%, -50%)';
  video.style.minWidth = '100%';
  video.style.minHeight = '100%';
  video.style.width = 'auto';
  video.style.height = 'auto';
  video.style.objectFit = 'cover';
  video.style.zIndex = '-1';

  heroBackground.appendChild(video);

  // Play video when ready
  video.addEventListener('loadeddata', function() {
    video.play().catch(function(error) {
      console.log('Video autoplay failed:', error);
    });
  });

  // Optional: Add subtle overlay for better text readability
  const overlay = document.createElement('div');
  overlay.style.position = 'absolute';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.background = 'linear-gradient(135deg, rgba(44, 95, 125, 0.3) 0%, rgba(74, 143, 165, 0.2) 100%)';
  overlay.style.zIndex = '0';

  heroBackground.appendChild(overlay);
})();
