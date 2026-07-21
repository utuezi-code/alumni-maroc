(function () {
  const root = document.getElementById('carousel');
  if (!root) return;

  const viewport = document.getElementById('carouselViewport');
  const track = document.getElementById('carouselTrack');
  const slides = Array.from(track.children);
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsWrap = document.getElementById('carouselDots');

  const count = slides.length;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const AUTOPLAY_DELAY = 5000;

  let index = 0;
  let dragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let dragOffset = 0;
  let autoplayTimer = null;

  // Build dots
  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel__dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Aller à la photo ${i + 1}`);
    dot.addEventListener('click', () => goTo(i, true));
    dotsWrap.appendChild(dot);
    return dot;
  });

  function updateDots() {
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
  }

  function setTrackPosition(animate) {
    track.classList.toggle('is-animating', animate);
    currentTranslate = -index * viewport.clientWidth;
    track.style.transform = `translateX(${currentTranslate}px)`;
  }

  function goTo(newIndex, userInitiated) {
    index = (newIndex + count) % count;
    setTrackPosition(true);
    updateDots();
    if (userInitiated) restartAutoplay();
  }

  function next(userInitiated) { goTo(index + 1, userInitiated); }
  function prev(userInitiated) { goTo(index - 1, userInitiated); }

  function startAutoplay() {
    if (reducedMotion) return;
    stopAutoplay();
    autoplayTimer = setInterval(() => next(false), AUTOPLAY_DELAY);
  }
  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  prevBtn.addEventListener('click', () => prev(true));
  nextBtn.addEventListener('click', () => next(true));

  root.addEventListener('mouseenter', stopAutoplay);
  root.addEventListener('mouseleave', startAutoplay);
  root.addEventListener('focusin', stopAutoplay);
  root.addEventListener('focusout', startAutoplay);

  // Drag / swipe (pointer events cover mouse + touch)
  function onPointerDown(e) {
    dragging = true;
    startX = e.clientX;
    dragOffset = 0;
    track.classList.remove('is-animating');
    viewport.classList.add('is-dragging');
    stopAutoplay();
    viewport.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!dragging) return;
    dragOffset = e.clientX - startX;
    track.style.transform = `translateX(${currentTranslate + dragOffset}px)`;
  }

  function onPointerUp() {
    if (!dragging) return;
    dragging = false;
    viewport.classList.remove('is-dragging');

    const threshold = viewport.clientWidth * 0.18;
    if (dragOffset < -threshold) {
      next(false);
    } else if (dragOffset > threshold) {
      prev(false);
    } else {
      setTrackPosition(true);
    }
    startAutoplay();
  }

  viewport.addEventListener('pointerdown', onPointerDown);
  viewport.addEventListener('pointermove', onPointerMove);
  viewport.addEventListener('pointerup', onPointerUp);
  viewport.addEventListener('pointercancel', onPointerUp);
  viewport.addEventListener('pointerleave', () => { if (dragging) onPointerUp(); });

  // Prevent native image drag ghost
  viewport.addEventListener('dragstart', (e) => e.preventDefault());

  // Keep alignment on resize
  window.addEventListener('resize', () => setTrackPosition(false));

  setTrackPosition(false);
  updateDots();
  startAutoplay();
})();
