// Ensure ScrollTrigger is registered
gsap.registerPlugin(ScrollTrigger);

// Global Variables
let lenis;
const cursor = document.getElementById('custom-cursor');
const follower = document.getElementById('custom-cursor-follower');
let mouseX = 0;
let mouseY = 0;

// 1. Initialize Smooth Scrolling (Lenis)
function initSmoothScroll() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  });

  // Sync ScrollTrigger with Lenis
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

// 2. Hero Entrance Animation & Asymmetric Stagger Reveal
function initHeroAnimation() {
  const heroLines = document.querySelectorAll(".hero-line");
  if (heroLines.length > 0) {
    gsap.from(heroLines, {
      opacity: 0,
      x: -30,
      duration: 1.1,
      stagger: 0.14,
      ease: "power3.out",
      delay: 0.15
    });
    gsap.from(".hero-label, .hero-manifesto, .hero-cta", {
      opacity: 0,
      y: 25,
      duration: 1,
      delay: 0.8,
      stagger: 0.2,
      ease: "power2.out"
    });
  } else {
    gsap.from(".hero-container > *", {
      opacity: 0,
      y: 40,
      stagger: 0.2,
      duration: 1.2,
      ease: "power4.out"
    });
  }
}

// 2b. Hero Dynamic Verb Typewriter Morphing (Verbal Branding)
function initHeroTypewriter() {
  const dynamicVerbEl = document.getElementById('hero-dynamic-verb');
  if (!dynamicVerbEl) return;

  const verbs = ["descubrir", "definir", "expresar", "activar", "revelar"];
  let currentIndex = 0;

  setInterval(() => {
    currentIndex = (currentIndex + 1) % verbs.length;
    const nextVerb = verbs[currentIndex];

    // Morph transition with GSAP
    gsap.to(dynamicVerbEl, {
      opacity: 0,
      y: -10,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => {
        dynamicVerbEl.textContent = nextVerb;
        gsap.fromTo(dynamicVerbEl, 
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
        );
      }
    });
  }, 2800);
}

// 3. Custom Cursor Follower with Glassmorphism Lens Interaction
function initCustomCursor() {
  if (window.innerWidth <= 768) return; // Disable on mobile

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Inner dot immediately snaps
    gsap.set(cursor, { x: mouseX, y: mouseY });
  });

  // Smooth laggy follower using quickTo
  const xTo = gsap.quickTo(follower, "x", { duration: 0.4, ease: "power3.out" });
  const yTo = gsap.quickTo(follower, "y", { duration: 0.4, ease: "power3.out" });

  gsap.ticker.add(() => {
    xTo(mouseX);
    yTo(mouseY);
  });

  // Detect hover on links and interactive items
  const hoverTargets = 'a, button, input, select, textarea, .service-card, .service-mock-card, .grid-logo-item, .ticker-item';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  // Micro-technology Lens Interaction for Key Words
  const lensTargets = '.cursor-interactive-word, .mock-group-title, .revela-step-name, .pillar-title, .quote-text-white';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(lensTargets)) {
      document.body.classList.add('cursor-lens-active');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(lensTargets)) {
      document.body.classList.remove('cursor-lens-active');
    }
  });
}

// 4. Load Portfolio Assets Programmatically
function loadPortfolioLogos() {
  // A. Hospitality logos (17 items)
  const marquee = document.getElementById('hospitality-marquee');
  const hospitalityLogoCount = 17;

  // Render twice for infinite scrolling marquee
  for (let cycle = 0; cycle < 2; cycle++) {
    for (let i = 1; i <= hospitalityLogoCount; i++) {
      const item = document.createElement('div');
      item.className = 'ticker-item';
      const img = document.createElement('img');
      img.src = `assets/logos/hospitality/page_16_img_1_logo_${i}.png`;
      img.alt = `Hotel Logo ${i}`;
      img.loading = 'lazy';
      item.appendChild(img);
      marquee.appendChild(item);
    }
  }

  // Infinite Scroll GSAP Animation
  const totalMarqueeWidth = marquee.scrollWidth / 2;
  gsap.to(marquee, {
    x: -totalMarqueeWidth,
    duration: 30,
    ease: "none",
    repeat: -1,
  });

  // B. Success Cases Brands Grid
  const grid = document.getElementById('brands-grid');
  
  // page 13 has 19 logos
  for (let i = 1; i <= 19; i++) {
    createGridItem(grid, `assets/logos/brands/page_13_img_1_logo_${i}.png`);
  }
  // page 14 has 11 logos (skip logo_7 which is corrupt empty file)
  for (let i = 1; i <= 11; i++) {
    if (i === 7) continue;
    createGridItem(grid, `assets/logos/brands/page_14_img_1_logo_${i}.png`);
  }
}

