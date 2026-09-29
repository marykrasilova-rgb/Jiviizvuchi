import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mariakrasilova.musicdiary',
  appName: 'Мой музыкальный дневник',
  webDir: 'native-placeholder',
  server: {
    url: 'https://krasilova.com/app',
    cleartext: false,
    allowNavigation: [
      'krasilova.com',
      'uecdlqlwsrqmocbpgiwj.supabase.co',
      'esm.sh'
    ]
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile'
  },
  android: {
    allowMixedContent: false
  },
  plugins: {
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#f6f0ea'
    },
    Keyboard: {
      resize: 'body'
    }
  }
};

export default config;
