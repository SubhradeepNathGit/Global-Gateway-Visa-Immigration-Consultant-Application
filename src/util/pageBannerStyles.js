/** Shared page hero banner styles — desktop (md+) matches original 300px / h3 sizing */

export const pageBannerOuterSx = {
  height: { xs: 220, sm: 260, md: '300px' },
  backgroundImage: 'url(/PageBanner.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  alignItems: 'center',
  color: '#fff',
  position: 'relative',
};

export const pageBannerOverlaySx = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  bgcolor: 'rgba(0, 0, 0, 0.7)',
};

export const pageBannerInnerSx = {
  position: 'relative',
  zIndex: 1,
  width: '100%',
  px: { xs: 2, md: 10 },
};

export const pageBannerTitleSx = {
  fontWeight: 'bold',
  fontSize: { xs: '1.75rem', sm: '2.125rem', md: '3rem' },
  lineHeight: { xs: 1.15, md: 1.2 },
};
