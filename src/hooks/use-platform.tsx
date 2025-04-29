
import { useEffect, useState } from 'react';

export type Platform = 'web' | 'android' | 'ios';

export function usePlatform() {
  const [platform, setPlatform] = useState<Platform>('web');
  
  useEffect(() => {
    // Safely check for Capacitor
    try {
      if (
        window.Capacitor && 
        typeof window.Capacitor.isNativePlatform === 'function' && 
        window.Capacitor.isNativePlatform()
      ) {
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.indexOf('android') > -1) {
          console.log('Platform detected: android');
          setPlatform('android');
        } else if (
          userAgent.indexOf('iphone') > -1 || 
          userAgent.indexOf('ipad') > -1 || 
          (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
        ) {
          console.log('Platform detected: ios');
          setPlatform('ios');
        }
      } else {
        console.log('Platform detected: web');
      }
    } catch (error) {
      console.error('Error detecting platform:', error);
    }
  }, []);
  
  return platform;
}
