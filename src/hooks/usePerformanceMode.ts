import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 768;

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
};

type NavigatorWithConnection = Navigator & {
  connection?: NetworkInformation;
};

const getConnectionStatus = () => {
  if (typeof navigator === 'undefined') {
    return { saveData: false, slowConnection: false };
  }

  const { connection } = navigator as NavigatorWithConnection;
  const effectiveType = connection?.effectiveType ?? '';
  const slowConnection = effectiveType.includes('2g');

  return {
    saveData: Boolean(connection?.saveData),
    slowConnection,
  };
};

export function usePerformanceMode() {
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mobileQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateMode = () => {
      const { saveData, slowConnection } = getConnectionStatus();
      setIsLowPowerMode(
        mobileQuery.matches ||
        reducedMotionQuery.matches ||
        saveData ||
        slowConnection
      );
    };

    updateMode();

    mobileQuery.addEventListener('change', updateMode);
    reducedMotionQuery.addEventListener('change', updateMode);

    return () => {
      mobileQuery.removeEventListener('change', updateMode);
      reducedMotionQuery.removeEventListener('change', updateMode);
    };
  }, []);

  return { isLowPowerMode };
}
