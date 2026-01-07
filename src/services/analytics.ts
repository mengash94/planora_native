import { FirebaseAnalytics } from '@capacitor-firebase/analytics';

/**
 * רישום אירוע מותאם אישית ל-Firebase Analytics
 * @param name - שם האירוע
 * @param params - פרמטרים נוספים (אופציונלי)
 */
export async function logEvent(name: string, params?: Record<string, any>): Promise<void> {
  await FirebaseAnalytics.logEvent({ name, params });
}

/**
 * רישום מסך נוכחי ל-Firebase Analytics
 * @param screenName - שם המסך
 * @param screenClass - שם המחלקה (אופציונלי, לא נתמך ב-Capacitor plugin)
 */
export async function setCurrentScreen(screenName: string, screenClass?: string): Promise<void> {
  // Capacitor Firebase Analytics plugin תומך רק ב-screenName
  await FirebaseAnalytics.setCurrentScreen({ screenName });
}

/**
 * הגדרת מזהה משתמש ל-Firebase Analytics
 * @param userId - מזהה המשתמש
 */
export async function setUserId(userId: string): Promise<void> {
  await FirebaseAnalytics.setUserId({ userId });
}

/**
 * הגדרת מאפיין משתמש ל-Firebase Analytics
 * @param key - שם המאפיין
 * @param value - ערך המאפיין
 */
export async function setUserProperty(key: string, value: string): Promise<void> {
  await FirebaseAnalytics.setUserProperty({ key, value });
}

/**
 * איפוס נתוני Analytics (מחיקת מזהה משתמש ומאפיינים)
 */
export async function resetAnalyticsData(): Promise<void> {
  await FirebaseAnalytics.resetAnalyticsData();
}

/**
 * הפעלה/כיבוי של איסוף נתוני Analytics
 * @param enabled - האם לאפשר איסוף נתונים
 */
export async function setEnabled(enabled: boolean): Promise<void> {
  await FirebaseAnalytics.setEnabled({ enabled });
}

