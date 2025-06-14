

(function() {
  "use strict";

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  function headerToggle() {
    document.querySelector('#header').classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
  }
  headerToggleBtn.addEventListener('click', headerToggle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });
  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      // Remove testimonial swiper initialization
      // Only initialize if not a testimonials section
      if (swiperElement.closest('.testimonials')) return;

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /**
   * Contact form AJAX submission
   */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const loading = contactForm.querySelector('.loading');
      const errorMsg = contactForm.querySelector('.error-message');
      const sentMsg = contactForm.querySelector('.sent-message');
      loading.style.display = 'block';
      errorMsg.style.display = 'none';
      sentMsg.style.display = 'none';

      const formData = new FormData(contactForm);
      const data = {};
      formData.forEach((value, key) => { data[key] = value; });

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(async response => {
        loading.style.display = 'none';
        if (response.ok) {
          sentMsg.style.display = 'block';
          contactForm.reset();
        } else {
          let res = {};
          try { res = await response.json(); } catch {}
          errorMsg.textContent = res.error || 'Submission failed. Status: ' + response.status;
          errorMsg.style.display = 'block';
          // Debug: log response for troubleshooting
          console.error('Contact form response error:', response.status, res);
        }
      })
      .catch((err) => {
        loading.style.display = 'none';
        errorMsg.textContent = 'Network error. Please try again.';
        errorMsg.style.display = 'block';
        // Debug: log error to console
        console.error('Contact form fetch error:', err);
      });
    });
  }

  // Contact Form Handling
  document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
      contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Collect form data
        const formData = {
          name: document.getElementById('name').value.trim(),
          email: document.getElementById('email').value.trim(),
          subject: document.getElementById('subject').value.trim(),
          message: document.getElementById('message').value.trim()
        };

        // Validate form data
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
          showFormStatus('Please fill in all fields.', 'error');
          return;
        }

        if (!isValidEmail(formData.email)) {
          showFormStatus('Please enter a valid email address.', 'error');
          return;
        }

        try {
          // Send the data to the server
          const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
          });

          const result = await response.json();

          if (result.success) {
            showFormStatus('Message sent successfully! Thank you for reaching out.', 'success');
            contactForm.reset();
          } else {
            showFormStatus(result.error || 'Failed to send message. Please try again.', 'error');
          }
        } catch (error) {
          console.error('Error:', error);
          showFormStatus('An error occurred. Please try again later.', 'error');
        }
      });
    }

    function showFormStatus(message, type) {
      formStatus.textContent = message;
      formStatus.className = type;
      formStatus.style.display = 'block';
      
      // Auto-hide the message after 5 seconds
      setTimeout(() => {
        formStatus.style.display = 'none';
      }, 5000);
    }

    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  });

})();
