import { FirebaseCrashlytics } from '@capacitor-firebase/crashlytics';

/**
 * רישום שגיאה ל-Firebase Crashlytics
 * @param message - תיאור השגיאה
 */
export async function logError(message: string): Promise<void> {
  try {
    await FirebaseCrashlytics.log({ message });
  } catch (e) {
    console.warn('[Crashlytics] logError failed:', e);
  }
}

/**
 * רישום חריגה (Exception) ל-Crashlytics
 * @param error - אובייקט השגיאה
 */
export async function recordException(error: Error | string): Promise<void> {
  try {
    const message = typeof error === 'string' ? error : error.message;
    await FirebaseCrashlytics.recordException({ message });
  } catch (e) {
    console.warn('[Crashlytics] recordException failed:', e);
  }
}

/**
 * הגדרת מזהה משתמש לדוחות קריסה
 * @param userId - מזהה המשתמש
 */
export async function setUserId(userId: string): Promise<void> {
  try {
    await FirebaseCrashlytics.setUserId({ userId });
  } catch (e) {
    console.warn('[Crashlytics] setUserId failed:', e);
  }
}

/**
 * הוספת מאפיין מותאם אישית לדוחות קריסה
 * @param key - שם המאפיין
 * @param value - ערך המאפיין
 */
export async function setCustomKey(key: string, value: string | number | boolean): Promise<void> {
  try {
    await FirebaseCrashlytics.setCustomKey({ 
      key, 
      value: String(value),
      type: typeof value === 'boolean' ? 'boolean' : typeof value === 'number' ? 'int' : 'string'
    });
  } catch (e) {
    console.warn('[Crashlytics] setCustomKey failed:', e);
  }
}

/**
 * הפעלה/כיבוי של איסוף דוחות קריסה
 * @param enabled - האם לאפשר איסוף
 */
export async function setCrashlyticsCollectionEnabled(enabled: boolean): Promise<void> {
  try {
    await FirebaseCrashlytics.setEnabled({ enabled });
  } catch (e) {
    console.warn('[Crashlytics] setEnabled failed:', e);
  }
}

/**
 * בדיקה האם Crashlytics מופעל
 */
export async function isCrashlyticsEnabled(): Promise<boolean> {
  try {
    const result = await FirebaseCrashlytics.isEnabled();
    return result.enabled;
  } catch (e) {
    console.warn('[Crashlytics] isEnabled failed:', e);
    return false;
  }
}

/**
 * גרימת קריסה מכוונת לבדיקת Crashlytics
 * ⚠️ לשימוש בפיתוח בלבד!
 */
export async function testCrash(): Promise<void> {
  try {
    await FirebaseCrashlytics.crash({ message: 'Test crash from Crashlytics' });
  } catch (e) {
    console.warn('[Crashlytics] crash failed:', e);
  }
}

/**
 * פונקציית עזר לעטיפת קוד עם דיווח שגיאות אוטומטי
 * @param fn - הפונקציה להרצה
 * @param context - הקשר לדיווח
 */
export async function withCrashReporting<T>(
  fn: () => Promise<T>,
  context: string
): Promise<T | null> {
  try {
    return await fn();
  } catch (error: any) {
    await logError(`Error in ${context}: ${error?.message || error}`);
    await recordException(error);
    throw error;
  }
}

