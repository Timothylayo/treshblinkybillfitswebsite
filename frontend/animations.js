/**
 * TRESHBLINKYBILL FITS — Animation Controller
 * Manages all scroll-triggered and interactive animations using Intersection Observer
 * Lightweight, performant, and accessibility-conscious
 */

class AnimationController {
  constructor() {
    this.observedElements = new Map();
    this.isInitialized = false;
    this.init();
  }

  /**
   * Initialize the animation system
   */
  init() {
    if (this.isInitialized) return;
    
    // Create Intersection Observer
    this.createObserver();
    
    // Setup hero animations (immediate, no scroll needed)
    this.setupHeroAnimations();
    
    // Setup carousel animations
    this.setupCarouselAnimations();
    
    // Setup interactive hover states
    this.setupInteractiveAnimations();
    
    // Setup cart badge updates
    this.setupCartAnimation();
    
    // Observe all scroll-triggered sections
    this.observeScrollTriggers();
    
    this.isInitialized = true;
    console.log('✨ Animation system initialized');
  }

  /**
   * Create Intersection Observer for scroll-triggered animations
   */
  createObserver() {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px', // Trigger 50px before element is fully visible
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.triggerAnimation(entry.target);
          // Unobserve after animation plays (performance optimization)
          this.observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
  }

  /**
   * Trigger animation on element
   */
  triggerAnimation(element) {
    const animationType = element.dataset.animation;
    
    if (!animationType) return;

    // Apply animation class
    element.classList.add(animationType);
    element.style.opacity = '1'; // Ensure element is visible
  }

  /**
   * Setup hero section animations (immediate on load)
   */
  setupHeroAnimations() {
    const heroLogo = document.querySelector('.hero__logo-circle');
    const heroBrandName = document.querySelector('.hero__brand-name');
    const heroBrandSub = document.querySelector('.hero__brand-sub');
    const heroTag = document.querySelector('.hero__tag');
    const heroTitle = document.querySelector('.hero__title');
    const heroSub = document.querySelector('.hero__sub');
    const heroButtons = document.querySelectorAll('.hero__btns .btn');

    if (heroLogo) {
      heroLogo.classList.add('hero-logo');
      heroLogo.style.opacity = '0';
      // Trigger immediately
      setTimeout(() => this.triggerAnimation(heroLogo), 50);
    }

    if (heroBrandName) {
      heroBrandName.classList.add('hero-brand-name');
      heroBrandName.style.opacity = '0';
      setTimeout(() => this.triggerAnimation(heroBrandName), 50);
    }

    if (heroBrandSub) {
      heroBrandSub.classList.add('hero-brand-sub');
      heroBrandSub.style.opacity = '0';
      setTimeout(() => this.triggerAnimation(heroBrandSub), 50);
    }

    if (heroTag) {
      heroTag.classList.add('hero-tag');
      heroTag.style.opacity = '0';
      setTimeout(() => this.triggerAnimation(heroTag), 50);
    }

    if (heroTitle) {
      heroTitle.classList.add('hero-title');
      heroTitle.style.opacity = '0';
      setTimeout(() => this.triggerAnimation(heroTitle), 50);
    }

    if (heroSub) {
      heroSub.classList.add('hero-subtitle');
      heroSub.style.opacity = '0';
      setTimeout(() => this.triggerAnimation(heroSub), 50);
    }

    heroButtons.forEach((btn, index) => {
      btn.classList.add('hero-button', 'btn-click-scale');
      btn.style.opacity = '0';
      setTimeout(() => this.triggerAnimation(btn), 50);
    });
  }

  /**
   * Setup carousel animations with stagger effect
   */
  setupCarouselAnimations() {
    // Designs carousel
    const designsCarousel = document.getElementById('designsCarousel');
    if (designsCarousel) {
      this.setupCarouselObserver(designsCarousel, 'mono-card');
    }

    // Collections carousel
    const collectionsCarousel = document.getElementById('collectionsCarousel');
    if (collectionsCarousel) {
      this.setupCarouselObserver(collectionsCarousel, 'native-card');
    }
  }

  /**
   * Setup individual carousel with staggered animations
   */
  setupCarouselObserver(carouselElement, cardClass) {
    const cards = carouselElement.querySelectorAll(`.${cardClass}`);
    
    cards.forEach((card, index) => {
      card.classList.add('carousel-card', 'card-hover-lift', `carousel-item-${index}`);
      card.style.opacity = '0';
      
      // Observe each card for scroll trigger
      this.observer.observe(card);
    });

    // Also setup observer for carousel section header
    const section = carouselElement.closest('.section');
    if (section) {
      const header = section.querySelector('.section-hdr');
      if (header) {
        header.classList.add('section-hdr--animate');
        header.style.opacity = '0';
        this.observer.observe(header);
      }
    }
  }

