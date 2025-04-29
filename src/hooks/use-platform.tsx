
import { useEffect, useState } from 'react';

export type Platform = 'web' | 'android' | 'ios';

export function usePlatform() {
  const [platform, setPlatform] = useState<Platform>('web');
  
  useEffect(() => {
    // Check if running inside Capacitor
    if (window.Capacitor && window.Capacitor.isNativePlatform()) {
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.indexOf('android') > -1) {
        setPlatform('android');
      } else if (
        userAgent.indexOf('iphone') > -1 || 
        userAgent.indexOf('ipad') > -1 || 
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
      ) {
        setPlatform('ios');
      }
    }
  }, []);
  
  return platform;
}
