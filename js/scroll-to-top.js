// Scroll to Top Button
(function() {
  'use strict';

  // Create scroll to top button
  const createScrollButton = () => {
    const button = document.createElement('button');
    button.className = 'scroll-to-top';
    button.setAttribute('aria-label', 'ページトップへ戻る');
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(button);
    return button;
  };

  const scrollButton = createScrollButton();

  // Show/hide button based on scroll position
  const toggleButtonVisibility = () => {
    if (window.pageYOffset > 300) {
      scrollButton.classList.add('visible');
    } else {
      scrollButton.classList.remove('visible');
    }
  };

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Event listeners
  window.addEventListener('scroll', toggleButtonVisibility);
  scrollButton.addEventListener('click', scrollToTop);

  // Initial check
  toggleButtonVisibility();
})();
