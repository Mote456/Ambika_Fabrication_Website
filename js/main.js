/* =====================================================
   AMBIKA FABRICATION — MAIN JAVASCRIPT
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Header & Navbar Scroll Effect ─── */
  const navbar = document.querySelector('.navbar');
  const siteHeader = document.querySelector('.site-header');
  if (navbar || siteHeader) {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 25;
      if (navbar) navbar.classList.toggle('scrolled', isScrolled);
      if (siteHeader) siteHeader.classList.toggle('scrolled', isScrolled);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ─── Active Nav Link ─── */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  /* ─── Mobile Topbar Auto Slider ─── */
  const topbarSlider = document.querySelector('.topbar-slider');
  if (topbarSlider) {
    const items = topbarSlider.querySelectorAll('.topbar-item');
    if (items.length > 1) {
      let currentIndex = 0;
      let sliderTimer = null;

      const setSlide = (nextIndex) => {
        if (window.innerWidth > 768) {
          items.forEach(el => el.classList.remove('active', 'prev-slide'));
          return;
        }

        const prevIndex = currentIndex;
        currentIndex = (nextIndex + items.length) % items.length;

        items.forEach((item, i) => {
          item.classList.remove('active', 'prev-slide');
          if (i === currentIndex) {
            item.classList.add('active');
          } else if (i === prevIndex) {
            item.classList.add('prev-slide');
          }
        });
      };

      const startAutoSlide = () => {
        if (sliderTimer) clearInterval(sliderTimer);
        if (window.innerWidth <= 768) {
          items.forEach((item, i) => {
            item.classList.remove('active', 'prev-slide');
            if (i === currentIndex) item.classList.add('active');
          });
          sliderTimer = setInterval(() => {
            if (window.innerWidth <= 768) {
              setSlide(currentIndex + 1);
            }
          }, 3200);
        } else {
          items.forEach(el => el.classList.remove('active', 'prev-slide'));
        }
      };

      startAutoSlide();
      window.addEventListener('resize', startAutoSlide, { passive: true });

      // Pause on hover
      topbarSlider.addEventListener('mouseenter', () => clearInterval(sliderTimer));
      topbarSlider.addEventListener('mouseleave', startAutoSlide);

      // Touch swipe & tap pause support
      let touchStartX = 0;
      topbarSlider.addEventListener('touchstart', (e) => {
        clearInterval(sliderTimer);
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      topbarSlider.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 30) {
          setSlide(currentIndex + 1);
        } else if (touchEndX - touchStartX > 30) {
          setSlide(currentIndex - 1);
        }
        startAutoSlide();
      }, { passive: true });
    }
  }

  /* ─── Mobile Hamburger Menu ─── */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });
    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
    // Mobile Submenu Dropdown Accordion Toggle
    mobileNav.querySelectorAll('.mobile-dropdown-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const parent = btn.closest('.mobile-nav-item-dropdown');
        if (parent) parent.classList.toggle('open');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    // Close mobile nav on resize past breakpoint (992px)
    window.addEventListener('resize', () => {
      if (window.innerWidth > 992 && mobileNav.classList.contains('open')) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ─── Hero Slider ─── */
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-dot');
  if (heroSlides.length) {
    let current = 0, timer;
    const go = (n) => {
      heroSlides[current].classList.remove('active');
      heroDots[current]?.classList.remove('active');
      current = (n + heroSlides.length) % heroSlides.length;
      heroSlides[current].classList.add('active');
      heroDots[current]?.classList.add('active');
    };
    const autoPlay = () => { timer = setInterval(() => go(current + 1), 5500); };
    const resetTimer = () => { clearInterval(timer); autoPlay(); };

    heroDots.forEach((dot, i) => dot.addEventListener('click', () => { go(i); resetTimer(); }));
    document.querySelector('.hero-next')?.addEventListener('click', () => { go(current + 1); resetTimer(); });
    document.querySelector('.hero-prev')?.addEventListener('click', () => { go(current - 1); resetTimer(); });

    // Touch swipe support for mobile/tablets
    const heroEl = document.querySelector('.hero');
    if (heroEl) {
      let touchStartX = 0;
      let touchEndX = 0;
      heroEl.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      heroEl.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) {
            go(current + 1); // Swipe left -> Next slide
          } else {
            go(current - 1); // Swipe right -> Prev slide
          }
          resetTimer();
        }
      }, { passive: true });
    }

    autoPlay();
  }

  /* ─── Stat Counter Animation ─── */
  const counters = document.querySelectorAll('.counter');
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const animateCounter = (el) => {
    const target = +el.dataset.target;
    const duration = 2000;
    let start;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = Math.min(timestamp - start, duration);
      const progress = easeOut(elapsed / duration);
      el.textContent = Math.floor(progress * target).toLocaleString();
      if (elapsed < duration) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    };
    requestAnimationFrame(step);
  };

  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => counterObserver.observe(c));
  }

  /* ─── Testimonial Carousel Auto Slider ─── */
  const track = document.querySelector('.testimonial-track');
  const tCards = document.querySelectorAll('.testimonial-card');
  const tDots = document.querySelectorAll('.t-dot');
  if (track && tCards.length) {
    let tCurrent = 0;
    let tTimer = null;
    const tMax = tCards.length - 1;

    const goTo = (n) => {
      tCurrent = (n + tCards.length) % tCards.length;
      const cardW = tCards[0].offsetWidth;
      track.style.transform = `translateX(-${tCurrent * cardW}px)`;
      tDots.forEach((d, i) => d.classList.toggle('active', i === tCurrent));
    };

    const startAuto = () => {
      stopAuto();
      tTimer = setInterval(() => {
        goTo(tCurrent + 1);
      }, 4000);
    };

    const stopAuto = () => {
      if (tTimer) {
        clearInterval(tTimer);
        tTimer = null;
      }
    };

    const resetAuto = () => {
      stopAuto();
      startAuto();
    };

    document.querySelector('.t-prev')?.addEventListener('click', () => {
      goTo(tCurrent - 1);
      resetAuto();
    });

    document.querySelector('.t-next')?.addEventListener('click', () => {
      goTo(tCurrent + 1);
      resetAuto();
    });

    tDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goTo(i);
        resetAuto();
      });
    });

    const carouselEl = document.querySelector('.testimonial-carousel');
    if (carouselEl) {
      carouselEl.addEventListener('mouseenter', stopAuto);
      carouselEl.addEventListener('mouseleave', startAuto);

      // Touch swipe support for mobile
      let tTouchStartX = 0;
      let tTouchEndX = 0;
      carouselEl.addEventListener('touchstart', (e) => {
        tTouchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      carouselEl.addEventListener('touchend', (e) => {
        tTouchEndX = e.changedTouches[0].screenX;
        const diff = tTouchStartX - tTouchEndX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) {
            goTo(tCurrent + 1); // Swipe left -> Next card
          } else {
            goTo(tCurrent - 1); // Swipe right -> Prev card
          }
          resetAuto();
        }
      }, { passive: true });
    }

    let resizeDebounce;
    window.addEventListener('resize', () => {
      clearTimeout(resizeDebounce);
      resizeDebounce = setTimeout(() => {
        goTo(tCurrent);
      }, 100);
    });

    goTo(0);
    startAuto();
  }

  /* ─── Gallery Filters (Buttons + Custom Responsive Dropdown) ─── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const dropdownWrap = document.getElementById('gallery-dropdown-wrap');
  const dropdownToggle = document.getElementById('gallery-dropdown-toggle');
  const selectedText = document.getElementById('selected-category-text');
  const dropdownItems = document.querySelectorAll('.custom-dropdown-menu .dropdown-item');

  if (galleryItems.length) {
    const applyFilter = (filterCategory, textLabel) => {
      // 1. Update gallery items
      galleryItems.forEach(item => {
        const match = filterCategory === 'all' || item.dataset.category === filterCategory;
        item.classList.toggle('hidden', !match);
      });

      // 2. Synchronize pill button active states
      if (filterBtns.length) {
        filterBtns.forEach(b => {
          const isActive = b.dataset.filter === filterCategory;
          b.classList.toggle('active', isActive);
          if (isActive && window.innerWidth <= 992) {
            b.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          }
        });
      }

      // 3. Synchronize custom dropdown items and selected label
      if (dropdownItems.length) {
        dropdownItems.forEach(item => {
          const isItemActive = item.dataset.value === filterCategory;
          item.classList.toggle('active', isItemActive);
          item.setAttribute('aria-selected', isItemActive ? 'true' : 'false');
          if (isItemActive && selectedText) {
            selectedText.textContent = item.querySelector('.item-text')?.textContent || textLabel || 'Filter';
          }
        });
      }

      // 4. Close dropdown if open
      if (dropdownWrap) {
        dropdownWrap.classList.remove('open');
        dropdownToggle?.setAttribute('aria-expanded', 'false');
      }
    };

    // Toggle dropdown open/close
    if (dropdownToggle && dropdownWrap) {
      dropdownToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdownWrap.classList.toggle('open');
        dropdownToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      // Close dropdown on outside click
      document.addEventListener('click', (e) => {
        if (!dropdownWrap.contains(e.target)) {
          dropdownWrap.classList.remove('open');
          dropdownToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Dropdown items click listeners
    dropdownItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        applyFilter(item.dataset.value, item.querySelector('.item-text')?.textContent);
      });
    });

    // Pill button click listeners
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        applyFilter(btn.dataset.filter, btn.textContent);
      });
    });
  }

  /* ─── Lightbox ─── */
  const lightbox = document.querySelector('.lightbox');
  const lbImg = document.querySelector('.lightbox-img');
  const lbCaption = document.querySelector('.lightbox-caption');
  const lbClose = document.querySelector('.lightbox-close');
  const lbPrev = document.querySelector('.lightbox-prev');
  const lbNext = document.querySelector('.lightbox-next');

  if (lightbox && galleryItems.length) {
    let lbIndex = 0;
    const visibleItems = () => [...galleryItems].filter(i => !i.classList.contains('hidden'));

    const openLightbox = (index) => {
      const items = visibleItems();
      lbIndex = ((index % items.length) + items.length) % items.length;
      const item = items[lbIndex];
      lbImg.src = item.querySelector('img').src;
      lbImg.alt = item.querySelector('img').alt || '';
      lbCaption.textContent = item.querySelector('.gallery-overlay span')?.textContent || '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };

    galleryItems.forEach((item, i) => {
      item.addEventListener('click', () => {
        const visible = visibleItems();
        const vIndex = visible.indexOf(item);
        openLightbox(vIndex);
      });
    });

    lbClose?.addEventListener('click', closeLightbox);
    lbPrev?.addEventListener('click', () => openLightbox(lbIndex - 1));
    lbNext?.addEventListener('click', () => openLightbox(lbIndex + 1));

    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') openLightbox(lbIndex - 1);
      if (e.key === 'ArrowRight') openLightbox(lbIndex + 1);
    });
  }

  /* ─── Fade-up Scroll Animations ─── */
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    fadeEls.forEach(el => fadeObserver.observe(el));
  }


  /* ─── Back to Top ─── */
  const btt = document.querySelector('.back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 400);
    });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ─── Contact Form ─── */
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.querySelector('.form-success');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.form-submit');
      btn.textContent = 'Sending…';
      btn.disabled = true;
      // Simulate async submission
      setTimeout(() => {
        contactForm.reset();
        btn.textContent = 'Send Message';
        btn.disabled = false;
        if (formSuccess) {
          formSuccess.classList.add('show');
          setTimeout(() => formSuccess.classList.remove('show'), 5000);
        }
        window.scrollTo({ top: contactForm.offsetTop - 100, behavior: 'smooth' });
      }, 1600);
    });
  }

  /* ─── Topbar Visibility on Small Screens ─── */
  // Topbar email and phone number are always visible across all device screen sizes.

});
