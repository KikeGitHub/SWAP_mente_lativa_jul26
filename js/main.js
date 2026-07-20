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

// Disable scroll while intro is active
function disableScroll() {
  if (lenis) lenis.stop();
  document.body.style.overflow = 'hidden';
}

// Enable scroll once intro completes
function enableScroll() {
  if (lenis) lenis.start();
  document.body.style.overflow = '';
}

// 2. Preloader & Video Intro Logic
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const video = document.getElementById('intro-video');
  const skipBtn = document.getElementById('skip-intro-btn');
  const toggleAudioBtn = document.getElementById('toggle-audio-btn');
  const audioIconMuted = document.getElementById('audio-icon-muted');
  const audioIconPlaying = document.getElementById('audio-icon-playing');

  disableScroll();

  // Try to play with audio enabled first
  video.muted = false;

  // Synchronize SVGs with actual muted state
  const updateAudioIcons = () => {
    if (video.muted) {
      audioIconMuted.classList.remove('hidden');
      audioIconPlaying.classList.add('hidden');
    } else {
      audioIconMuted.classList.add('hidden');
      audioIconPlaying.classList.remove('hidden');
    }
  };

  // Try playing unmuted
  video.play().catch(err => {
    console.log("Autoplay unmuted blocked by browser policy. Muting to autoplay:", err);
    // Browser blocked unmuted autoplay. Mute video and play.
    video.muted = true;
    updateAudioIcons();
    video.play().catch(e => {
      console.log("Muted autoplay also blocked:", e);
    });
  });

  // Toggle audio on button click
  toggleAudioBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    updateAudioIcons();
  });

  const fadeOutPreloader = () => {
    preloader.classList.add('fade-out');
    video.pause(); // Ensure sound stops playing after fade-out
    enableScroll();
    
    // Animate Hero content once loaded
    gsap.from(".hero-container > *", {
      opacity: 0,
      y: 40,
      stagger: 0.2,
      duration: 1.2,
      ease: "power4.out"
    });
  };

  // Video finished playing
  video.onended = fadeOutPreloader;

  // Skip button click
  skipBtn.addEventListener('click', fadeOutPreloader);

  // Failsafe: fade out after 8.5 seconds anyway
  setTimeout(() => {
    if (!preloader.classList.contains('fade-out')) {
      fadeOutPreloader();
    }
  }, 8500);
}

// 3. Custom Cursor Follower with Inertia
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
  const hoverTargets = 'a, button, input, select, textarea, .service-card, .grid-logo-item, .ticker-item';
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

  // B. Success Cases Brands Grid (30 items)
  const grid = document.getElementById('brands-grid');
  
  // page 13 has 19 logos
  for (let i = 1; i <= 19; i++) {
    createGridItem(grid, `assets/logos/brands/page_13_img_1_logo_${i}.png`);
  }
  // page 14 has 11 logos
  for (let i = 1; i <= 11; i++) {
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

  // Horizontal scroll for Método REVELA™
  const slidesContainer = document.querySelector('.horizontal-scroll-container');
  const slides = document.querySelectorAll('.scroll-slide');
  
  gsap.to(slidesContainer, {
    x: () => -(slidesContainer.scrollWidth - window.innerWidth),
    ease: "none",
    scrollTrigger: {
      trigger: "#metodo",
      pin: true,
      scrub: 1.2,
      start: "top top",
      end: () => "+=" + (slidesContainer.scrollWidth - window.innerWidth),
      invalidateOnRefresh: true,
    }
  });

  // Dynamic theme background coloring on scroll transitions
  // Transition background on El Estudio
  ScrollTrigger.create({
    trigger: "#estudio",
    start: "top 50%",
    end: "bottom 50%",
    onEnter: () => gsap.to("body", { backgroundColor: "#FEFAF2", color: "#030103", duration: 0.6 }),
    onLeaveBack: () => gsap.to("body", { backgroundColor: "#030103", color: "#ffffff", duration: 0.6 }),
  });

  // Transition background on Dos Lenguajes
  ScrollTrigger.create({
    trigger: "#servicios",
    start: "top 50%",
    end: "bottom 50%",
    onEnter: () => gsap.to("body", { backgroundColor: "#4197B4", color: "#ffffff", duration: 0.6 }),
    onLeaveBack: () => gsap.to("body", { backgroundColor: "#FEFAF2", color: "#030103", duration: 0.6 }),
  });

  // Transition background on REVELA™ (Dark)
  ScrollTrigger.create({
    trigger: "#metodo",
    start: "top 50%",
    end: "bottom 50%",
    onEnter: () => gsap.to("body", { backgroundColor: "#030103", color: "#ffffff", duration: 0.6 }),
    onLeaveBack: () => gsap.to("body", { backgroundColor: "#4197B4", color: "#ffffff", duration: 0.6 }),
  });

  // Transition background on Portafolio (Cream)
  ScrollTrigger.create({
    trigger: "#portafolio",
    start: "top 50%",
    end: "bottom 50%",
    onEnter: () => gsap.to("body", { backgroundColor: "#FEFAF2", color: "#030103", duration: 0.6 }),
    onLeaveBack: () => gsap.to("body", { backgroundColor: "#030103", color: "#ffffff", duration: 0.6 }),
  });

  // Transition background on Contacto (Dark)
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

// Initialize Everything On DOM Load
window.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initCustomCursor();
  loadPortfolioLogos();
  initScrollAnimations();
  initNavAndForms();
  initPreloader();
});
