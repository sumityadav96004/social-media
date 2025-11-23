document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  // Hero animations
  gsap.from('.hero-title', {
    duration: 1.5,
    y: 100,
    opacity: 0,
    ease: 'power3.out'
  });

  gsap.from('.hero-subtitle', {
    duration: 1.5,
    y: 50,
    opacity: 0,
    delay: 0.3,
    ease: 'power3.out'
  });

  gsap.from('.cta-button', {
    duration: 1,
    y: 30,
    opacity: 0,
    delay: 0.6,
    ease: 'power3.out'
  });

  // Floating elements animation
  gsap.to('.element-1', {
    duration: 3,
    y: -20,
    rotation: 360,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  });

  gsap.to('.element-2', {
    duration: 4,
    y: -30,
    rotation: -360,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut',
    delay: 0.5
  });

  gsap.to('.element-3', {
    duration: 3.5,
    y: -25,
    rotation: 180,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut',
    delay: 1
  });

  gsap.to('.element-4', {
    duration: 4.5,
    y: -35,
    rotation: -180,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut',
    delay: 1.5
  });

  // Features section scroll trigger
  gsap.from('.feature-card', {
    scrollTrigger: {
      trigger: '.features',
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse'
    },
    y: 100,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out'
  });

  // About section scroll trigger
  gsap.from('.about-text', {
    scrollTrigger: {
      trigger: '.about',
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse'
    },
    x: -100,
    opacity: 0,
    duration: 1.5,
    ease: 'power3.out'
  });

  gsap.from('.about-stats', {
    scrollTrigger: {
      trigger: '.about',
      start: 'top 60%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse'
    },
    x: 100,
    opacity: 0,
    duration: 1.5,
    ease: 'power3.out'
  });

  // Stats counter animation
  gsap.from('.stat h3', {
    scrollTrigger: {
      trigger: '.about-stats',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    textContent: 0,
    duration: 2,
    ease: 'power1.out',
    snap: { textContent: 1 },
    stagger: 0.2
  });

  // Navbar scroll effect
  ScrollTrigger.create({
    start: 'top -80',
    end: 99999,
    toggleClass: { className: 'navbar--scrolled', targets: '.navbar' }
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        gsap.to(window, {
          duration: 1,
          scrollTo: { y: target, offsetY: 80 },
          ease: 'power2.inOut'
        });
      }
    });
  });

  // Parallax effect for hero background
  gsap.to('.hero', {
    backgroundPosition: '50% 100%',
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });
});
