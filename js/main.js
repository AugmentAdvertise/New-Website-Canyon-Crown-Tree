/**
 * Canyon Crown Tree - Main JavaScript
 * Vanilla ES6+ | No dependencies
 * Handles: navigation, animations, sliders, forms, gallery, and UI interactions
 */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. MOBILE NAVIGATION TOGGLE
  // ============================================================

  const navToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu   = document.querySelector('.nav-menu');
  const body = document.body;

  const closeNav = () => {
    navToggle?.classList.remove('active');
    navMenu?.classList.remove('open');
    body.classList.remove('nav-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  };

  const openNav = () => {
    navToggle?.classList.add('active');
    navMenu?.classList.add('open');
    body.classList.add('nav-open');
    navToggle?.setAttribute('aria-expanded', 'true');
  };

  navToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navMenu?.classList.contains('open');
    isOpen ? closeNav() : openNav();
  });

  // Close nav when clicking a menu link
  navMenu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 992) closeNav();
    });
  });

  // Close nav on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });


  // ============================================================
  // 2. STICKY HEADER (add 'scrolled' class after 100px)
  // ============================================================

  const header = document.querySelector('header') ||
                 document.querySelector('.site-header');

  const handleStickyHeader = () => {
    if (!header) return;
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleStickyHeader, { passive: true });
  handleStickyHeader(); // run once on load


  // ============================================================
  // 3. SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================================

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerOffset = header ? header.offsetHeight : 0;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    });
  });


  // ============================================================
  // 4. SCROLL-TRIGGERED FADE-IN ANIMATIONS (IntersectionObserver)
  // ============================================================

  const fadeElements = document.querySelectorAll('.fade-in');

  if (fadeElements.length > 0) {
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    fadeElements.forEach((el) => fadeObserver.observe(el));
  }


  // ============================================================
  // 5. TESTIMONIAL SLIDER / CAROUSEL
  // ============================================================

  const testimonialSlider = document.querySelector('.testimonial-slider');

  if (testimonialSlider) {
    const slides   = testimonialSlider.querySelectorAll('.testimonial-slide');
    const prevBtn  = testimonialSlider.querySelector('.slider-prev') ||
                     document.querySelector('.testimonial-prev');
    const nextBtn  = testimonialSlider.querySelector('.slider-next') ||
                     document.querySelector('.testimonial-next');
    const dotsWrap = testimonialSlider.querySelector('.slider-dots') ||
                     document.querySelector('.testimonial-dots');
    let currentSlide = 0;
    let autoplayTimer = null;

    // Build dot indicators
    if (dotsWrap && slides.length > 0) {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsWrap.appendChild(dot);
      });
    }

    const dots = dotsWrap ? dotsWrap.querySelectorAll('.dot') : [];

    const goToSlide = (index) => {
      slides[currentSlide]?.classList.remove('active');
      dots[currentSlide]?.classList.remove('active');

      currentSlide = (index + slides.length) % slides.length;

      slides[currentSlide]?.classList.add('active');
      dots[currentSlide]?.classList.add('active');
    };

    const nextSlide = () => goToSlide(currentSlide + 1);
    const prevSlide = () => goToSlide(currentSlide - 1);

    // Auto-advance every 5 seconds
    const startAutoplay = () => {
      autoplayTimer = setInterval(nextSlide, 5000);
    };
    const stopAutoplay = () => clearInterval(autoplayTimer);

    prevBtn?.addEventListener('click', () => { stopAutoplay(); prevSlide(); startAutoplay(); });
    nextBtn?.addEventListener('click', () => { stopAutoplay(); nextSlide(); startAutoplay(); });

    // Pause on hover
    testimonialSlider.addEventListener('mouseenter', stopAutoplay);
    testimonialSlider.addEventListener('mouseleave', startAutoplay);

    // Initialize: show first slide
    if (slides.length > 0) {
      slides[0].classList.add('active');
      startAutoplay();
    }
  }


  // ============================================================
  // 6. BEFORE / AFTER IMAGE COMPARISON SLIDER
  // ============================================================

  document.querySelectorAll('.ba-slider').forEach((slider) => {
    const handle    = slider.querySelector('.ba-handle');
    const afterImg  = slider.querySelector('.ba-after');
    let isDragging  = false;

    if (!handle || !afterImg) return;

    const setPosition = (x) => {
      const rect = slider.getBoundingClientRect();
      let percent = ((x - rect.left) / rect.width) * 100;
      percent = Math.max(0, Math.min(100, percent));

      handle.style.left = `${percent}%`;
      afterImg.style.clipPath = `inset(0 0 0 ${percent}%)`;
    };

    handle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      isDragging = true;
      slider.classList.add('dragging');
    });
    handle.addEventListener('touchstart', () => {
      isDragging = true;
      slider.classList.add('dragging');
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) setPosition(e.clientX);
    });
    window.addEventListener('touchmove', (e) => {
      if (isDragging) setPosition(e.touches[0].clientX);
    }, { passive: true });

    const stopDrag = () => {
      isDragging = false;
      slider.classList.remove('dragging');
    };
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchend', stopDrag);
  });


  // ============================================================
  // 7. FAQ ACCORDION
  // ============================================================

  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer   = item.querySelector('.faq-answer');

    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other items (single-open accordion)
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('active');
          const otherAnswer = other.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      // Toggle current item
      item.classList.toggle('active');
      if (!isOpen) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = null;
      }
    });
  });


  // ============================================================
  // 8 & 9. FORM VALIDATION + SUBMISSION HANDLER
  // ============================================================

  const forms = document.querySelectorAll('.contact-form, .quote-form');

  /**
   * Validate a single field and return an error message or empty string.
   */
  const validateField = (field) => {
    const value = field.value.trim();
    const name  = field.getAttribute('name') || field.id || '';

    // Required check
    if (field.hasAttribute('required') && value === '') {
      return 'This field is required.';
    }

    // Email format
    if (field.type === 'email' && value !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address.';
      }
    }

    // Phone format (allow digits, spaces, dashes, parens, plus sign)
    if ((field.type === 'tel' || name === 'phone') && value !== '') {
      const phoneRegex = /^[\d\s\-\(\)\+]{7,20}$/;
      if (!phoneRegex.test(value)) {
        return 'Please enter a valid phone number.';
      }
    }

    return '';
  };

  /**
   * Show or clear error state for a field.
   */
  const showFieldError = (field, message) => {
    const wrapper = field.closest('.form-group') || field.parentElement;
    let errorEl = wrapper.querySelector('.field-error');

    if (message) {
      field.classList.add('error');
      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.classList.add('field-error');
        wrapper.appendChild(errorEl);
      }
      errorEl.textContent = message;
    } else {
      field.classList.remove('error');
      if (errorEl) errorEl.remove();
    }
  };

  forms.forEach((form) => {
    const fields = form.querySelectorAll('input, textarea, select');

    // Real-time validation on blur
    fields.forEach((field) => {
      field.addEventListener('blur', () => {
        showFieldError(field, validateField(field));
      });
      // Clear error as user types
      field.addEventListener('input', () => {
        if (field.classList.contains('error')) {
          showFieldError(field, validateField(field));
        }
      });
    });

    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      fields.forEach((field) => {
        const error = validateField(field);
        showFieldError(field, error);
        if (error) isValid = false;
      });

      if (!isValid) {
        // Focus the first field with an error
        const firstError = form.querySelector('.error');
        firstError?.focus();
        return;
      }

      // Disable submit button during "send"
      const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
      }

      // Simulate async submission (replace with real fetch call)
      setTimeout(() => {
        // Show success message
        let successEl = form.querySelector('.form-success');
        if (!successEl) {
          successEl = document.createElement('div');
          successEl.classList.add('form-success');
          form.appendChild(successEl);
        }
        successEl.textContent = 'Thank you! Your message has been sent. We will be in touch shortly.';
        successEl.classList.add('visible');

        form.reset();

        // Re-enable button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.originalText || 'Submit';
        }

        // Hide success message after 6 seconds
        setTimeout(() => successEl.classList.remove('visible'), 6000);
      }, 1200);
    });
  });


  // ============================================================
  // 10. BACK TO TOP BUTTON
  // ============================================================

  const backToTop = document.querySelector('.back-to-top');

  if (backToTop) {
    const toggleBackToTop = () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // ============================================================
  // 11. LAZY LOADING IMAGES (IntersectionObserver)
  // ============================================================

  const lazyImages = document.querySelectorAll('img[data-src]');

  if (lazyImages.length > 0) {
    const lazyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            if (img.dataset.srcset) img.srcset = img.dataset.srcset;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
            lazyObserver.unobserve(img);
          }
        });
      },
      { rootMargin: '200px 0px' }
    );

    lazyImages.forEach((img) => lazyObserver.observe(img));
  }


  // ============================================================
  // 12. GALLERY LIGHTBOX
  // ============================================================

  const galleryItems = document.querySelectorAll(
    '.gallery-item img, .gallery a[data-lightbox], .lightbox-trigger'
  );

  if (galleryItems.length > 0) {
    // Build lightbox DOM
    const lightbox = document.createElement('div');
    lightbox.classList.add('lightbox');
    lightbox.innerHTML = `
      <div class="lightbox-overlay"></div>
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close">&times;</button>
        <button class="lightbox-prev" aria-label="Previous">&lsaquo;</button>
        <img class="lightbox-img" src="" alt="Gallery Image" />
        <button class="lightbox-next" aria-label="Next">&rsaquo;</button>
        <span class="lightbox-counter"></span>
      </div>
    `;
    document.body.appendChild(lightbox);

    const lbOverlay = lightbox.querySelector('.lightbox-overlay');
    const lbImg     = lightbox.querySelector('.lightbox-img');
    const lbClose   = lightbox.querySelector('.lightbox-close');
    const lbPrev    = lightbox.querySelector('.lightbox-prev');
    const lbNext    = lightbox.querySelector('.lightbox-next');
    const lbCounter = lightbox.querySelector('.lightbox-counter');
    let lbIndex = 0;

    // Collect full-size image URLs
    const lbSources = Array.from(galleryItems).map((item) => {
      if (item.tagName === 'IMG') {
        return item.dataset.full || item.src;
      }
      return item.getAttribute('href') || item.dataset.lightbox || '';
    });

    const openLightbox = (index) => {
      lbIndex = index;
      lbImg.src = lbSources[lbIndex];
      lbCounter.textContent = `${lbIndex + 1} / ${lbSources.length}`;
      lightbox.classList.add('active');
      body.classList.add('lightbox-open');
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      body.classList.remove('lightbox-open');
      lbImg.src = '';
    };

    const showNext = () => {
      lbIndex = (lbIndex + 1) % lbSources.length;
      lbImg.src = lbSources[lbIndex];
      lbCounter.textContent = `${lbIndex + 1} / ${lbSources.length}`;
    };

    const showPrev = () => {
      lbIndex = (lbIndex - 1 + lbSources.length) % lbSources.length;
      lbImg.src = lbSources[lbIndex];
      lbCounter.textContent = `${lbIndex + 1} / ${lbSources.length}`;
    };

    galleryItems.forEach((item, i) => {
      item.style.cursor = 'pointer';
      item.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(i);
      });
    });

    lbClose.addEventListener('click', closeLightbox);
    lbOverlay.addEventListener('click', closeLightbox);
    lbNext.addEventListener('click', showNext);
    lbPrev.addEventListener('click', showPrev);

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    });
  }


  // ============================================================
  // 13. COUNTER ANIMATION (count up when scrolled into view)
  // ============================================================

  const counters = document.querySelectorAll('.counter, [data-target], [data-count]');

  if (counters.length > 0) {
    const animateCounter = (el) => {
      const target   = parseInt(el.dataset.target || el.dataset.count || el.textContent, 10);
      const duration = 2000; // ms
      const start    = performance.now();
      const suffix   = el.dataset.suffix || '';
      const prefix   = el.dataset.prefix || '';

      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out quad
        const eased = 1 - (1 - progress) * (1 - progress);
        const current = Math.floor(eased * target);

        el.textContent = `${prefix}${current.toLocaleString()}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
        }
      };

      requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => counterObserver.observe(el));
  }


  // ============================================================
  // 14. ACTIVE NAVIGATION LINK HIGHLIGHTING
  // ============================================================

  const navLinks = document.querySelectorAll('.nav-menu__link');

  if (navLinks.length > 0) {
    const currentPath = window.location.pathname.replace(/\/$/, '') || '/';

    navLinks.forEach((link) => {
      const linkPath = link.getAttribute('href')?.replace(/\/$/, '') || '/';

      // Exact match or matching filename
      if (
        linkPath === currentPath ||
        currentPath.endsWith(linkPath) ||
        (linkPath !== '/' && currentPath.includes(linkPath))
      ) {
        link.classList.add('nav-menu__link--active');
        // Also mark parent li if nested
        link.closest('li')?.classList.add('active');
      }
    });
  }


  // ============================================================
  // 15. MOBILE FLOATING CTA BUTTON
  // ============================================================

  const floatingCta = document.querySelector('.floating-cta');

  if (floatingCta) {
    let lastScrollY = 0;

    const handleFloatingCta = () => {
      const currentScrollY = window.scrollY;

      // Hide when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 300) {
        floatingCta.classList.add('hidden');
      } else {
        floatingCta.classList.remove('hidden');
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleFloatingCta, { passive: true });
  }


  // ============================================================
  // 16. GALLERY FILTER BUTTONS (data-category)
  // ============================================================

  const filterContainer = document.querySelector('.gallery-filters');
  const galleryGrid     = document.querySelector('.gallery-grid');

  if (filterContainer && galleryGrid) {
    const filterBtns   = filterContainer.querySelectorAll('[data-category]');
    const galleryCards = galleryGrid.querySelectorAll('.gallery-card, .gallery-item');

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.category;

        // Update active button
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter gallery items
        galleryCards.forEach((card) => {
          const cardCategory = card.dataset.category;

          if (category === 'all' || cardCategory === category) {
            card.classList.remove('hidden');
            // Trigger reflow then add visible class for transition
            requestAnimationFrame(() => card.classList.add('show'));
          } else {
            card.classList.remove('show');
            card.classList.add('hidden');
          }
        });
      });
    });
  }


  // ============================================================
  // 17. DROPDOWN MENU HOVER (Desktop) & CLICK (Mobile)
  // ============================================================

  const dropdownParents = document.querySelectorAll('.nav-menu__item--dropdown');

  dropdownParents.forEach((parent) => {
    const dropdown = parent.querySelector('.nav-dropdown');
    if (!dropdown) return;

    let hoverTimeout;

    // Desktop hover behavior
    parent.addEventListener('mouseenter', () => {
      if (window.innerWidth < 992) return;
      clearTimeout(hoverTimeout);
      closeAllDropdowns();
      dropdown.classList.add('open');
      parent.classList.add('dropdown-active');
    });

    parent.addEventListener('mouseleave', () => {
      if (window.innerWidth < 992) return;
      hoverTimeout = setTimeout(() => {
        dropdown.classList.remove('open');
        parent.classList.remove('dropdown-active');
      }, 150);
    });

    // Mobile click/tap behavior
    const toggle = parent.querySelector('.nav-menu__link--dropdown');
    toggle?.addEventListener('click', (e) => {
      if (window.innerWidth >= 992) return;
      e.preventDefault();
      const isOpen = dropdown.classList.contains('open');
      closeAllDropdowns();
      if (!isOpen) {
        dropdown.classList.add('open');
        parent.classList.add('dropdown-active');
      }
    });
  });

  const closeAllDropdowns = () => {
    dropdownParents.forEach((p) => {
      p.querySelector('.nav-dropdown')?.classList.remove('open');
      p.classList.remove('dropdown-active');
    });
  };


  // ============================================================
  // UTILITY: Debounce helper
  // ============================================================

  const debounce = (fn, delay = 100) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  };


  // ============================================================
  // WINDOW RESIZE HANDLER
  // ============================================================

  window.addEventListener(
    'resize',
    debounce(() => {
      // Close mobile nav if viewport grows past breakpoint
      if (window.innerWidth >= 992) {
        closeNav();
        closeAllDropdowns();
      }
    }, 200)
  );


  // ============================================================
  // PERFORMANCE: Combine scroll listeners via single rAF loop
  // ============================================================

  let ticking = false;

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleStickyHeader();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });

}); // end DOMContentLoaded