function createGridItem(parent, src) {
  const item = document.createElement('div');
  item.className = 'grid-logo-item';
  const img = document.createElement('img');
  img.src = src;
  img.alt = 'Logo Cliente';
  img.loading = 'lazy';
  img.onerror = () => { item.style.display = 'none'; };
  item.appendChild(img);
  parent.appendChild(item);
}

// 5. Scroll-Driven Animations & Section Fades
function initScrollAnimations() {
  // Header scrolled class
  ScrollTrigger.create({
    start: "top -50px",
    onEnter: () => document.getElementById('main-header').classList.add('scrolled'),
    onLeaveBack: () => document.getElementById('main-header').classList.remove('scrolled'),
  });

  // Element reveal on scroll
  const revealElements = document.querySelectorAll('.scroll-reveal');
  revealElements.forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });
  });


  // ── DOS LENGUAJES: Split-Panel, Accordion & Scramble ──────────────
  const dlSection = document.getElementById('servicios');
  if (dlSection) {

    // 1. Intro bar reveal on scroll
    const dlIntroBar = dlSection.querySelector('.dl-intro-bar');
    if (dlIntroBar) {
      ScrollTrigger.create({
        trigger: dlSection,
        start: "top 80%",
        once: true,
        onEnter: () => dlIntroBar.classList.add('in-view')
      });
    }

    // 2. Panel inner stagger reveal
    gsap.from('.dl-panel-inner', {
      opacity: 0,
      y: 30,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: dlSection,
        start: 'top 65%',
        once: true
      }
    });

    // 3. Accordion hover & click interaction
    dlSection.querySelectorAll('.dl-acc-item').forEach(item => {
      const accordion = item.closest('.dl-service-accordion');
      
      const activate = () => {
        accordion.querySelectorAll('.dl-acc-item.open').forEach(o => o.classList.remove('open'));
        item.classList.add('open');
      };

      // Expand on hover
      item.addEventListener('mouseenter', activate);

      // Toggle on click
      const btn = item.querySelector('.dl-acc-trigger');
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          activate();
        });
      }
    });

    // 4. Subtle Parallax shift between Verbal & Visual panels on scroll
    if (window.innerWidth > 900) {
      gsap.to('.dl-panel--verbal', {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: dlSection,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2
        }
      });
      gsap.to('.dl-panel--visual', {
        y: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: dlSection,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2
        }
      });
    }

    // 4. Character Scramble on panel statements when section enters view
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ·—.';
    function scrambleEl(el) {
      const finalText = el.getAttribute('data-text') || el.textContent;
      // Store original HTML (with gold span) for restoration
      const originalHTML = el.innerHTML;
      let frame = 0;
      const totalFrames = 18;
      const interval = setInterval(() => {
        frame++;
        if (frame >= totalFrames) {
          el.innerHTML = originalHTML; // restore gold span
          clearInterval(interval);
          return;
        }
        const progress = frame / totalFrames;
        const resolved = Math.floor(progress * finalText.length);
        let output = '';
        for (let i = 0; i < finalText.length; i++) {
          if (finalText[i] === ' ') { output += ' '; }
          else if (i < resolved) { output += finalText[i]; }
          else { output += CHARS[Math.floor(Math.random() * CHARS.length)]; }
        }
        el.textContent = output;
      }, 45);
    }

    ScrollTrigger.create({
      trigger: dlSection,
      start: 'top 60%',
      once: true,
      onEnter: () => {
        dlSection.querySelectorAll('.scramble-target').forEach((el, i) => {
          setTimeout(() => scrambleEl(el), i * 300);
        });
      }
    });
  }


  // Dynamic theme background coloring on scroll transitions
  // 1. El Estudio (Cream)
  ScrollTrigger.create({
    trigger: "#estudio",
    start: "top 50%",
    end: "bottom 50%",
    onEnter: () => gsap.to("body", { backgroundColor: "#FEFAF2", color: "#030103", duration: 0.6 }),
    onLeaveBack: () => gsap.to("body", { backgroundColor: "#030103", color: "#ffffff", duration: 0.6 }),
  });

  // 2. Dos Lenguajes (Black)
  ScrollTrigger.create({
    trigger: "#servicios",
    start: "top 50%",
    end: "bottom 50%",
    onEnter: () => gsap.to("body", { backgroundColor: "#030103", color: "#ffffff", duration: 0.6 }),
    onLeaveBack: () => gsap.to("body", { backgroundColor: "#FEFAF2", color: "#030103", duration: 0.6 }),
  });

  // 3. Método REVELA™ (Teal)
  ScrollTrigger.create({
    trigger: "#metodo",
    start: "top 50%",
    end: "bottom 50%",
    onEnter: () => gsap.to("body", { backgroundColor: "#4197B4", color: "#ffffff", duration: 0.6 }),
    onLeaveBack: () => gsap.to("body", { backgroundColor: "#030103", color: "#ffffff", duration: 0.6 }),
  });

  // 4. Portafolio (Cream)
  ScrollTrigger.create({
    trigger: "#portafolio",
    start: "top 50%",
    end: "bottom 50%",
    onEnter: () => gsap.to("body", { backgroundColor: "#FEFAF2", color: "#030103", duration: 0.6 }),
    onLeaveBack: () => gsap.to("body", { backgroundColor: "#4197B4", color: "#ffffff", duration: 0.6 }),
  });

  // 5. Contacto (Black)
  ScrollTrigger.create({
    trigger: "#contacto",
    start: "top 50%",
    onEnter: () => gsap.to("body", { backgroundColor: "#030103", color: "#ffffff", duration: 0.6 }),
    onLeaveBack: () => gsap.to("body", { backgroundColor: "#FEFAF2", color: "#030103", duration: 0.6 }),
  });
}

