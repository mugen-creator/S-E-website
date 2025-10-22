// Scroll Animation using Intersection Observer
(function() {
  'use strict';

  // Elements to animate
  const animatedElements = document.querySelectorAll(
    '.fade-in, .slide-in-left, .slide-in-right, .scale-up'
  );

  // Intersection Observer options
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  // Callback function
  function handleIntersect(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionally, stop observing after animation
        // observer.unobserve(entry.target);
      }
    });
  }

  // Create observer
  const observer = new IntersectionObserver(handleIntersect, observerOptions);

  // Observe all animated elements
  animatedElements.forEach(element => {
    observer.observe(element);
  });

  // Parallax effect for hero section (optional)
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallaxSpeed = 0.5;
      hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    });
  }
})();
