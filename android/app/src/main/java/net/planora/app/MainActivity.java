

// package net.planora.app;

// import android.os.Bundle;
// import android.view.View;
// import android.view.Window;
// import android.view.WindowManager;
// import android.view.ViewGroup;

// import androidx.core.content.ContextCompat;
// import androidx.core.view.ViewCompat;
// import androidx.core.view.WindowCompat;
// import androidx.core.view.WindowInsetsCompat;
// import androidx.core.view.WindowInsetsControllerCompat; // הוספנו את זה
// import androidx.core.graphics.Insets;

// import com.getcapacitor.BridgeActivity;

// public class MainActivity extends BridgeActivity {
//     @Override
//     public void onCreate(Bundle savedInstanceState) {
//         super.onCreate(savedInstanceState);

//         Window window = getWindow();
//         window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        
//         // צבע הסטטוס בר (למעלה) נשאר כתום חזק
//         window.setStatusBarColor(ContextCompat.getColor(this, R.color.status_bar));

//         // ✅ שינוי 1: שימוש בצבע הכתום העדין שהגדרנו למטה
//         window.setNavigationBarColor(ContextCompat.getColor(this, R.color.navigation_bar_subtle));

//         // ✅ שינוי 2: הגדרת אייקונים כהים בפס הניווט (כדי שיראו אותם על הכתום הבהיר)
//         WindowInsetsControllerCompat windowInsetsController =
//                 WindowCompat.getInsetsController(window, window.getDecorView());
//         windowInsetsController.setAppearanceLightNavigationBars(true);

//         // ביטול כניסת התוכן מתחת לברים
//         WindowCompat.setDecorFitsSystemWindows(window, true);

//         // הקוד שמוסיף Padding ידני (מהתיקון הקודם) - נשאר ללא שינוי
//         View rootView = findViewById(android.R.id.content);
//         ViewCompat.setOnApplyWindowInsetsListener(rootView, (v, windowInsets) -> {
//             Insets insets = windowInsets.getInsets(WindowInsetsCompat.Type.systemBars());
//             ViewGroup.MarginLayoutParams mlp = (ViewGroup.MarginLayoutParams) v.getLayoutParams();
//             mlp.leftMargin = insets.left;
//             mlp.bottomMargin = insets.bottom;
//             mlp.rightMargin = insets.right;
//             mlp.topMargin = insets.top;
//             v.setLayoutParams(mlp);
//             return WindowInsetsCompat.CONSUMED;
//         });
//     }
// }

package net.planora.app;

import android.os.Bundle;
import android.view.Window;
import android.view.WindowManager;

import androidx.core.content.ContextCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat; 

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Window window = getWindow();

        // 1. כפיית אטימות ומניעת שקיפות
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS | WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        
        // 2. הגדרת צבעים לשחור מלא
        window.setStatusBarColor(ContextCompat.getColor(this, R.color.status_bar));
        window.setNavigationBarColor(ContextCompat.getColor(this, R.color.navigation_bar_subtle)); 
        
        // 3. ביטול Edge-to-Edge
        WindowCompat.setDecorFitsSystemWindows(window, true);
        
        // 4. ✅ קריטי: כפיית אייקונים לבנים (Light) על רקע שחור
        WindowInsetsControllerCompat windowInsetsController =
                WindowCompat.getInsetsController(window, window.getDecorView());

        // הגדרה ל-false מבטיחה אייקונים לבנים (Light)
        windowInsetsController.setAppearanceLightStatusBars(true); 
        windowInsetsController.setAppearanceLightNavigationBars(true);
    }
}