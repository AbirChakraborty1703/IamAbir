/**
 * main.js — Clean, Defensive, All-in-One
 * Template: MyResume (Bootstrap v5.3.3)
 *
 * Make sure your HTML includes:
 *   <form class="contact-form">
 *     <div class="loading" style="display:none">Loading…</div>
 *     <div class="error-message" style="display:none"></div>
 *     <div class="sent-message" style="display:none"></div>
 *     <input id="name"    name="name"    />
 *     <input id="email"   name="email"   />
 *     <input id="subject" name="subject" />
 *     <textarea id="message" name="message"></textarea>
 *     <button type="submit">Send</button>
 *   </form>
 */

document.addEventListener('DOMContentLoaded', () => {
  "use strict";

  /*** Utility: Show / Hide ***/
  const show = (el, display = 'block') => el && (el.style.display = display);
  const hide = el => el && (el.style.display = 'none');

  /*** HEADER TOGGLE ***/
  const headerToggleBtn = document.querySelector('.header-toggle');
  const headerEl        = document.getElementById('header');
  if (headerToggleBtn && headerEl) {
    headerToggleBtn.addEventListener('click', () => {
      headerEl.classList.toggle('header-show');
      headerToggleBtn.classList.toggle('bi-list');
      headerToggleBtn.classList.toggle('bi-x');
    });
  }

  /*** HIDE MOBILE NAV ON LINK CLICK ***/
  document.querySelectorAll('#navmenu a').forEach(link => {
    link.addEventListener('click', () => {
      if (headerEl?.classList.contains('header-show')) {
        headerToggleBtn.click();
      }
    });
  });

  /*** MOBILE NAV DROPDOWNS ***/
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(toggle => {
    toggle.addEventListener('click', e => {
      e.preventDefault();
      const parent = toggle.parentNode;
      parent.classList.toggle('active');
      parent.nextElementSibling?.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /*** PRELOADER ***/
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => preloader.remove());
  }

  /*** SCROLL-TOP BUTTON ***/
  const scrollTopBtn = document.querySelector('.scroll-top');
  function toggleScrollTop() {
    if (!scrollTopBtn) return;
    scrollTopBtn.classList.toggle('active', window.scrollY > 100);
  }
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', toggleScrollTop);
    window.addEventListener('load', toggleScrollTop);
  }

  /*** AOS ANIMATIONS ***/
  window.addEventListener('load', () => {
    if (window.AOS) {
      AOS.init({ duration: 600, easing: 'ease-in-out', once: true, mirror: false });
    }
  });

  /*** TYPED.JS ***/
  const typedEl = document.querySelector('.typed');
  if (typedEl && window.Typed) {
    const items = typedEl.getAttribute('data-typed-items')?.split(',') || [];
    new Typed('.typed', {
      strings: items,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /*** PURE COUNTER ***/
  if (window.PureCounter) {
    new PureCounter();
  }

  /*** SKILLS PROGRESS ANIMATION ***/
  document.querySelectorAll('.skills-animation').forEach(item => {
    if (window.Waypoint) {
      new Waypoint({
        element: item,
        offset: '80%',
        handler: () => {
          item.querySelectorAll('.progress .progress-bar').forEach(bar => {
            bar.style.width = bar.getAttribute('aria-valuenow') + '%';
          });
        }
      });
    }
  });

  /*** GLIGHTBOX ***/
  if (window.GLightbox) {
    GLightbox({ selector: '.glightbox' });
  }

  /*** SWIPER SLIDERS ***/
  function initSwiper() {
    document.querySelectorAll('.init-swiper').forEach(el => {
      const cfgEl = el.querySelector('.swiper-config');
      if (!cfgEl || el.closest('.testimonials')) return;
      try {
        const cfg = JSON.parse(cfgEl.textContent.trim());
        if (el.classList.contains('swiper-tab')) {
          initSwiperWithCustomPagination(el, cfg);
        } else {
          new Swiper(el, cfg);
        }
      } catch (err) {
        console.error('Swiper config parse error:', err);
      }
    });
  }
  window.addEventListener('load', initSwiper);

  /*** HASH-SCROLL CORRECTION ***/
  window.addEventListener('load', () => {
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        setTimeout(() => {
          const margin = parseInt(getComputedStyle(target).scrollMarginTop) || 0;
          window.scrollTo({ top: target.offsetTop - margin, behavior: 'smooth' });
        }, 100);
      }
    }
  });

  /*** NAVMENU SCROLLSPY ***/
  const navLinks = document.querySelectorAll('.navmenu a');
  function scrollspy() {
    const pos = window.scrollY + 200;
    navLinks.forEach(link => {
      if (!link.hash) return;
      const section = document.querySelector(link.hash);
      if (!section) return;
      link.classList.toggle('active',
        pos >= section.offsetTop &&
        pos <= section.offsetTop + section.offsetHeight
      );
    });
  }
  window.addEventListener('load', scrollspy);
  window.addEventListener('scroll', scrollspy);

  /*** CONTACT FORM AJAX SUBMISSION ***/
  (function contactFormHandler() {
    const form       = document.querySelector('.contact-form');
    const loading    = form?.querySelector('.loading');
    const errorMsg   = form?.querySelector('.error-message');
    const successMsg = form?.querySelector('.sent-message');

    if (!form) {
      console.warn('No .contact-form found on page.');
      return;
    }

    const isValidEmail = email => /^\S+@\S+\.\S+$/.test(email);

    form.addEventListener('submit', async e => {
      e.preventDefault();
      hide(errorMsg);
      hide(successMsg);
      show(loading);

      // Collect inputs
      const data = {
        name:    form.querySelector('#name')?.value.trim()    || '',
        email:   form.querySelector('#email')?.value.trim()   || '',
        subject: form.querySelector('#subject')?.value.trim() || '',
        message: form.querySelector('#message')?.value.trim() || ''
      };

      // Validate
      if (!data.name || !data.email || !data.subject || !data.message) {
        hide(loading);
        show(errorMsg);
        errorMsg.textContent = 'Please fill in all fields.';
        return;
      }
      if (!isValidEmail(data.email)) {
        hide(loading);
        show(errorMsg);
        errorMsg.textContent = 'Please enter a valid email address.';
        return;
      }

      try {
        // 🔧 Replace with your actual form endpoint:
        const ENDPOINT = 'https://YOUR-FORM-ENDPOINT/api/contact';

        const resp = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        hide(loading);

        // Attempt to parse JSON; fallback to raw text
        const text = await resp.text();
        let result;
        try { result = JSON.parse(text); } catch { result = null; }

        if (resp.ok && result?.success !== false) {
          show(successMsg);
          successMsg.textContent = result?.message || 'Message sent successfully!';
          form.reset();
        } else {
          show(errorMsg);
          errorMsg.textContent = result?.error || `Submission failed (status ${resp.status})`;
          console.error('Contact error:', resp.status, text);
        }
      } catch (err) {
        hide(loading);
        show(errorMsg);
        errorMsg.textContent = 'Network error. Please try again.';
        console.error('Network error:', err);
      }
    });
  })();

});
