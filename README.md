# PlanOra — Capacitor v7 + @capgo/capacitor-social-login + @onesignal/capacitor-plugin

**מטרה:** Social Login נייטיב (Google+Apple) + Push דרך OneSignal, עם הגנות כדי שלא יהיו תקלות טעינה של פלאגין.

## 0) דרישות
- Node 18+, Android Studio/Xcode
- חשבון Google Cloud (OAuth Client IDs לאנדרואיד/iOS/ווב)
- חשבון Apple Developer (ל-iOS, כולל Sign in with Apple capability)
- חשבון OneSignal (App ID)

## 1) התקנה
```bash
npm i
npx cap init PlanOra net.planora.app --web-dir dist
npm run cap:add:android
npm run cap:add:ios
```

## 2) הגדרות plugin — **חשוב**
פתח `capacitor.config.ts` ועדכן:
```ts
plugins: {
  SocialLogin: {
    google: {
      webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
      androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
      iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
      scopes: ['profile','email']
    },
    apple: { scopes: ['name','email'] }
  },
  OneSignal: { appId: 'YOUR-ONESIGNAL-APP-ID' }
}
```
- iOS: ב-Xcode הפעל Capability: **Sign in with Apple**; הוסף URL Types ל-Google.
- Android: ודא שה-`androidClientId` תואם ושיש SHA נכונים ב-Google Cloud.

## 3) בנייה והרצה
```bash
npm run build
npm run cap:sync
npm run cap:open:android   # או :ios
```

## 4) למה לא יהיו תקלות טעינה של גוגל (Plugin)
- ממתינים ל-**capacitorready** (קובץ `env.ts`) טרם שימוש בפלאגינים.
- בודקים זמינות עם `Capacitor.isPluginAvailable('SocialLogin')` לפני כל קריאה (`services/social.ts`).
- אין טיימרים שרירותיים — אם אין פלאגין, תקבל שגיאה מיידית וברורה.

## 5) OneSignal
- SDK רשמי: `@onesignal/capacitor-plugin`.
- בקשת הרשאות בהתאם לפלטפורמה.
- קשרו externalId לאחר שיש `user.id` עם הכפתור "OneSignal link".

## 6) חיבור ל-InstaBack
לאחר `loginWithGoogle/loginWithApple`, שלחו את ה-`idToken`/`accessToken` ל-Endpoint שלכם ב-InstaBack
(למשל: `/auth/login/google-mobile`, `/auth/login/apple-mobile`). החזירו `user`/‏JWT/קוקי והכניסו ל-state.

## 7) טעינת האתר
`capacitor.config.ts` מוגדר לטעון `https://plan-ora.net`. אם תרצו, אפשר לבנות קבצים ל-local ולהסיר את `server.url`.

## 8) בדיקות מהירות
- בקונסול WebView: `window.Capacitor` קיים?
- Social plugin Loaded? ב-UI תראו: `Loaded`.
- לחצו Login with Google/Apple: אמור להיפתח זרם נייטיבי ולהחזיר token.
- OneSignal link: רק אחרי login, יקשר externalId.
