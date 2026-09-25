/* ==========================================================================
   SkyNet - Identity Security Solutions
   Vanilla JavaScript - navigation, scroll behaviour, reveal animations
   ========================================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setupFooterYear();
    setupMobileNav();
    setupNavbarScrollState();
    setupSmoothScrolling();
    setupActiveNavTracking();
    setupRevealAnimations(prefersReducedMotion);
    setupBackToTop();
  }

  /* ---------- Footer year ---------- */
  function setupFooterYear() {
    const yearEls = document.querySelectorAll('[data-year]');
    const year = String(new Date().getFullYear());
    yearEls.forEach(function (el) {
      el.textContent = year;
    });
  }

  /* ---------- Mobile navigation ---------- */
  function setupMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const panel = document.querySelector('.mobile-panel');

    if (!toggle || !panel) return;

    toggle.addEventListener('click', function () {
      const isOpen = panel.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    panel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        panel.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && panel.classList.contains('is-open')) {
        panel.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });
  }

  /* ---------- Navbar scroll state ---------- */
  function setupNavbarScrollState() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const applyState = function () {
      if (window.scrollY > 24) {
        navbar.classList.add('is-scrolled');
      } else {
        navbar.classList.remove('is-scrolled');
      }
    };

    applyState();
    window.addEventListener('scroll', applyState, { passive: true });
  }

  /* ---------- Smooth scrolling for same-page anchors ---------- */
  function setupSmoothScrolling() {
    const navbar = document.querySelector('.navbar');

    document.querySelectorAll('a[href*="#"]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;

        const hashIndex = href.indexOf('#');
        const path = href.substring(0, hashIndex);
        const hash = href.substring(hashIndex + 1);

        const isSamePage = path === '' || path === window.location.pathname.split('/').pop() || (path === './' + window.location.pathname.split('/').pop());

        if (!isSamePage || !hash) return;

        const target = document.getElementById(hash);
        if (!target) return;

        event.preventDefault();
        const offset = (navbar ? navbar.offsetHeight : 0) + 12;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
          top: top,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        });

        history.pushState(null, '', '#' + hash);
      });
    });
  }

  /* ---------- Active section tracking ---------- */
  function setupActiveNavTracking() {
    const sections = document.querySelectorAll('main [id]');
    const navAnchors = document.querySelectorAll('.nav-links a, .mobile-panel a');

    if (!navAnchors.length) return;

    const currentFile = window.location.pathname.split('/').pop() || 'index.html';

    /* Page-level links (no #fragment, e.g. About, Contact) are active
       whenever their href matches the current file. Scroll tracking
       below only ever touches links that carry a #fragment. */
    navAnchors.forEach(function (a) {
      const href = a.getAttribute('href') || '';
      if (href !== '' && href.indexOf('#') === -1 && href === currentFile) {
        a.classList.add('is-active');
        a.setAttribute('aria-current', 'page');
      }
    });

    if (!sections.length || !('IntersectionObserver' in window)) return;

    const setActive = function (id) {
      navAnchors.forEach(function (a) {
        const href = a.getAttribute('href') || '';
        const hashIndex = href.indexOf('#');
        if (hashIndex === -1) return;
        const path = href.substring(0, hashIndex);
        const hash = href.substring(hashIndex + 1);
        const matchesFile = path === '' || path === currentFile;

        if (matchesFile && hash === id) {
          a.classList.add('is-active');
          a.setAttribute('aria-current', 'page');
        } else {
          a.classList.remove('is-active');
          a.removeAttribute('aria-current');
        }
      });
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    }, {
      rootMargin: '-40% 0px -50% 0px',
      threshold: 0
    });

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ---------- Scroll reveal animations ---------- */
  function setupRevealAnimations(prefersReducedMotion) {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    });

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- Back to top ---------- */
  function setupBackToTop() {
    const button = document.querySelector('.back-to-top');
    if (!button) return;

    const toggleVisibility = function () {
      if (window.scrollY > 480) {
        button.classList.add('is-visible');
      } else {
        button.classList.remove('is-visible');
      }
    };

    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility, { passive: true });

    button.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
    });
  }
})();
