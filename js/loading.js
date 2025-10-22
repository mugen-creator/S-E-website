// Loading Screen
(function() {
  'use strict';

  const loadingScreen = document.getElementById('loadingScreen');

  // Minimum loading time (milliseconds)
  const MIN_LOADING_TIME = 1500;
  const startTime = Date.now();

  // Hide loading screen
  function hideLoadingScreen() {
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);

    setTimeout(() => {
      loadingScreen.classList.add('hidden');

      // Remove from DOM after transition
      setTimeout(() => {
        if (loadingScreen && loadingScreen.parentNode) {
          loadingScreen.parentNode.removeChild(loadingScreen);
        }
      }, 500);
    }, remainingTime);
  }

  // When page is fully loaded
  if (document.readyState === 'complete') {
    hideLoadingScreen();
  } else {
    window.addEventListener('load', hideLoadingScreen);
  }
})();
