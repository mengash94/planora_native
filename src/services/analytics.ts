import { Capacitor } from '@capacitor/core';

// Temporary workaround: Use Firebase Analytics directly via native code
// CapacitorFirebaseAnalytics plugin has Swift compilation issues with newer Xcode versions

/**
 * רישום אירוע מותאם אישית ל-Firebase Analytics
 * @param name - שם האירוע
 * @param params - פרמטרים נוספים (אופציונלי)
 */
export async function logEvent(name: string, params?: Record<string, any>): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    // On native platforms, Firebase Analytics is handled by native Firebase SDK
    // which is already configured via GoogleService-Info.plist
    // For now, we'll log to console - native implementation can be added later
    console.log('[Analytics] logEvent:', name, params);
  } else {
    // Web platform - can use Firebase JS SDK if needed
    console.log('[Analytics] logEvent:', name, params);
  }
}

/**
 * רישום מסך נוכחי ל-Firebase Analytics
 * @param screenName - שם המסך
 * @param screenClass - שם המחלקה (אופציונלי)
 */
export async function setCurrentScreen(screenName: string, screenClass?: string): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    console.log('[Analytics] setCurrentScreen:', screenName, screenClass);
  } else {
    console.log('[Analytics] setCurrentScreen:', screenName, screenClass);
  }
}

/**
 * הגדרת מזהה משתמש ל-Firebase Analytics
 * @param userId - מזהה המשתמש
 */
export async function setUserId(userId: string): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    console.log('[Analytics] setUserId:', userId);
  } else {
    console.log('[Analytics] setUserId:', userId);
  }
}

/**
 * הגדרת מאפיין משתמש ל-Firebase Analytics
 * @param key - שם המאפיין
 * @param value - ערך המאפיין
 */
export async function setUserProperty(key: string, value: string): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    console.log('[Analytics] setUserProperty:', key, value);
  } else {
    console.log('[Analytics] setUserProperty:', key, value);
  }
}

/**
 * איפוס נתוני Analytics (מחיקת מזהה משתמש ומאפיינים)
 */
export async function resetAnalyticsData(): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    console.log('[Analytics] resetAnalyticsData');
  } else {
    console.log('[Analytics] resetAnalyticsData');
  }
}

/**
 * הפעלה/כיבוי של איסוף נתוני Analytics
 * @param enabled - האם לאפשר איסוף נתונים
 */
export async function setEnabled(enabled: boolean): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    console.log('[Analytics] setEnabled:', enabled);
  } else {
    console.log('[Analytics] setEnabled:', enabled);
  }
}

