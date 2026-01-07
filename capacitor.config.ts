import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'net.planora.app',
  appName: 'PlanOra',
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
    SplashScreen: {
      launchShowDuration: 3000,        // 3 שניות
      launchAutoHide: true,            // הסתרה אוטומטית
      backgroundColor: '#F59E0B',      // רקע כתום (כמו הלוגו)
      androidSplashResourceName: 'splash',
      androidScaleType: 'FIT_CENTER',  // לוגו ממורכז
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'light',              // ✅ אייקונים לבנים על רקע כתום
      backgroundColor: '#F59E0B',  // ✅ רקע כתום
      overlay: false               // ✅ לא overlay
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

    // ⚠️ AdMob מושבת זמנית - כדי להפעיל:
    // 1. לך ל-https://admob.google.com
    // 2. צור אפליקציה וקבל App ID
    // 3. הרץ: npm install @capacitor-community/admob@6.0.0 --legacy-peer-deps
    // 4. הסר את ההערה והחלף את ה-IDs:
    // AdMob: {
    //   appId: {
    //     android: 'ca-app-pub-XXXXX~YYYYY',
    //     ios: 'ca-app-pub-XXXXX~YYYYY'
    //   },
    //   initializeForTesting: false
    // }
  }
}

export default config
