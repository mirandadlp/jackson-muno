/* =================================================================
   JACKSON MUNO — ARCHITECTURAL PORTFOLIO
   Vanilla JS. No dependencies.
   -----------------------------------------------------------------
   Modules
     1. Intro sequence (typewriter + signature + hero lift)
     2. Scroll reveals (IntersectionObserver)
     3. Horizontal project gallery (drag + wheel + entrance stagger)
     4. Parallax on oversized project numbers
     5. Custom pencil cursor + fading sketch trail
   ================================================================= */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ============================================================= */
  /* 1. INTRO SEQUENCE                                             */
  /* ============================================================= */
  const hero      = document.getElementById('hero');
  const titleEl   = document.querySelector('.hero__title-text');
  const caretEl   = document.querySelector('.hero__caret');
  const subtitle  = document.querySelector('.hero__subtitle');
  const signature = document.querySelector('.signature');
  const scrollHint= document.querySelector('.hero__scroll-hint');
  const nav       = document.getElementById('nav');

  /* EDIT: the headline that types out on load */
  const TITLE = 'Jackson Muno';

  function revealPage() {
    document.body.classList.remove('intro-lock');
    nav.classList.add('is-in');
    if (scrollHint) scrollHint.classList.add('is-in');
  }

  function liftHeroOnScroll() {
    // Once the user scrolls (or after auto-timeout) the hero slides up.
    let lifted = false;
    const lift = () => {
      if (lifted) return;
      lifted = true;
      hero.classList.add('is-lifted');
      window.removeEventListener('wheel', onIntent);
      window.removeEventListener('touchstart', onIntent);
      window.removeEventListener('keydown', onIntent);
    };
    const onIntent = (e) => {
      if (e.type === 'keydown' && !['ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) return;
      lift();
    };
    window.addEventListener('wheel', onIntent, { passive: true });
    window.addEventListener('touchstart', onIntent, { passive: true });
    window.addEventListener('keydown', onIntent);
    // Also lift if the scroll hint is clicked
    if (scrollHint) scrollHint.addEventListener('click', lift);
    return lift;
  }

  function runIntro() {
    if (prefersReduced) {
      // Skip straight to the finished state.
      titleEl.textContent = TITLE;
      if (caretEl) caretEl.classList.add('is-done');
      subtitle.classList.add('is-in');
      hero.classList.add('is-framed');
      revealPage();
      const lift = liftHeroOnScroll();
      // leave hero in place; user scrolls to lift
      return;
    }

    document.body.classList.add('intro-lock');
    hero.classList.add('is-framed');

    let i = 0;
    const typeSpeed = 95; // ms per character

    function type() {
      if (i <= TITLE.length) {
        titleEl.textContent = TITLE.slice(0, i);
        i++;
        // slight natural variance in keystroke timing
        setTimeout(type, typeSpeed + (Math.random() * 60 - 20));
      } else {
        // Typewriter done → stop caret, reveal subtitle, then sign.
        if (caretEl) caretEl.classList.add('is-done');
        subtitle.classList.add('is-in');

        setTimeout(() => signature.classList.add('is-signing'), 500);

        // After the signature finishes, reveal the rest of the page and
        // arm the hero-lift interaction.
        setTimeout(() => {
          revealPage();
          const lift = liftHeroOnScroll();
          // Auto-lift after a gentle pause if the user does nothing.
          setTimeout(lift, 4200);
        }, 500 + 2600);
      }
    }
    // Small delay so the eyebrow/frame settle first.
    setTimeout(type, 650);
  }

  /* ============================================================= */
  /* 2. SCROLL REVEALS                                            */
  /* ============================================================= */
  function initReveals() {
    const items = document.querySelectorAll('.reveal, .reveal-img, .reveal-line, .divider');
    if (!('IntersectionObserver' in window) || prefersReduced) {
      items.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

    items.forEach((el) => io.observe(el));
  }

  /* ============================================================= */
  /* 3. HORIZONTAL PROJECT GALLERY                                */
  /* ============================================================= */
  function initGallery() {
    const gallery = document.getElementById('gallery');
    const track   = document.getElementById('gallery-track');
    if (!gallery || !track) return;

    const cards = track.querySelectorAll('.card');
    cards.forEach((card, idx) => card.style.setProperty('--i', idx));

    // Staggered entrance when the gallery scrolls into view.
    if ('IntersectionObserver' in window && !prefersReduced) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            cards.forEach((c) => c.classList.add('is-in'));
            io.disconnect();
          }
        });
      }, { threshold: 0.15 });
      io.observe(gallery);
    } else {
      cards.forEach((c) => c.classList.add('is-in'));
    }

    // Translate vertical wheel into horizontal scroll while hovering.
    gallery.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const atStart = gallery.scrollLeft <= 0;
        const atEnd = gallery.scrollLeft + gallery.clientWidth >= track.scrollWidth - 1;
        // Only hijack when there is somewhere to go horizontally.
        if (!(atStart && e.deltaY < 0) && !(atEnd && e.deltaY > 0)) {
          e.preventDefault();
          gallery.scrollLeft += e.deltaY;
        }
      }
    }, { passive: false });

    // Click-and-drag to pan.
    let isDown = false, startX = 0, startScroll = 0, moved = 0;
    gallery.addEventListener('pointerdown', (e) => {
      isDown = true; moved = 0;
      startX = e.clientX;
      startScroll = gallery.scrollLeft;
      gallery.classList.add('is-dragging');
    });
    window.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      moved += Math.abs(e.movementX);
      gallery.scrollLeft = startScroll - dx;
    });
    window.addEventListener('pointerup', () => {
      isDown = false;
      gallery.classList.remove('is-dragging');
    });
    // Prevent the card link firing after a drag.
    track.addEventListener('click', (e) => {
      if (moved > 8) { e.preventDefault(); }
    });
  }

  /* ============================================================= */
  /* 4. PARALLAX — oversized project numbers                      */
  /* ============================================================= */
  function initParallax() {
    if (prefersReduced) return;
    const nums = document.querySelectorAll('.project__bignum');
    if (!nums.length) return;

    let ticking = false;
    function update() {
      const vh = window.innerHeight;
      nums.forEach((num) => {
        const rect = num.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) return;
        // -ve → element above centre; map to a gentle vertical drift.
        const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
        num.style.transform = `translateY(${(progress * 40).toFixed(1)}px)`;
      });
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ============================================================= */
  /* 5. CUSTOM PENCIL CURSOR + SKETCH TRAIL                       */
  /* ============================================================= */
  function initCursor() {
    if (!isFinePointer || prefersReduced) return;

    const cursor = document.querySelector('.cursor');
    const canvas = document.querySelector('.cursor-trail');
    if (!cursor || !canvas) return;

    const ctx = canvas.getContext('2d');
    let w, h, dpr;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', resize);

    // Smooth (lerped) cursor position.
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let curX = mouseX, curY = mouseY;
    let lastX = mouseX, lastY = mouseY;
    let visible = false;

    const trail = []; // faint pencil-stroke segments

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      if (!visible) { visible = true; cursor.classList.remove('is-hidden'); }
    });
    document.addEventListener('mouseleave', () => {
      cursor.classList.add('is-hidden'); visible = false;
    });

    // Grow the cursor over interactive elements.
    document.querySelectorAll('a, .card, button, [data-num]').forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });

    function render() {
      // Ease the cursor toward the true pointer.
      curX += (mouseX - curX) * 0.18;
      curY += (mouseY - curY) * 0.18;
      cursor.style.transform = `translate(${curX - 2}px, ${curY - 22}px)`;

      // Emit a trail segment when the pointer actually moves.
      const dist = Math.hypot(curX - lastX, curY - lastY);
      if (dist > 1.2) {
        trail.push({ x1: lastX, y1: lastY, x2: curX, y2: curY, life: 1 });
        lastX = curX; lastY = curY;
      }

      // Draw + fade the trail (clear fully each frame; opacity via life).
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.lineCap = 'round';
      for (let i = trail.length - 1; i >= 0; i--) {
        const s = trail[i];
        s.life -= 0.022;
        if (s.life <= 0) { trail.splice(i, 1); continue; }
        ctx.strokeStyle = `rgba(17,17,17,${(s.life * 0.28).toFixed(3)})`;
        ctx.lineWidth = 1.1;
        // a touch of jitter gives a hand-drawn graphite feel
        const j = () => (Math.random() - 0.5) * 1.1;
        ctx.beginPath();
        ctx.moveTo(s.x1 + j(), s.y1 + j());
        ctx.lineTo(s.x2 + j(), s.y2 + j());
        ctx.stroke();
      }
      requestAnimationFrame(render);
    }
    render();
  }

  /* ============================================================= */
  /* 6. IMAGE FALLBACKS                                           */
  /* Until real files exist in /assets, render an elegant, on-brand */
  /* placeholder instead of a broken-image icon. Once you add the   */
  /* real images this code simply does nothing.                     */
  /* ============================================================= */
  function initImageFallbacks() {
    document.querySelectorAll('img').forEach((img) => {
      const swap = () => {
        if (img.dataset.fallback) return;
        img.dataset.fallback = '1';
        const figure = img.closest('.card__media, .project__img');
        const card   = img.closest('.card');
        const num    = card ? card.getAttribute('data-num') : '';
        const label  = img.getAttribute('alt') || '';
        const ph = document.createElement('div');
        ph.className = 'img-placeholder';
        ph.innerHTML =
          (num ? `<span class="img-placeholder__num">${num}</span>` : '') +
          `<span class="img-placeholder__label">${label}</span>` +
          `<span class="img-placeholder__note">add /assets/${(img.getAttribute('src') || '').split('/').pop()}</span>`;
        if (figure) {
          img.style.display = 'none';
          figure.appendChild(ph);
        }
      };
      if (img.complete && img.naturalWidth === 0) swap();
      img.addEventListener('error', swap);
    });
  }

  /* ============================================================= */
  /* BOOT                                                         */
  /* ============================================================= */
  function init() {
    runIntro();
    initReveals();
    initGallery();
    initParallax();
    initCursor();
    initImageFallbacks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
