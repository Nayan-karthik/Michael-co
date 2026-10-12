/**
 * Michael & Co. — Interactive JavaScript
 * Elegant, High-Performance Micro-Interactions & Form Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initHeroSlider();
  initGalleryFilter();
  initLightbox();
  initBookingForm();
});

/* --------------------------------------------------------------------------
 * 1. HEADER SCROLL & STICKY BEHAVIOR
 * -------------------------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
 * 2. MOBILE DRAWER NAVIGATION
 * -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const navLinks = document.querySelectorAll('.mobile-nav-links a');

  if (!toggleBtn || !drawer) return;

  const toggleMenu = () => {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.remove('open');
      toggleBtn.classList.remove('open');
      document.body.style.overflow = '';
    } else {
      drawer.classList.add('open');
      toggleBtn.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  toggleBtn.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggleBtn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* --------------------------------------------------------------------------
 * 3. HERO SLIDER (CINEMATIC ROTATION)
 * -------------------------------------------------------------------------- */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (slides.length <= 1) return;

  let currentIdx = 0;
  let intervalId = null;
  const slideDuration = 6000;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentIdx = index;
  }

  function nextSlide() {
    const nextIdx = (currentIdx + 1) % slides.length;
    showSlide(nextIdx);
  }

  function startAutoplay() {
    stopAutoplay();
    intervalId = setInterval(nextSlide, slideDuration);
  }

  function stopAutoplay() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      showSlide(idx);
      startAutoplay();
    });
  });

  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopAutoplay);
    heroSection.addEventListener('mouseleave', startAutoplay);
  }

  startAutoplay();
}

/* --------------------------------------------------------------------------
 * 4. EDITORIAL GALLERY FILTER
 * -------------------------------------------------------------------------- */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        const category = item.dataset.category;
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        } else {
          item.style.display = 'none';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.96)';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
 * 5. LIGHTBOX MODAL PREVIEW
 * -------------------------------------------------------------------------- */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.getElementById('lightboxModal');
  if (!modal || !galleryItems.length) return;

  const modalImg = modal.querySelector('.lightbox-img');
  const modalTitle = modal.querySelector('.lightbox-title');
  const modalMeta = modal.querySelector('.lightbox-meta');
  const closeBtn = modal.querySelector('.modal-close-btn');

  function openLightbox(item) {
    const imgEl = item.querySelector('.gallery-img');
    const titleEl = item.querySelector('.gallery-title');
    const locationEl = item.querySelector('.gallery-location');
    const tagEl = item.dataset.categoryName || '';

    if (modalImg && imgEl) {
      modalImg.src = imgEl.src;
      modalImg.alt = imgEl.alt;
    }
    if (modalTitle && titleEl) {
      modalTitle.textContent = titleEl.textContent;
    }
    if (modalMeta) {
      const loc = locationEl ? locationEl.textContent.trim() : 'Bengaluru';
      modalMeta.textContent = `${loc} • ${tagEl}`;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* --------------------------------------------------------------------------
 * 6. BOOKING FORM HANDLER & WHATSAPP FORWARDER
 * -------------------------------------------------------------------------- */
function initBookingForm() {
  const bookingForm = document.getElementById('eventBookingForm');
  const confirmationModal = document.getElementById('bookingConfirmModal');
  if (!bookingForm) return;

  // Pre-select service pill from URL query parameter (e.g. ?service=outdoor)
  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service');
  if (serviceParam) {
    const serviceMap = {
      'weddings': 'pillWedding',
      'outdoor': 'pillOutdoor',
      'floral': 'pillFloral',
      'stage': 'pillStage'
    };
    const targetPillId = serviceMap[serviceParam.toLowerCase()];
    if (targetPillId) {
      const radioEl = document.getElementById(targetPillId);
      if (radioEl) radioEl.checked = true;
    }
  }

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Collect values
    const fullName = document.getElementById('fullName')?.value.trim() || 'Valued Client';
    const phone = document.getElementById('phone')?.value.trim() || '';
    const email = document.getElementById('email')?.value.trim() || '';
    
    // Selected event type
    const eventTypeRadio = document.querySelector('input[name="eventType"]:checked');
    const eventType = eventTypeRadio ? eventTypeRadio.value : 'Special Event';

    const eventDate = document.getElementById('eventDate')?.value.trim() || 'Date to be finalized';
    const eventVenue = document.getElementById('eventVenue')?.value.trim() || 'Bengaluru';
    const guestCount = document.getElementById('guestCount')?.value.trim() || 'To be determined';
    const eventVision = document.getElementById('eventVision')?.value.trim() || 'No additional notes';

    // Construct WhatsApp message pre-filled string
    const waText = `*New Event Inquiry for Michael & Co.*%0A%0A` +
      `*Client:* ${encodeURIComponent(fullName)}%0A` +
      `*Phone:* ${encodeURIComponent(phone)}%0A` +
      `*Email:* ${encodeURIComponent(email)}%0A` +
      `*Event Type:* ${encodeURIComponent(eventType)}%0A` +
      `*Expected Date:* ${encodeURIComponent(eventDate)}%0A` +
      `*Venue/City:* ${encodeURIComponent(eventVenue)}%0A` +
      `*Guests:* ${encodeURIComponent(guestCount)}%0A` +
      `*Vision & Notes:* ${encodeURIComponent(eventVision)}`;

    const waUrl = `https://wa.me/919916464856?text=${waText}`;

    // Update confirmation modal
    if (confirmationModal) {
      const waActionBtn = confirmationModal.querySelector('#sendWhatsAppDirectBtn');
      if (waActionBtn) {
        waActionBtn.href = waUrl;
      }
      const clientNameSpan = confirmationModal.querySelector('#confirmClientName');
      if (clientNameSpan) {
        clientNameSpan.textContent = fullName;
      }
      confirmationModal.classList.add('active');
      document.body.style.overflow = 'hidden';

      const closeConfirmBtn = confirmationModal.querySelector('.modal-close-btn');
      const finishBtn = confirmationModal.querySelector('#finishModalBtn');

      const closeConfirm = () => {
        confirmationModal.classList.remove('active');
        document.body.style.overflow = '';
        bookingForm.reset();
      };

      if (closeConfirmBtn) closeConfirmBtn.onclick = closeConfirm;
      if (finishBtn) finishBtn.onclick = closeConfirm;
    } else {
      // Fallback: direct redirect
      window.location.href = waUrl;
    }
  });
}
