/* =====================================================
   AMBIKA FABRICATION — MAIN JAVASCRIPT
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Navbar Scroll Effect ─── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  /* ─── Active Nav Link ─── */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  /* ─── Mobile Hamburger Menu ─── */
  const hamburger  = document.querySelector('.hamburger');
  const mobileNav  = document.querySelector('.mobile-nav');
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
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ─── Hero Slider ─── */
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots   = document.querySelectorAll('.hero-dot');
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
    autoPlay();
  }

  /* ─── Stat Counter Animation ─── */
  const counters = document.querySelectorAll('.counter');
  const easeOut  = (t) => 1 - Math.pow(1 - t, 3);
  const animateCounter = (el) => {
    const target   = +el.dataset.target;
    const duration = 2000;
    let start;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed  = Math.min(timestamp - start, duration);
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

  /* ─── Testimonial Carousel ─── */
  const track  = document.querySelector('.testimonial-track');
  const tCards = document.querySelectorAll('.testimonial-card');
  const tDots  = document.querySelectorAll('.t-dot');
  if (track && tCards.length) {
    let tCurrent   = 0;
    let perView    = window.innerWidth < 768 ? 1 : 2;
    let tMax       = Math.ceil(tCards.length / perView) - 1;

    const goTo = (n) => {
      tCurrent = Math.max(0, Math.min(n, tMax));
      const cardW  = tCards[0].offsetWidth + 28; // width + gap
      track.style.transform = `translateX(-${tCurrent * cardW * perView}px)`;
      tDots.forEach((d, i) => d.classList.toggle('active', i === tCurrent));
    };

    document.querySelector('.t-prev')?.addEventListener('click', () => goTo(tCurrent - 1));
    document.querySelector('.t-next')?.addEventListener('click', () => goTo(tCurrent + 1));
    tDots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    // Auto carousel
    let tTimer = setInterval(() => goTo((tCurrent + 1) > tMax ? 0 : tCurrent + 1), 6000);
    track.addEventListener('mouseenter', () => clearInterval(tTimer));
    track.addEventListener('mouseleave', () => {
      tTimer = setInterval(() => goTo((tCurrent + 1) > tMax ? 0 : tCurrent + 1), 6000);
    });

    // Recalculate on resize
    window.addEventListener('resize', () => {
      perView  = window.innerWidth < 768 ? 1 : 2;
      tMax     = Math.ceil(tCards.length / perView) - 1;
      goTo(0);
    });

    goTo(0);
  }

  /* ─── Gallery Filters ─── */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        galleryItems.forEach(item => {
          const match = filter === 'all' || item.dataset.category === filter;
          item.classList.toggle('hidden', !match);
        });
      });
    });
  }

  /* ─── Lightbox ─── */
  const lightbox    = document.querySelector('.lightbox');
  const lbImg       = document.querySelector('.lightbox-img');
  const lbCaption   = document.querySelector('.lightbox-caption');
  const lbClose     = document.querySelector('.lightbox-close');
  const lbPrev      = document.querySelector('.lightbox-prev');
  const lbNext      = document.querySelector('.lightbox-next');

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
        const vIndex  = visible.indexOf(item);
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
      if (e.key === 'ArrowLeft')  openLightbox(lbIndex - 1);
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
  const contactForm    = document.getElementById('contact-form');
  const formSuccess    = document.querySelector('.form-success');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.form-submit');
      btn.textContent = 'Sending…';
      btn.disabled    = true;
      // Simulate async submission
      setTimeout(() => {
        contactForm.reset();
        btn.textContent = 'Send Message';
        btn.disabled    = false;
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
