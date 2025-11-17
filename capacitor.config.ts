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
    // ✅ שלב 1: הגדרת URL Scheme
    App: {
      urlScheme: 'planora'
    },

    SplashScreen: {
      launchShowDuration: 5000, // משך זמן הצגת מסך הפתיחה (במילישניות)
      launchAutoHide: true, // מסך הפתיחה יוסתר אוטומטית
      backgroundColor: '#f09f27ff', // צבע רקע למסך הפתיחה
      androidSplashResourceName: 'splash', // שם קובץ התמונה באנדרואיד
      androidScaleType: 'CENTER_CROP', // אופן פריסת התמונה באנדרואיד
      showSpinner: true, // האם להציג ספינר טעינה
      spinnerColor: '#999999', // צבע הספינר
    },

    SocialLogin: {
      google: {
        webClientId: '741921128539-rmvupu979hlop84t4iucbbauhbcvqunl.apps.googleusercontent.com',
        androidClientId: '741921128539-7ils8fbtj0uoslqr26eslp2oaeq584pu.apps.googleusercontent.com',
        iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com'
        // scopes: ['profile','email']
      }
      // apple: { scopes: ['name','email'] }
    },

    OneSignal: { appId: '7f593882-9d51-45bc-b3ca-e17ee2d54a0d' }
  }
}

export default config
