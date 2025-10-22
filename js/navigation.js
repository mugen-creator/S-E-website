// Navigation and Hamburger Menu
(function() {
  'use strict';

  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  // Scroll header behavior
  let lastScroll = 0;

  function handleScroll() {
    const currentScroll = window.pageYOffset;

    // Change header background on scroll
    if (currentScroll > 100) {
      header.classList.remove('transparent');
    } else {
      // Only add transparent class on home page hero section
      if (document.querySelector('.hero')) {
        header.classList.add('transparent');
      }
    }

    lastScroll = currentScroll;
  }

  // Toggle mobile menu
  function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  }

  // Close mobile menu
  function closeMobileMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Event listeners
  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
  }

  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMobileMenu);
  }

  // Close menu when clicking a link
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Handle scroll
  window.addEventListener('scroll', handleScroll);

  // Initial check
  handleScroll();

  // Active link highlighting
  function setActiveLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;
      if (linkPath === currentPath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  setActiveLink();
})();
