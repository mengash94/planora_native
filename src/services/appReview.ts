import { InAppReview } from '@capacitor-community/in-app-review';

/**
 * מפתח לשמירת מספר הפעמים שהמשתמש השתמש באפליקציה
 */
const USAGE_COUNT_KEY = 'app_usage_count';
const REVIEW_SHOWN_KEY = 'review_prompt_shown';
const LAST_REVIEW_DATE_KEY = 'last_review_prompt_date';

/**
 * מספר השימושים לפני שמציעים לדרג
 */
const MIN_USAGE_FOR_REVIEW = 5;

/**
 * מספר ימים לחכות בין בקשות דירוג
 */
const DAYS_BETWEEN_PROMPTS = 30;

/**
 * בקשת דירוג מהמשתמש
 * משתמש ב-In-App Review API של Google/Apple
 * שים לב: ה-API עשוי לא להציג את הדיאלוג אם המשתמש כבר דירג או אם יש מגבלות
 */
export async function requestReview(): Promise<void> {
  try {
    await InAppReview.requestReview();
    console.log('[AppReview] Review dialog requested');
    
    // שמור שהוצגה בקשת דירוג
    localStorage.setItem(REVIEW_SHOWN_KEY, 'true');
    localStorage.setItem(LAST_REVIEW_DATE_KEY, Date.now().toString());
  } catch (e) {
    console.warn('[AppReview] Error requesting review:', e);
  }
}

/**
 * עדכון מונה השימושים
 * קרא בכל פעם שהמשתמש פותח את האפליקציה או עושה פעולה משמעותית
 */
export function incrementUsageCount(): number {
  const currentCount = parseInt(localStorage.getItem(USAGE_COUNT_KEY) || '0', 10);
  const newCount = currentCount + 1;
  localStorage.setItem(USAGE_COUNT_KEY, newCount.toString());
  return newCount;
}

/**
 * קבלת מספר השימושים הנוכחי
 */
export function getUsageCount(): number {
  return parseInt(localStorage.getItem(USAGE_COUNT_KEY) || '0', 10);
}

/**
 * בדיקה אם הגיע הזמן לבקש דירוג
 * מבוסס על מספר שימושים וזמן שעבר מהבקשה האחרונה
 */
export function shouldRequestReview(): boolean {
  const usageCount = getUsageCount();
  const reviewShown = localStorage.getItem(REVIEW_SHOWN_KEY) === 'true';
  const lastReviewDate = parseInt(localStorage.getItem(LAST_REVIEW_DATE_KEY) || '0', 10);
  
  // אם המשתמש לא השתמש מספיק, לא מבקשים
  if (usageCount < MIN_USAGE_FOR_REVIEW) {
    return false;
  }
  
  // אם מעולם לא ביקשנו, מבקשים
  if (!reviewShown) {
    return true;
  }
  
  // אם עברו מספיק ימים מהבקשה האחרונה, מבקשים שוב
  const daysSinceLastPrompt = (Date.now() - lastReviewDate) / (1000 * 60 * 60 * 24);
  if (daysSinceLastPrompt >= DAYS_BETWEEN_PROMPTS) {
    return true;
  }
  
  return false;
}

/**
 * בקשת דירוג חכמה - רק אם עומדים בתנאים
 * קרא אחרי פעולות חיוביות (יצירת אירוע מוצלחת, שליחת הזמנות וכו')
 */
export async function requestReviewIfAppropriate(): Promise<boolean> {
  if (shouldRequestReview()) {
    await requestReview();
    return true;
  }
  return false;
}

/**
 * איפוס מונה השימושים (לבדיקות)
 */
export function resetUsageCount(): void {
  localStorage.removeItem(USAGE_COUNT_KEY);
  localStorage.removeItem(REVIEW_SHOWN_KEY);
  localStorage.removeItem(LAST_REVIEW_DATE_KEY);
}

/**
 * פתיחת עמוד האפליקציה בחנות (fallback אם In-App Review לא עובד)
 */
export async function openStoreListing(): Promise<void> {
  const { Browser } = await import('@capacitor/browser');
  const { Capacitor } = await import('@capacitor/core');
  
  const platform = Capacitor.getPlatform();
  
  if (platform === 'android') {
    // Google Play Store
    await Browser.open({ 
      url: 'https://play.google.com/store/apps/details?id=net.planora.app' 
    });
  } else if (platform === 'ios') {
    // Apple App Store - החלף ב-App ID שלך
    await Browser.open({ 
      url: 'https://apps.apple.com/app/idXXXXXXXXXX' 
    });
  }
}

