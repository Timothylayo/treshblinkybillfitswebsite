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
    
    // Ensure DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.runAnimations());
    } else {
      this.runAnimations();
    }
    
    this.isInitialized = true;
  }

  runAnimations() {
    
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

    // Set initial state BEFORE adding classes
    if (heroLogo) {
      heroLogo.style.opacity = '0';
      heroLogo.style.animation = 'fadeIn 0.4s ease forwards';
      console.log('✓ Hero logo queued');
    }

    if (heroBrandName) {
      heroBrandName.style.opacity = '0';
      heroBrandName.style.animation = 'fadeInLeft 0.5s ease 0.1s forwards';
      console.log('✓ Hero brand name queued');
    }

    if (heroBrandSub) {
      heroBrandSub.style.opacity = '0';
      heroBrandSub.style.animation = 'fadeInLeft 0.5s ease 0.2s forwards';
      console.log('✓ Hero brand sub queued');
    }

    if (heroTag) {
      heroTag.style.opacity = '0';
      heroTag.style.animation = 'fadeIn 0.4s ease 0.3s forwards';
      console.log('✓ Hero tag queued');
    }

    if (heroTitle) {
      heroTitle.style.opacity = '0';
      heroTitle.style.animation = 'fadeInUp 0.6s ease 0.4s forwards';
      console.log('✓ Hero title queued');
    }

    if (heroSub) {
      heroSub.style.opacity = '0';
      heroSub.style.animation = 'fadeInUp 0.5s ease 0.5s forwards';
      console.log('✓ Hero subtitle queued');
    }

    heroButtons.forEach((btn, index) => {
      btn.style.opacity = '0';
      btn.style.animation = `slideUpBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.6s forwards`;
      btn.classList.add('btn-click-scale');
      console.log('✓ Hero button queued');
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
      card.classList.add('card-hover-lift');
      card.style.opacity = '0';
      
      // Direct animation with stagger
      const delay = index * 60; // 60ms between each card
      card.style.animation = `scaleInSmall 0.4s ease ${delay}ms forwards`;
      
      console.log(`✓ Carousel card ${index} queued (${delay}ms delay)`);
    });

    // Also setup observer for carousel section header
    const section = carouselElement.closest('.section');
    if (section) {
      const header = section.querySelector('.section-hdr');
      if (header) {
        header.style.opacity = '0';
        header.style.animation = 'fadeIn 0.3s ease forwards';
        this.observer.observe(header);
        console.log('✓ Section header queued');
      }
    }
  }

  /**
   * Setup CTA band animation
   */
  setupCtaBandAnimations() {
    const ctaBand = document.querySelector('.cta-band');
    if (ctaBand) {
      ctaBand.style.opacity = '0';
      
      // Observe for scroll trigger
      this.observer.observe(ctaBand);
      console.log('✓ CTA band queued for scroll trigger');

      // Add idle pulse animation after visible
      setTimeout(() => {
        const title = ctaBand.querySelector('.cta-band__title');
        if (title) {
          title.style.animation = 'pulse 3s ease-in-out 2s infinite';
        }
      }, 2000);
    }
  }

  /**
   * Setup social box animation
   */
  setupSocialBoxAnimations() {
    const socialBox = document.querySelector('.social-box');
    if (socialBox) {
      socialBox.style.opacity = '0';

      // Observe social box for scroll trigger
      this.observer.observe(socialBox);
      console.log('✓ Social box queued for scroll trigger');

      // Animate individual social items with stagger
      const socialItems = socialBox.querySelectorAll('.social-item');
      socialItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.classList.add('social-item-hover');
        
        // Direct animation with stagger
        const delay = index * 80; // 80ms between social items
        item.style.animation = `bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${delay}ms forwards`;
        
        console.log(`✓ Social item ${index} queued (${delay}ms delay)`);
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

  /**
   * Show loading spinner overlay
   */
  static showLoadingSpinner(message = 'Loading...') {
    // Remove existing spinner if any
    const existing = document.getElementById('loadingSpinner');
    if (existing) existing.remove();

    const spinner = document.createElement('div');
    spinner.id = 'loadingSpinner';
    spinner.className = 'loading-overlay';
    spinner.innerHTML = `
      <div class="loading-content">
        <div class="spinner-border" role="status"></div>
        <div class="loading-text">${message}</div>
      </div>
    `;
    document.body.appendChild(spinner);
    return spinner;
  }

  /**
   * Show loading spinner with dots
   */
  static showLoadingDots(message = 'Processing') {
    // Remove existing spinner if any
    const existing = document.getElementById('loadingSpinner');
    if (existing) existing.remove();

    const spinner = document.createElement('div');
    spinner.id = 'loadingSpinner';
    spinner.className = 'loading-overlay';
    spinner.innerHTML = `
      <div class="loading-content">
        <div class="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div class="loading-text">${message}</div>
      </div>
    `;
    document.body.appendChild(spinner);
    return spinner;
  }

  /**
   * Hide loading spinner
   */
  static hideLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
      spinner.style.animation = 'fadeOut 0.3s ease forwards';
      setTimeout(() => spinner.remove(), 300);
    }
  }

  /**
   * Animate icon
   */
  static animateIcon(element, animationType = 'bounce') {
    if (!element) return;
    
    const iconClass = `icon-animate-${animationType}`;
    element.classList.add(iconClass);
    
    // Remove class after animation completes
    setTimeout(() => {
      element.classList.remove(iconClass);
    }, 1500);
  }

  /**
   * Create animated icon element
   */
  static createAnimatedIcon(iconName, animationType = 'bounce', bgColor = 'mint-bg') {
    const wrapper = document.createElement('div');
    wrapper.className = `icon-wrapper ${bgColor} icon-animate-${animationType}`;
    wrapper.innerHTML = `<i class="bi ${iconName}"></i>`;
    return wrapper;
  }

  /**
   * Add pulse badge to element
   */
  static addPulseBadge(element, text = '') {
    const badge = document.createElement('span');
    badge.className = 'badge-animated badge--info';
    badge.innerHTML = `
      <i class="bi bi-star-fill"></i>
      ${text}
      <span class="badge-pulse-ring"></span>
    `;
    element.appendChild(badge);
    return badge;
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