import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { HERO_FALLBACK_SRC, warmHeroBannerImages } from '../../../util/heroBannerPreload';

/**
 * Stays mounted for the whole session so hero pixels stay decoded.
 * Visible only on home — covers the frame before Banner/Swiper paint on browser back.
 */
const PersistentHeroBackdrop = () => {
  const { pathname } = useLocation();
  const isHome = pathname === '/' || pathname === '';

  useLayoutEffect(() => {
    if (isHome) {
      void warmHeroBannerImages();
    }
  }, [isHome]);

  return (
    <div
      aria-hidden={!isHome}
      className="fixed inset-0 w-full h-[100dvh] pointer-events-none"
      style={{
        zIndex: isHome ? 0 : -1,
        visibility: isHome ? 'visible' : 'hidden',
        opacity: isHome ? 1 : 0,
        backgroundImage: `url(${HERO_FALLBACK_SRC})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <img
        src={HERO_FALLBACK_SRC}
        alt=""
        decoding="sync"
        loading="eager"
        fetchPriority="high"
        className="h-full w-full object-cover"
      />
    </div>
  );
};

export default PersistentHeroBackdrop;