  /**
   * Setup CTA band animation
   */
  setupCtaBandAnimations() {
    const ctaBand = document.querySelector('.cta-band');
    if (ctaBand) {
      ctaBand.classList.add('cta-band');
      ctaBand.style.opacity = '0';
      this.observer.observe(ctaBand);

      // Add idle pulse animation
      setTimeout(() => {
        if (ctaBand.querySelector('.cta-band__title')) {
          ctaBand.querySelector('.cta-band__title').classList.add('cta-band-idle');
        }
      }, 1000);
    }
  }

  /**
   * Setup social box animation
   */
  setupSocialBoxAnimations() {
    const socialBox = document.querySelector('.social-box');
    if (socialBox) {
      socialBox.classList.add('social-box');
      socialBox.style.opacity = '0';

      // Observe social box
      this.observer.observe(socialBox);

      // Animate individual social items with stagger
      const socialItems = socialBox.querySelectorAll('.social-item');
      socialItems.forEach((item, index) => {
        item.classList.add('animate-bounce-in', `social-item-${index}`, 'social-item-hover');
        item.style.opacity = '0';
        
        // Delay observation for staggered effect
        setTimeout(() => {
          this.observer.observe(item);
        }, index * 100);
      });
    }
  }

  /**
   * Setup all scroll-triggered sections
   */
  observeScrollTriggers() {
    // CTA band
    this.setupCtaBandAnimations();
    
    // Social box
    this.setupSocialBoxAnimations();

    // Any element with data-animation attribute
    const animatedElements = document.querySelectorAll('[data-animation]');
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      this.observer.observe(el);
    });
  }

  /**
   * Setup interactive hover and click animations
   */
  setupInteractiveAnimations() {
    // Button hover glow
    const buttons = document.querySelectorAll('.btn--mint, .btn--primary, .cta-band .btn');
    buttons.forEach(btn => {
      btn.classList.add('btn-hover-glow', 'btn-click-scale');
    });

    // Card hover lifts
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      card.classList.add('card-hover-lift');
    });

    // "Tailor This" button feedback
    document.addEventListener('click', (e) => {
      if (e.target.textContent.includes('Tailor This') || e.target.closest('button')?.textContent.includes('Tailor This')) {
        const btn = e.target.closest('button');
        if (btn) {
          btn.classList.add('animate-pulse-badge');
          setTimeout(() => btn.classList.remove('animate-pulse-badge'), 400);
        }
      }
    });
  }

  /**
   * Setup cart badge animation on update
   */
  setupCartAnimation() {
    const floatingCart = document.getElementById('floatingCart');
    const cartItemCount = document.getElementById('cartItemCount');
    
    if (cartItemCount && floatingCart) {
      // Observe original cart item count
      const originalObserver = new MutationObserver(() => {
        // When count changes, pulse the badge
        cartItemCount.classList.add('animate-pulse-badge');
        floatingCart.classList.add('animate-pulse');
        
        setTimeout(() => {
          cartItemCount.classList.remove('animate-pulse-badge');
          floatingCart.classList.remove('animate-pulse');
        }, 400);
      });

      // Watch for text changes in cart count
      originalObserver.observe(cartItemCount, {
        childList: true,
        characterData: true,
        subtree: true
      });
    }
  }

  /**
   * Pause animations when user prefers reduced motion
   */
  checkReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms');
      console.log('⚙️ Reduced motion preference detected - animations minimized');
    }
  }

  /**
   * Utility: Re-observe element (useful for dynamically added content)
   */
  reobserve(element) {
    if (element) {
      element.style.opacity = '0';
      this.observer.observe(element);
    }
  }

  /**
   * Utility: Manually trigger animation on element
   */
  animateElement(element, animationType) {
    if (!element) return;
    element.classList.add(animationType);
    element.style.opacity = '1';
  }

  /**
   * Cleanup (for SPAs or cleanup on page unload)
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.isInitialized = false;
  }
}

/**
 * Initialize animation controller when DOM is ready
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.animationController = new AnimationController();
  });
} else {
  window.animationController = new AnimationController();
}

/**
 * Export for use in other modules
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AnimationController;
}
