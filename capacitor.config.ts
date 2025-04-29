
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.a4413648b23646e994634337d830aa9a',
  appName: 'Myan VPN',
  webDir: 'dist',
  server: {
    url: 'https://a4413648-b236-46e9-9463-4337d830aa9a.lovableproject.com?forceHideBadge=true',
    cleartext: true,
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: true
  },
  ios: {
    limitsNavigationsToAppBoundDomains: true
  },
  bundledWebRuntime: false
};

export default config;