// 6. Navigation Logic & Forms
function initNavAndForms() {
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link, .nav-btn');

  // Toggle burger menu
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mainNav.classList.toggle('active');
  });

  // Close nav on click link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mainNav.classList.remove('active');
    });
  });

  // Conversational Form logic
  const form = document.getElementById('conversational-form');
  const successMsg = document.getElementById('form-success-msg');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simple verification
    const name = document.getElementById('form-name').value;
    const company = document.getElementById('form-company').value;
    const email = document.getElementById('form-email').value;
    const interest = document.getElementById('form-interest').value;

    if (name && company && email && interest) {
      // Fade out form and reveal success message
      gsap.to(form, {
        opacity: 0,
        height: 0,
        pointerEvents: 'none',
        duration: 0.5,
        onComplete: () => {
          form.classList.add('hidden');
          successMsg.classList.remove('hidden');
          gsap.from(successMsg, { opacity: 0, scale: 0.95, duration: 0.5 });
        }
      });
    }
  });
}

// 7. Color Slide Curtain Reveals for Expertise & Brands
function initColorSlideReveals() {
  const targetElements = document.querySelectorAll('.grid-logo-item, .pillar-card, .service-mock-card');
  targetElements.forEach((el, index) => {
    el.classList.add('slide-reveal-wrapper');
    
    ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => {
        setTimeout(() => {
          el.classList.add('slide-reveal-active');
        }, (index % 5) * 120);
      }
    });
  });
}

// ═══════════════════════════════════════════════════════════
// EFECTO 1 — TAPIZ DE IDENTIDAD (Letter Grid Canvas)
// ═══════════════════════════════════════════════════════════
function initLetterGrid() {
  const canvas = document.getElementById('letter-grid-canvas');
  if (!canvas || window.innerWidth <= 768) return;
  const ctx = canvas.getContext('2d');

  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const CELL = 38;
  const BASE_COLOR  = 'rgba(0, 75, 110, 0.18)';   // Dark Blue, very low opacity
  const GLOW_COLOR  = 'rgba(65, 151, 180, 0.82)';  // Light Blue activated
  const FONT_SIZE   = 13;

  let cols, rows, cells = [];
  let cx = -999, cy = -999;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    cols  = Math.ceil(canvas.width  / CELL);
    rows  = Math.ceil(canvas.height / CELL);
    cells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        cells.push({
          x: c * CELL + CELL / 2,
          y: r * CELL + CELL / 2,
          char: ALPHABET[Math.floor(Math.random() * ALPHABET.length)],
          lit: 0,   // 0-1 glow intensity
          tick: Math.random() * 120 | 0  // staggered char rotation
        });
      }
    }
  }

  // Track cursor relative to canvas
  const heroSect = document.getElementById('hero');
  if (heroSect) {
    heroSect.addEventListener('mousemove', (e) => {
      const r = canvas.getBoundingClientRect();
      cx = e.clientX - r.left;
      cy = e.clientY - r.top;
    });
    heroSect.addEventListener('mouseleave', () => { cx = -999; cy = -999; });
  }

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${FONT_SIZE}px 'Outfit', monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    cells.forEach(cell => {
      // Rotate character every ~3 seconds per cell
      cell.tick++;
      if (cell.tick > 180 + Math.random() * 120) {
        cell.char = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
        cell.tick = 0;
      }

      // Distance from cursor
      const dx = cell.x - cx, dy = cell.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = 110;
      const target = dist < radius ? Math.pow(1 - dist / radius, 1.8) : 0;
      cell.lit += (target - cell.lit) * 0.12;  // smooth lerp

      if (cell.lit > 0.01) {
        // Draw glowing letter
        ctx.save();
        ctx.globalAlpha = 0.18 + cell.lit * 0.82;
        ctx.fillStyle = cell.lit > 0.15 ? GLOW_COLOR : BASE_COLOR;
        if (cell.lit > 0.3) {
          ctx.shadowBlur = 8 * cell.lit;
          ctx.shadowColor = GLOW_COLOR;
        }
        ctx.fillText(cell.char, cell.x, cell.y);
        ctx.restore();
      } else {
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = BASE_COLOR;
        ctx.fillText(cell.char, cell.x, cell.y);
        ctx.globalAlpha = 1;
      }
    });

    frame++;
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
}

