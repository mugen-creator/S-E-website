// Form Validation
(function() {
  'use strict';

  const form = document.getElementById('contactForm');

  if (!form) {
    return;
  }

  // Validation functions
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validatePhone(phone) {
    // Allow various phone formats
    const re = /^[\d\-\+\(\)\s]+$/;
    return phone === '' || re.test(phone);
  }

  function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message') || createErrorElement(formGroup);

    input.classList.add('error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }

  function clearError(input) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');

    input.classList.remove('error');
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  }

  function createErrorElement(formGroup) {
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    formGroup.appendChild(errorElement);
    return errorElement;
  }

  // Real-time validation
  const inputs = form.querySelectorAll('input, textarea, select');

  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateField(this);
    });

    input.addEventListener('input', function() {
      if (this.classList.contains('error')) {
        validateField(this);
      }
    });
  });

  function validateField(field) {
    const value = field.value.trim();
    const name = field.name;

    clearError(field);

    // Required fields
    if (field.hasAttribute('required') && value === '') {
      showError(field, 'この項目は必須です');
      return false;
    }

    // Email validation
    if (name === 'email' && value !== '' && !validateEmail(value)) {
      showError(field, '有効なメールアドレスを入力してください');
      return false;
    }

    // Phone validation
    if (name === 'phone' && value !== '' && !validatePhone(value)) {
      showError(field, '有効な電話番号を入力してください');
      return false;
    }

    return true;
  }

  // Form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    let isValid = true;

    // Validate all fields
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    if (!isValid) {
      // Scroll to first error
      const firstError = form.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Show success message (in production, send data to server)
    showSuccessMessage();
  });

  function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');

    if (successMessage) {
      successMessage.style.display = 'block';
      form.style.display = 'none';

      // Scroll to success message
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Reset form after 5 seconds
      setTimeout(() => {
        form.reset();
        form.style.display = 'block';
        successMessage.style.display = 'none';
      }, 5000);
    }
  }
})();
