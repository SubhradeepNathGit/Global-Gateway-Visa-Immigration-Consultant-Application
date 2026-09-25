/** First slide — shown instantly under the Swiper while slides decode on remount (e.g. browser back). */
export const HERO_FALLBACK_SRC = '/Slider-front1.jpg';

export const BANNER_IMAGE_SRCS = [
  HERO_FALLBACK_SRC,
  '/Slider2.jpg',
  '/Slider3.jpg',
  '/Slider6.jpg',
  '/Slider-front.jpg',
];

/** In-memory cache of fully loaded & decoded images */
const loadedImageCache = new Map();

/**
 * Detect if the client is on a weak, slow, or high-latency connection
 * or has Data Saver enabled (common for international mobile users).
 */
export function isSlowConnection() {
  if (typeof window === 'undefined') return false;

  if (typeof window.__IS_WEAK_CONNECTION === 'boolean') {
    return window.__IS_WEAK_CONNECTION;
  }

  const conn =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;

  let isWeak = false;

  if (conn) {
    if (conn.saveData) {
      // User explicitly requested data-saving mode — always respect it
      isWeak = true;
    } else if (['slow-2g', '2g'].includes(conn.effectiveType)) {
      // Only flag genuinely terrible radio conditions (not 3G which can be 3–10 Mbps)
      isWeak = true;
    } else if (conn.rtt && conn.rtt >= 700) {
      // Flag only very high latency (> 700ms)
      isWeak = true;
    } else if (conn.downlink && conn.downlink < 0.5) {
      // Flag only if download speed is under 500 kbps
      isWeak = true;
    }
  }

  // Fallback for Safari / Firefox: check TCP handshake + DNS lookup time
  if (!isWeak && window.performance && window.performance.timing) {
    const t = window.performance.timing;
    if (t.connectEnd && t.connectStart) {
      const handshake = (t.connectEnd - t.connectStart) + (t.domainLookupEnd - t.domainLookupStart);
      if (handshake > 1500) {
        // Only flag if TCP handshake + DNS takes over 1.5 seconds
        isWeak = true;
      }
    }
  }

  window.__IS_WEAK_CONNECTION = isWeak;
  if (isWeak && typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.classList.add('weak-connection');
  }

  return isWeak;
}

/**
 * Apply weak-connection mode to DOM:
 * Skips heavy Ken-Burns image zooms and Framer Motion stagger delays
 * so low-bandwidth international visitors don't feel laggy.
 */
function applyWeakConnectionMode() {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.add('weak-connection');
  window.__IS_WEAK_CONNECTION = true;

  if (!document.getElementById('weak-connection-hack-css')) {
    const style = document.createElement('style');
    style.id = 'weak-connection-hack-css';
    style.textContent = `
      html.weak-connection .home-hero-swiper *,
      html.weak-connection .home-hero-swiper *::before,
      html.weak-connection .home-hero-swiper *::after {
        animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.001ms !important;
      }
      html.weak-connection .home-hero-swiper .relative.z-10,
      html.weak-connection .home-hero-swiper h2,
      html.weak-connection .home-hero-swiper p {
        opacity: 1 !important;
        transform: none !important;
      }
      html.weak-connection .home-hero-swiper img {
        will-change: auto !important;
        transform: none !important;
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Robust image loader with decode() & retry mechanism for international networks.
 */
function decodeImageWithRetry(src, maxRetries = 2) {
  if (loadedImageCache.has(src)) {
    return Promise.resolve(loadedImageCache.get(src));
  }

  return new Promise((resolve) => {
    let attempts = 0;

    const attemptLoad = () => {
      const img = new Image();
      img.src = src;

      const onDone = () => {
        if ('decode' in img) {
          img.decode().catch(() => {}).finally(() => {
            loadedImageCache.set(src, img);
            resolve(img);
          });
        } else {
          loadedImageCache.set(src, img);
          resolve(img);
        }
      };

      if (img.complete && img.naturalWidth > 0) {
        onDone();
      } else {
        img.onload = onDone;
        img.onerror = () => {
          attempts++;
          if (attempts <= maxRetries) {
            setTimeout(attemptLoad, 400 * attempts);
          } else {
            resolve(null);
          }
        };
      }
    };

    attemptLoad();
  });
}

/**
 * Smart Banner Preload Hack:
 * - Prioritizes slide 1 immediately.
 * - If connection is weak (or if slide 1 takes > 900ms), skips animations so users don't see lag.
 * - Loads subsequent slides sequentially (one by one) so low bandwidth is not choked.
 */
export async function warmHeroBannerImages() {
  if (typeof window === 'undefined') return Promise.resolve();

  const isSlow = isSlowConnection();
  if (isSlow) {
    applyWeakConnectionMode();
  }

  const startTime = performance.now();

  // Step 1: Guarantee first slide is loaded & decoded with highest priority
  await decodeImageWithRetry(HERO_FALLBACK_SRC);

  // If slide 1 took more than 2500ms to download/decode, dynamically flag as weak connection
  const duration = performance.now() - startTime;
  if (duration > 2500 && !isSlow) {
    applyWeakConnectionMode();
  }

  // Step 2: Load remaining slides
  const remainingSrcs = BANNER_IMAGE_SRCS.filter((s) => s !== HERO_FALLBACK_SRC);

  if (isSlow || duration > 2500) {
    // WEAK CONNECTION: Load slides sequentially one-by-one so bandwidth is never choked
    for (const src of remainingSrcs) {
      await decodeImageWithRetry(src);
      // Small pause between downloads to let user's network breathe for other page resources
      await new Promise((r) => setTimeout(r, 200));
    }
  } else {
    // FAST CONNECTION: Load in parallel
    await Promise.all(remainingSrcs.map((src) => decodeImageWithRetry(src)));
  }
}

// Initial warm-up on page load
if (typeof window !== 'undefined') {
  if (isSlowConnection()) {
    applyWeakConnectionMode();
  }
  warmHeroBannerImages();

  // Listen to network changes if user switches to slow network (e.g. mobile roaming)
  const conn =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;
  if (conn && conn.addEventListener) {
    conn.addEventListener('change', () => {
      if (isSlowConnection()) {
        applyWeakConnectionMode();
      }
    });
  }
}

