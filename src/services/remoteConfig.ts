import { FirebaseRemoteConfig } from '@capacitor-firebase/remote-config';

/**
 * ערכי ברירת מחדל - ישמשו אם אין חיבור לאינטרנט
 */
const DEFAULT_VALUES: Record<string, string | number | boolean> = {
  // פיצ'רים
  enable_new_feature: false,
  enable_chat: true,
  
  // טקסטים
  welcome_message: 'ברוכים הבאים ל-PlanOra!',
  promo_banner: '',
  
  // גרסאות
  min_version: '1.0.0',
  force_update: false,
  
  // הגדרות
  max_event_participants: 100,
  free_events_limit: 5,
};

/**
 * אתחול Remote Config עם ערכי ברירת מחדל
 */
export async function initRemoteConfig(): Promise<void> {
  try {
    // הגדרת ערכי ברירת מחדל
    await FirebaseRemoteConfig.setDefaults({ defaults: DEFAULT_VALUES });
    
    // הגדרת זמן מינימום בין עדכונים (בשניות)
    await FirebaseRemoteConfig.setMinimumFetchInterval({ minimumFetchIntervalInSeconds: 3600 }); // שעה
    
    // משיכת ערכים מהשרת
    await FirebaseRemoteConfig.fetchAndActivate();
    
    console.log('[RemoteConfig] Initialized successfully');
  } catch (e) {
    console.warn('[RemoteConfig] Init error:', e);
  }
}

/**
 * קבלת ערך מחרוזת
 */
export async function getString(key: string): Promise<string> {
  try {
    const result = await FirebaseRemoteConfig.getString({ key });
    return result.value;
  } catch (e) {
    return String(DEFAULT_VALUES[key] || '');
  }
}

/**
 * קבלת ערך מספרי
 */
export async function getNumber(key: string): Promise<number> {
  try {
    const result = await FirebaseRemoteConfig.getNumber({ key });
    return result.value;
  } catch (e) {
    return Number(DEFAULT_VALUES[key] || 0);
  }
}

/**
 * קבלת ערך בוליאני
 */
export async function getBoolean(key: string): Promise<boolean> {
  try {
    const result = await FirebaseRemoteConfig.getBoolean({ key });
    return result.value;
  } catch (e) {
    return Boolean(DEFAULT_VALUES[key] || false);
  }
}

/**
 * רענון ערכים מהשרת
 */
export async function refresh(): Promise<void> {
  try {
    await FirebaseRemoteConfig.fetchAndActivate();
  } catch (e) {
    console.warn('[RemoteConfig] Refresh error:', e);
  }
}

/**
 * בדיקה האם צריך לעדכן את האפליקציה
 */
export async function checkForceUpdate(currentVersion: string): Promise<{
  needsUpdate: boolean;
  forceUpdate: boolean;
  minVersion: string;
}> {
  const minVersion = await getString('min_version');
  const forceUpdate = await getBoolean('force_update');
  
  const needsUpdate = compareVersions(currentVersion, minVersion) < 0;
  
  return { needsUpdate, forceUpdate: needsUpdate && forceUpdate, minVersion };
}

/**
 * השוואת גרסאות (מחזיר -1 אם v1 < v2, 0 אם שווים, 1 אם v1 > v2)
 */
function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    if (p1 < p2) return -1;
    if (p1 > p2) return 1;
  }
  return 0;
}

