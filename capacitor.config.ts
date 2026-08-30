import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mariakrasilova.musicdiary',
  appName: 'Мой музыкальный дневник',
  webDir: 'native-placeholder',
  server: {
    url: 'https://mariakrasilovacom.vercel.app/app',
    cleartext: false,
    allowNavigation: [
      'mariakrasilovacom.vercel.app',
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
