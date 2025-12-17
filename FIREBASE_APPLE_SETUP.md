# הגדרת Firebase Auth עם Sign in with Apple ב-iOS

## ✅ מה כבר בוצע:

1. ✅ הותקן Firebase SDK (`firebase`)
2. ✅ נוסף Sign in with Apple capability ל-`App.entitlements`
3. ✅ עודכן `Podfile` להוסיף Firebase pods
4. ✅ עודכן `AppDelegate.swift` לאתחל Firebase
5. ✅ נוצר `src/services/firebase.ts` עם פונקציות Firebase Auth
6. ✅ עודכן `src/services/social.ts` להשתמש ב-Firebase Auth עם Sign in with Apple
7. ✅ עודכן `SocialProvider.tsx` להשתמש ב-Firebase User

## 📋 מה צריך לעשות עכשיו:

### 1. הורדת GoogleService-Info.plist המלא

**חשוב:** הקובץ `ios/App/App/GoogleService-Info.plist` הנוכחי לא מלא. צריך להוריד את הקובץ המלא מ-Firebase Console:

1. לך ל-[Firebase Console](https://console.firebase.google.com/)
2. בחר את הפרויקט `easypalnistaback`
3. לך ל-⚙️ Project Settings → General
4. גלול למטה ל-"Your apps"
5. מצא את האפליקציה iOS (`net.planora.app`)
6. לחץ על "Download GoogleService-Info.plist"
7. החלף את הקובץ ב-`ios/App/App/GoogleService-Info.plist`

הקובץ המלא צריך לכלול:
- `API_KEY`
- `GCM_SENDER_ID`
- `PROJECT_ID`
- `BUNDLE_ID`
- `GOOGLE_APP_ID`
- ועוד...

### 2. וידוא Sign in with Apple ב-Xcode

1. פתח את הפרויקט ב-Xcode:
   ```bash
   npm run cap:open:ios
   ```

2. בחר את ה-target "App" → Signing & Capabilities

3. ודא שיש:
   - ✅ **Sign in with Apple** capability (אמור להיות כבר)
   - ✅ **Push Notifications** capability
   - ✅ **Associated Domains** capability

4. אם אין "Sign in with Apple", לחץ על "+ Capability" והוסף אותו

### 3. התקנת Pods

הרץ את הפקודות הבאות:

```bash
cd ios/App
pod install
cd ../..
```

### 4. וידוא הגדרות Firebase Console

1. לך ל-Firebase Console → Authentication → Sign-in method
2. ודא ש-**Apple** מופעל כ-Sign-in provider
3. אם לא, לחץ על "Apple" והפעל אותו

### 5. בנייה ובדיקה

```bash
npm run build
npm run cap:sync
npm run cap:open:ios
```

ב-Xcode:
- בחר Device או Simulator
- לחץ על Run (⌘R)
- נסה להתחבר עם Sign in with Apple

## 🔍 איך זה עובד:

1. המשתמש לוחץ על "Sign in with Apple"
2. `@capgo/capacitor-social-login` מציג את ה-Apple Sign In dialog
3. Apple מחזיר `idToken`
4. הקוד ב-`src/services/social.ts` קורא ל-`signInWithAppleIdToken(idToken)`
5. Firebase Auth מאמת את ה-token מול Apple
6. Firebase מחזיר `FirebaseUser` עם `uid`, `email`, וכו'
7. המשתמש מחובר!

## ⚠️ הערות חשובות:

- **Apple Review Guidelines**: Apple דורש שכל אפליקציה שמשתמשת ב-Sign in with Apple תציע אותו כחלופה ל-Apple ID. אם יש לך Google Sign In, ודא שגם Apple Sign In זמין.

- **Firebase Console**: ודא שהגדרת את Sign in with Apple ב-Firebase Console. זה דורש:
  - App ID מ-Apple Developer Portal
  - Service ID (אופציונלי, אבל מומלץ)

- **Testing**: בדוק על מכשיר אמיתי, לא רק Simulator, כי Sign in with Apple לא עובד ב-Simulator.

## 🐛 פתרון בעיות:

### שגיאה: "Firebase not initialized"
- ודא ש-`FirebaseApp.configure()` נקרא ב-`AppDelegate.swift`
- ודא ש-`GoogleService-Info.plist` נמצא ב-`ios/App/App/` והוא מלא

### שגיאה: "No Apple ID token received"
- ודא ש-Sign in with Apple capability מופעל ב-Xcode
- ודא שהמשתמש התחבר בהצלחה דרך Apple

### שגיאה: "Firebase authentication failed"
- ודא ש-Apple מופעל ב-Firebase Console → Authentication → Sign-in method
- בדוק את ה-logs ב-Xcode Console לפרטים נוספים

## 📚 משאבים:

- [Firebase Auth - Apple](https://firebase.google.com/docs/auth/ios/apple)
- [Sign in with Apple - Apple Developer](https://developer.apple.com/sign-in-with-apple/)
- [Capacitor Social Login](https://github.com/Cap-go/capacitor-social-login)

