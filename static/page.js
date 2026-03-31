const mainImage = document.getElementById("mainImage");
const thumbnails = document.querySelectorAll(".thumb");

thumbnails.forEach(thumb => {
  thumb.addEventListener("click", () => {
      mainImage.style.opacity = 0;

      setTimeout(() => {
          mainImage.src = thumb.src;
          mainImage.style.opacity = 1;
      }, 200);

      thumbnails.forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");
  });
});
let lastScrollY = window.scrollY;
const navbar = document.querySelector(".main-navbar");

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    // scrolling down
    navbar.classList.add("hide");
    navbar.classList.remove("show");
  } else {
    // scrolling up
    navbar.classList.add("show");
    navbar.classList.remove("hide");
  }

  lastScrollY = currentScrollY;
});
(function () {
  const images = [
    "images/six.jpeg",
    "images/one.png",
    "images/two.jpg",
    "images/three.jpg",
    "images/four.png",
    "images/five.png",
    "images/seven.jpeg",
    "images/eight.jpeg"
  ];

// if i switch between pages the images stop the transition, make it transit once user activity detected
  // Layers: A is always below B. We fade B in on top of A, then swap references.
  const layerA = document.getElementById('currentLayer');
  const layerB = document.getElementById('nextLayer');

  let front = layerA; // currently visible layer (opacity 1, z-index 2)
  let back  = layerB; // next layer (opacity 0, z-index 1)

  let idx = 0;        // index shown on `front`
  let isFading = false;
  let displayTimer = null;
  let fadeTimer = null;

  const FADE_MS    = 2200;
  const DISPLAY_MS = 5000;
  const EASE       = `opacity ${FADE_MS}ms cubic-bezier(0.25, 0.95, 0.45, 1)`;

  function setBg(layer, src) {
    layer.style.backgroundImage = `url(${src})`;
  }

  function preload() {
    return Promise.all(images.map(src => new Promise(res => {
      const img = new Image();
      img.onload = img.onerror = res;
      img.src = src;
    })));
  }

  function init() {
    // Front layer: fully visible, on top
    setBg(front, images[idx]);
    front.style.transition = 'none';
    front.style.opacity    = '1';
    front.style.zIndex     = '2';

    // Back layer: invisible, underneath
    const nextIdx = (idx + 1) % images.length;
    setBg(back, images[nextIdx]);
    back.style.transition = 'none';
    back.style.opacity    = '0';
    back.style.zIndex     = '1';

    isFading = false;
  }

  function crossfade() {
    if (isFading) return;
    isFading = true;

    const nextIdx = (idx + 1) % images.length;

    // --- KEY FIX ---
    // back already has the next image loaded (set at end of last cycle).
    // Bring back above front WITHOUT touching front's opacity.
    back.style.transition = 'none';
    back.style.opacity    = '0';
    back.style.zIndex     = '3'; // on top of front (which stays at z=2, opacity=1)

    // Force a style flush so the browser registers opacity:0 before we start fading
    void back.offsetHeight;

    // Now fade back in
    back.style.transition = EASE;
    back.style.opacity    = '1';

    // After fade completes, swap layer roles
    fadeTimer = setTimeout(() => {
      // `back` is now fully visible. Silently reset `front` underneath it.
      front.style.transition = 'none';
      front.style.opacity    = '1'; // keep it opaque (it will be the new back)
      front.style.zIndex     = '1';

      // back becomes the new front
      back.style.zIndex = '2';

      // Swap references
      [front, back] = [back, front];

      // Update index
      idx = nextIdx;

      // Pre-load next image into the (now hidden) back layer
      const upcoming = (idx + 1) % images.length;
      setBg(back, images[upcoming]);
      back.style.transition = 'none';
      back.style.opacity    = '0';

      isFading  = false;
      fadeTimer = null;

      schedule();
    }, FADE_MS);
  }

  function schedule() {
    clearTimeout(displayTimer);
    displayTimer = setTimeout(() => {
      crossfade();
    }, DISPLAY_MS);
  }

  function onVisibility() {
    if (document.hidden) {
      clearTimeout(displayTimer);
      clearTimeout(fadeTimer);
    } else {
      // 🔥 restart cleanly instead of partial resume
      isFading = false;
      schedule();
    }
  }

  async function start() {
    await preload();
    init();
    schedule();
    document.addEventListener('visibilitychange', onVisibility);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  window.addEventListener('beforeunload', () => {
    clearTimeout(displayTimer);
    clearTimeout(fadeTimer);
    document.removeEventListener('visibilitychange', onVisibility);
  });
})();
