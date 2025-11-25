import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'net.planora.app',
  appName: 'PlanOra-אירוע זה קל!',
  webDir: 'dist',
  server: {
    url: 'https://plan-ora.net',
    cleartext: false,
    errorPath: 'error.html'
  },
  android: { allowMixedContent: true },
  plugins: {
    App: {
      urlScheme: 'planora'
    },
    StatusBar: {
      style: 'light',              // ✅ אייקונים כהים
      backgroundColor: '#FFFFFF',   // ✅ רקע לבן
      overlay: false                // ✅ לא overlay
    },
    SocialLogin: {
      google: {
        webClientId: '741921128539-rmvupu979hlop84t4iucbbauhbcvqunl.apps.googleusercontent.com',
        androidClientId: '741921128539-7ils8fbtj0uoslqr26eslp2oaeq584pu.apps.googleusercontent.com',
        iosClientId: '741921128539-vs2vnn0o29hjhietd777ocrnebe7759u.apps.googleusercontent.com'
        // scopes: ['profile','email']
      }
      // apple: { scopes: ['name','email'] }
    },

    OneSignal: { appId: '7f593882-9d51-45bc-b3ca-e17ee2d54a0d' }
  }
}

export default config