// ═══════════════════════════════════════════════════════════
// EFECTO 2 — SCRAMBLE en REVELA™
// ═══════════════════════════════════════════════════════════
function initRevelaScramble() {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ·—';
  document.querySelectorAll('.scramble-revela').forEach((el, idx) => {
    const finalWord = el.getAttribute('data-final') || el.textContent.trim();
    let triggered = false;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        if (triggered) return;
        triggered = true;
        setTimeout(() => {
          el.classList.add('scrambling');
          let frame = 0;
          const total = 22;
          const timer = setInterval(() => {
            frame++;
            if (frame >= total) {
              el.textContent = finalWord;
              el.classList.remove('scrambling');
              clearInterval(timer);
              return;
            }
            const progress = frame / total;
            const resolved = Math.floor(progress * finalWord.length);
            let out = '';
            for (let i = 0; i < finalWord.length; i++) {
              out += i < resolved
                ? finalWord[i]
                : CHARS[Math.floor(Math.random() * CHARS.length)];
            }
            el.textContent = out;
          }, 38);
        }, idx * 220);
      }
    });
  });
}

// ═══════════════════════════════════════════════════════════
// EFECTO 3 — PESO VARIABLE (fw-word Fluid Weight)
// ═══════════════════════════════════════════════════════════
function initFluidWeight() {
  const fwWords = document.querySelectorAll('.fw-word');
  if (!fwWords.length) return;

  // On scroll: activate when hero h1 is scrolled through
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top 90%',
    once: true,
    onEnter: () => {
      fwWords.forEach((el, i) => {
        const targetWeight = el.getAttribute('data-final-weight') || '700';
        setTimeout(() => {
          el.style.fontWeight = targetWeight;
          el.classList.add('weight-activated');
        }, 900 + i * 180);  // stagger after hero lines appear
      });
    }
  });

  // Also activate on cursor hover for micro interaction
  fwWords.forEach(el => {
    el.addEventListener('mouseenter', () => {
      el.style.fontWeight = el.getAttribute('data-final-weight') || '700';
    });
  });
}

// 8. Logo Interactive Click Effect & Shockwave Pulse
function initLogoClickEffect() {
  const logoAnchor = document.getElementById('logo-anchor');
  const logoImg = document.getElementById('header-logo-img');
  const shockwave = document.getElementById('logo-shockwave');

  if (!logoAnchor || !logoImg) return;

  logoAnchor.addEventListener('click', (e) => {
    e.preventDefault();

    // 1. Smooth scroll to top via Lenis
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 2. Rotate & Spring Scale GSAP animation on the logo image
    gsap.timeline()
      .to(logoImg, {
        rotate: "+=360",
        scale: 1.3,
        duration: 0.55,
        ease: "back.out(2)"
      })
      .to(logoImg, {
        scale: 1,
        duration: 0.35,
        ease: "power2.out"
      });

    // 3. Expanding Shockwave Ring
    if (shockwave) {
      gsap.fromTo(shockwave, 
        { scale: 0.8, opacity: 0.9, borderColor: '#FFBD58' },
        { scale: 2.8, opacity: 0, duration: 0.7, ease: "power2.out" }
      );
    }
  });
}

// Initialize Everything On DOM Load
window.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initLetterGrid();
  initCustomCursor();
  loadPortfolioLogos();
  initScrollAnimations();
  initColorSlideReveals();
  initNavAndForms();
  initHeroAnimation();
  initHeroTypewriter();
  initRevelaScramble();
  initFluidWeight();
  initLogoClickEffect();
});


