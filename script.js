/* ==================================================
   TELURFRESH - LANDING PAGE SCRIPT
================================================== */

(function () {
  'use strict';

  /* ==================================================
     1. MOBILE MENU TOGGLE
  ================================================== */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      navLinks.classList.toggle('active');
      // Ganti ikon ☰ <-> ✕
      menuToggle.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
    });

    // Tutup menu saat link diklik
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('active');
        menuToggle.textContent = '☰';
      });
    });

    // Tutup menu saat klik di luar
    document.addEventListener('click', function (e) {
      if (
        navLinks.classList.contains('active') &&
        !navLinks.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        navLinks.classList.remove('active');
        menuToggle.textContent = '☰';
      }
    });
  }

  /* ==================================================
     2. NAVBAR SCROLL EFFECT
  ================================================== */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Jalankan sekali saat load

  /* ==================================================
     3. REVEAL ANIMATION ON SCROLL
  ================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target); // Animasi hanya sekali
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: tampilkan semua jika browser tidak support
    revealElements.forEach(function (el) {
      el.classList.add('active');
    });
  }

  /* ==================================================
     4. COUNTER ANIMATION (Hero Stats)
  ================================================== */
  const counters = document.querySelectorAll('[data-count]');

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000; // ms
    const startTime = performance.now();
    const isDecimal = target % 1 !== 0;

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing (easeOutCubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = target * eased;

      if (isDecimal) {
        el.textContent = currentValue.toFixed(1) + suffix;
      } else {
        el.textContent = Math.floor(currentValue).toLocaleString('id-ID') + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = (isDecimal ? target.toFixed(1) : target.toLocaleString('id-ID')) + suffix;
      }
    }

    requestAnimationFrame(updateCounter);
  }

  if (counters.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  }

  /* ==================================================
     5. SMOOTH SCROLL (Fallback untuk browser lama)
  ================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ==================================================
     6. UPDATE TAHUN DI FOOTER
  ================================================== */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ==================================================
     7. PARALLAX LIGHT UNTUK HERO EGG
  ================================================== */
  const eggContainer = document.querySelector('.egg-container');
  const heroSection = document.querySelector('.hero');

  if (eggContainer && heroSection && window.matchMedia('(pointer: fine)').matches) {
    heroSection.addEventListener('mousemove', function (e) {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const egg = eggContainer.querySelector('.egg');
      const fb1 = eggContainer.querySelector('.fb-1');
      const fb2 = eggContainer.querySelector('.fb-2');

      if (egg) {
        egg.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
      }
      if (fb1) {
        fb1.style.transform = `translate(${x * 35}px, ${y * 35}px)`;
      }
      if (fb2) {
        fb2.style.transform = `translate(${x * 35}px, ${y * 35}px)`;
      }
    });

    heroSection.addEventListener('mouseleave', function () {
      const egg = eggContainer.querySelector('.egg');
      const fb1 = eggContainer.querySelector('.fb-1');
      const fb2 = eggContainer.querySelector('.fb-2');

      if (egg) egg.style.transform = '';
      if (fb1) fb1.style.transform = '';
      if (fb2) fb2.style.transform = '';
    });
  }

  /* ==================================================
     8. LAZY LOADING IMAGES (jika nanti pakai gambar asli)
  ================================================== */
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[data-src]').forEach(function (img) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  } else if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imgObserver.unobserve(img);
        }
      });
    });
    document.querySelectorAll('img[data-src]').forEach(function (img) {
      imgObserver.observe(img);
    });
  }

  /* ==================================================
     9. TRACKING KLIK WHATSAPP (opsional)
  ================================================== */
  document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').forEach(function (link) {
    link.addEventListener('click', function () {
      // Bisa dikembangkan untuk Google Analytics / Facebook Pixel
      console.log('✅ WhatsApp CTA diklik:', this.href);
      
      // Contoh: jika pakai Google Analytics
      // if (typeof gtag === 'function') {
      //   gtag('event', 'click', {
      //     event_category: 'WhatsApp',
      //     event_label: this.getAttribute('href')
      //   });
      // }
    });
  });

  /* ==================================================
     10. KONSOLE BRANDING
  ================================================== */
  console.log(
    '%c🥚 TelurFresh Landing Page %c Siap! ',
    'background:#FFB800;color:#1a1a1a;font-weight:bold;padding:4px 8px;border-radius:4px 0 0 4px;',
    'background:#1a1a1a;color:#FFB800;font-weight:bold;padding:4px 8px;border-radius:0 4px 4px 0;'
  );
})();