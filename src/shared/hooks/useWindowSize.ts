import { useEffect, useState } from 'react';
import { breakpoints } from 'styles/theme/breakpoints';

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  const [orientation, setOrientation] = useState('portrait');

  const handleResize = () => {
    setWindowSize({
      width: document?.documentElement?.clientWidth || window?.innerWidth,
      height: document?.documentElement?.clientHeight || window?.innerHeight,
    });

    const orientation = window.innerHeight / window.innerWidth > 1 ? 'portrait' : 'landscape';

    setOrientation(orientation);
  };

  const { width = 0 } = windowSize;

  // TODO: temporarily setting desktop min to tablet size
  const isDesktop = width >= breakpoints.large;
  const isMobile = width <= breakpoints.small;
  const isTablet = width > breakpoints.small && width < breakpoints.large;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    isDesktop,
    isMobile,
    isTablet,
    orientation,
    windowSize,
  };
};
