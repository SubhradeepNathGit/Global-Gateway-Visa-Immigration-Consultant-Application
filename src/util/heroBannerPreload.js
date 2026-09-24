/** First slide — shown instantly under the Swiper while slides decode on remount (e.g. browser back). */
export const HERO_FALLBACK_SRC = '/Slider-front1.jpg';

export const BANNER_IMAGE_SRCS = [
  HERO_FALLBACK_SRC,
  '/Slider2.jpg',
  '/Slider3.jpg',
  '/Slider6.jpg',
  '/Slider-front.jpg',
];

function decodeImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    const done = () => {
      if ('decode' in img) {
        img.decode().then(resolve).catch(resolve);
      } else {
        resolve();
      }
    };
    if (img.complete && img.naturalWidth > 0) {
      done();
    } else {
      img.onload = done;
      img.onerror = resolve;
    }
  });
}

/** Warm banner assets (safe to call on every navigation to home). */
export function warmHeroBannerImages() {
  if (typeof window === 'undefined') return Promise.resolve();
  return Promise.all(BANNER_IMAGE_SRCS.map(decodeImage));
}

if (typeof window !== 'undefined') {
  warmHeroBannerImages();
}
