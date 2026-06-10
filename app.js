/**
 * ============================================================
 * FILIP DAVCHEV — PORTFOLIO  |  app.js
 * ============================================================
 * Responsibilities:
 *  1. Navbar: scroll-aware glassmorphism state
 *  2. Mobile menu: toggle open/close with ARIA
 *  3. Scroll-reveal: IntersectionObserver for staggered
 *     fade-in / slide-up of .reveal-item elements
 *  4. Contact form: client-side validation + mock submit
 *  5. Footer year: auto-update copyright year
 * ============================================================
 */

/* ============================================================
   UTILITY: Wait for DOM to be ready before running anything.
   Using DOMContentLoaded rather than window.onload means we
   don't wait for images/fonts — interactions work immediately.
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  // ──────────────────────────────────────────────────────────
  // 1. NAVBAR — scroll-aware state
  //    Adds the `.scrolled` class once the user scrolls past
  //    64px, which triggers the denser glass background in CSS.
  // ──────────────────────────────────────────────────────────
  const navbar = document.getElementById('navbar');

  /**
   * handleNavbarScroll
   * Toggles `.scrolled` on the navbar based on window.scrollY.
   * Uses requestAnimationFrame to avoid layout thrashing on
   * rapid scroll events.
   */
  let scrollTicking = false;

  function handleNavbarScroll() {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 64) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  // Run once on load in case the page is already scrolled (e.g. back navigation)
  handleNavbarScroll();


  // ──────────────────────────────────────────────────────────
  // 2. MOBILE MENU — hamburger toggle
  //    Manages open/close state with proper ARIA attributes
  //    (aria-expanded, aria-hidden) for screen reader support.
  //    Clicking a link inside the menu also closes it.
  // ──────────────────────────────────────────────────────────
  const navToggle  = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  /** Track whether the menu is currently open */
  let menuOpen = false;

  /**
   * openMenu
   * Shows the mobile menu panel and updates ARIA state.
   */
  function openMenu() {
    menuOpen = true;
    // First set display so CSS transition can fire
    mobileMenu.style.display = 'block';
    // Use a tiny rAF delay so display:block registers before
    // the transition classes are applied
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        mobileMenu.classList.add('is-open');
        navToggle.classList.add('is-open');
        navToggle.setAttribute('aria-expanded', 'true');
        mobileMenu.setAttribute('aria-hidden', 'false');
        // Prevent body scroll while menu is open
        document.body.style.overflow = 'hidden';
      });
    });
  }

  /**
   * closeMenu
   * Hides the mobile menu panel and resets ARIA state.
   */
  function closeMenu() {
    menuOpen = false;
    mobileMenu.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Remove display:none after the CSS transition completes
    mobileMenu.addEventListener(
      'transitionend',
      () => {
        if (!menuOpen) mobileMenu.style.display = '';
      },
      { once: true }
    );
  }

  /**
   * toggleMenu
   * Switches between open and closed states.
   */
  function toggleMenu() {
    if (menuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  navToggle.addEventListener('click', toggleMenu);

  // Close menu when any internal link is clicked
  const mobileNavLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) {
      closeMenu();
      navToggle.focus(); // Return focus to toggle for accessibility
    }
  });

  // Close menu if viewport resizes past the tablet breakpoint
  // (so a menu open on narrow doesn't persist when widened)
  const mediaQuery = window.matchMedia('(min-width: 901px)');
  mediaQuery.addEventListener('change', (e) => {
    if (e.matches && menuOpen) closeMenu();
  });


  // ──────────────────────────────────────────────────────────
  // 3. SCROLL REVEAL — IntersectionObserver
  //    Observes all elements with class `.reveal-item`.
  //    When they enter the viewport (with a 10% threshold),
  //    `.is-visible` is added, triggering the CSS transition
  //    defined in style.css (fade-in + slide-up).
  //
  //    Stagger delay: handled via nth-child CSS rules,
  //    but parent containers also get a data-delay nudge
  //    for section-level sequences.
  // ──────────────────────────────────────────────────────────

  /**
   * Intersection callback: marks each revealed element visible.
   * Once revealed, we stop observing it (one-time animation).
   */
  function onReveal(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // fire once only
      }
    });
  }

  const revealObserver = new IntersectionObserver(onReveal, {
    root: null,      // viewport
    rootMargin: '0px 0px -60px 0px', // trigger a little before fully in view
    threshold: 0.1,
  });

  // Observe every .reveal-item on the page
  const revealTargets = document.querySelectorAll('.reveal-item');
  revealTargets.forEach(el => revealObserver.observe(el));

  // ─── Hero: fire immediately (it's already in view on load) ───
  // The hero section items use CSS animation-delay for the
  // initial page-load sequence, not the observer. We add
  // is-visible right away so CSS transitions apply.
  const heroItems = document.querySelectorAll('.hero .reveal-item');
  heroItems.forEach((el, index) => {
    // Stagger: 120ms between each hero element
    setTimeout(() => {
      el.classList.add('is-visible');
      revealObserver.unobserve(el); // already handled
    }, 100 + index * 120);
  });


  // ──────────────────────────────────────────────────────────
  // 4. CONTACT FORM — validation + submission via EmailJS
  //    Validates all fields on submit using a clean pattern:
  //    each field has its own validator function returning
  //    an error string or null. Errors display inline.
  //    On success, the form hides and a success banner appears.
  // ──────────────────────────────────────────────────────────
  const contactForm = document.getElementById('contactForm');
  const submitBtn   = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  // ── Field references ──
  const fields = {
    name:    document.getElementById('name'),
    email:   document.getElementById('email'),
    subject: document.getElementById('subject'),
    message: document.getElementById('message'),
  };

  // ── Error span references ──
  const errorSpans = {
    name:    document.getElementById('nameError'),
    email:   document.getElementById('emailError'),
    subject: document.getElementById('subjectError'),
    message: document.getElementById('messageError'),
  };

  /**
   * Validators
   * Each returns an error string if invalid, or null if valid.
   */
  const validators = {
    name(value) {
      if (!value.trim())          return 'Name is required.';
      if (value.trim().length < 2) return 'Name must be at least 2 characters.';
      return null;
    },
    email(value) {
      if (!value.trim()) return 'Email is required.';
      // Simple RFC-compliant email check
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!pattern.test(value)) return 'Please enter a valid email address.';
      return null;
    },
    subject(value) {
      if (!value.trim()) return 'Subject is required.';
      return null;
    },
    message(value) {
      if (!value.trim())              return 'Message is required.';
      if (value.trim().length < 10)   return 'Message must be at least 10 characters.';
      return null;
    },
  };

  /**
   * showFieldError
   * Applies error styling + message to a specific field.
   *
   * @param {string} fieldName - key in `fields` object
   * @param {string} message   - error string to display
   */
  function showFieldError(fieldName, message) {
    const input = fields[fieldName];
    const span  = errorSpans[fieldName];
    input.classList.add('is-error');
    input.classList.remove('is-success');
    span.textContent = message;
  }

  /**
   * clearFieldError
   * Removes error styling and marks the field as successfully validated.
   *
   * @param {string} fieldName - key in `fields` object
   */
  function clearFieldError(fieldName) {
    const input = fields[fieldName];
    const span  = errorSpans[fieldName];
    input.classList.remove('is-error');
    input.classList.add('is-success');
    span.textContent = '';
  }

  /**
   * validateField
   * Runs the appropriate validator for a field and updates the UI.
   *
   * @param {string} fieldName
   * @returns {boolean} true if valid
   */
  function validateField(fieldName) {
    const value = fields[fieldName].value;
    const error = validators[fieldName](value);
    if (error) {
      showFieldError(fieldName, error);
      return false;
    } else {
      clearFieldError(fieldName);
      return true;
    }
  }

  // ── Inline validation on blur (when user leaves a field) ──
  // This gives immediate, non-intrusive feedback.
  Object.keys(fields).forEach(fieldName => {
    fields[fieldName].addEventListener('blur', () => {
      // Only validate if the field has been touched (has any value or was focused)
      if (fields[fieldName].value.trim() !== '' || fields[fieldName].classList.contains('is-error')) {
        validateField(fieldName);
      }
    });

    // Clear error on input once user starts correcting
    fields[fieldName].addEventListener('input', () => {
      if (fields[fieldName].classList.contains('is-error')) {
        // Re-validate live only when fixing an error, not on first type
        validateField(fieldName);
      }
    });
  });

  /**
   * handleFormSubmit
   * Validates all fields, then sends the message via EmailJS.
   * The recipient email is configured directly in the EmailJS template.
   *
   * @param {SubmitEvent} e
   */

  // ── EmailJS initialisation ──
  // Replace 'YOUR_PUBLIC_KEY' with the Public Key from
  // https://dashboard.emailjs.com/admin/account
  emailjs.init({ publicKey: 'Q9eb1Tl_INctb6Lbm' });

  function handleFormSubmit(e) {
    e.preventDefault();

    // Validate every field and collect results
    const results = Object.keys(fields).map(name => validateField(name));
    const allValid = results.every(Boolean);

    if (!allValid) {
      const firstErrorName = Object.keys(fields).find(
        name => fields[name].classList.contains('is-error')
      );
      if (firstErrorName) fields[firstErrorName].focus();
      return;
    }

    setSubmitLoading(true);

    // EmailJS send — replace service & template IDs below
    // Service ID:  https://dashboard.emailjs.com/admin
    // Template ID: https://dashboard.emailjs.com/admin/templates
    emailjs.send(
      'service_5hchpb7',
      'template_7glnjrk',
      {
        from_name:    fields.name.value.trim(),
        from_email:   fields.email.value.trim(),
        subject:      fields.subject.value.trim(),
        message:      fields.message.value.trim(),
      }
    )
    .then(() => {
      setSubmitLoading(false);
      showFormSuccess();
    })
    .catch((error) => {
      setSubmitLoading(false);
      console.error('EmailJS error:', error);
      // Show a user-facing error on the button label
      const label = submitBtn.querySelector('.btn-label');
      label.textContent = 'Failed — try again';
      submitBtn.disabled = false;
      submitBtn.style.opacity = '';
      setTimeout(() => { label.textContent = 'Send Message'; }, 3000);
    });
  }

  /**
   * setSubmitLoading
   * Updates the submit button to a loading state during async mock.
   *
   * @param {boolean} loading
   */
  function setSubmitLoading(loading) {
    const label = submitBtn.querySelector('.btn-label');
    if (loading) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.75';
      label.textContent = 'Sending…';
    } else {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '';
      label.textContent = 'Send Message';
    }
  }

  /**
   * showFormSuccess
   * Hides the submit button and reveals the success confirmation.
   */
  function showFormSuccess() {
    // Smoothly fade out the button row
    submitBtn.style.transition = 'opacity 0.3s ease';
    submitBtn.style.opacity = '0';

    setTimeout(() => {
      submitBtn.style.display = 'none';
      formSuccess.removeAttribute('hidden');
      // Scroll the success message into view if needed
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 300);
  }

  contactForm.addEventListener('submit', handleFormSubmit);


  // ──────────────────────────────────────────────────────────
  // 5. FOOTER YEAR — auto-update copyright
  //    Keeps the year accurate without manual edits.
  // ──────────────────────────────────────────────────────────
  const footerYear = document.getElementById('footerYear');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }


  // ──────────────────────────────────────────────────────────
  // 6. ACTIVE NAV LINK HIGHLIGHT — scroll spy
  //    Observes each section and updates the nav link colour
  //    to reflect the currently visible section. Uses a
  //    separate IntersectionObserver with a large threshold
  //    so only the section that occupies most of the viewport
  //    is considered "active".
  // ──────────────────────────────────────────────────────────
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link[href^="#"]');

  /**
   * setActiveLink
   * Adds `.is-active` to the nav link matching the given section id.
   *
   * @param {string} id - section id without '#'
   */
  function setActiveLink(id) {
    navLinks.forEach(link => {
      const target = link.getAttribute('href').replace('#', '');
      if (target === id) {
        link.classList.add('is-active');
        link.style.color = 'var(--accent-cyan)';
      } else {
        link.classList.remove('is-active');
        link.style.color = '';
      }
    });
  }

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    {
      root: null,
      // Treat section as "active" when its top half is in the viewport
      rootMargin: '-40% 0px -50% 0px',
      threshold: 0,
    }
  );

  sections.forEach(section => sectionObserver.observe(section));


  // ──────────────────────────────────────────────────────────
  // 7. SKILL PILL HOVER — interactive ripple
  //    Adds a subtle scale-pop effect to skill pills on click,
  //    reinforcing interactivity with pure JS (CSS handles hover).
  // ──────────────────────────────────────────────────────────
  const skillPills = document.querySelectorAll('.skill-pill');

  skillPills.forEach(pill => {
    pill.addEventListener('click', () => {
      // Trigger a spring pop animation via CSS custom property nudge
      pill.style.transition = 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)';
      pill.style.transform  = 'scale(1.15)';

      // Reset after the pop
      setTimeout(() => {
        pill.style.transform = '';
        // Remove inline transition so hover state re-owns it
        setTimeout(() => {
          pill.style.transition = '';
        }, 200);
      }, 200);
    });
  });

}); // end DOMContentLoaded
