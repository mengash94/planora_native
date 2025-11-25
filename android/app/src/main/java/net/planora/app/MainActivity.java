package net.planora.app;

import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Bridge;

public class MainActivity extends BridgeActivity {
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setupSystemBars();
        
        // ✅ המתן לטעינת ה-Bridge ואז הזרק CSS
        Bridge bridge = getBridge();
        if (bridge != null) {
            bridge.getWebView().setWebViewClient(new android.webkit.WebViewClient() {
                @Override
                public void onPageFinished(WebView view, String url) {
                    super.onPageFinished(view, url);
                    injectSafeAreaCSS(view);
                }
            });
        }
    }
    
    @Override
    public void onResume() {
        super.onResume();
        setupSystemBars();
    }

    private void setupSystemBars() {
        Window window = getWindow();
        View decorView = window.getDecorView();
        
        // ✅ לבן אטום
        window.setStatusBarColor(Color.WHITE);
        window.setNavigationBarColor(Color.WHITE);
        
        // ✅ אייקונים כהים על רקע בהיר
        int flags = View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | 
                    View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
        decorView.setSystemUiVisibility(flags);
    }
    
    // ✅ הזרקת CSS לאתר החיצוני
    private void injectSafeAreaCSS(WebView webView) {
        String javascript = 
            "(function() {" +
            "  console.log('[Native] Injecting safe area CSS...');" +
            "  " +
            "  var style = document.createElement('style');" +
            "  style.id = 'native-safe-area-styles';" +
            "  style.innerHTML = `" +
            "    body {" +
            "      padding-bottom: 80px !important;" +
            "    }" +
            "    #root {" +
            "      padding-bottom: 80px !important;" +
            "    }" +
            "    @supports (padding: max(0px)) {" +
            "      body, #root {" +
            "        padding-bottom: max(80px, env(safe-area-inset-bottom)) !important;" +
            "      }" +
            "    }" +
            "  `;" +
            "  " +
            "  if (!document.getElementById('native-safe-area-styles')) {" +
            "    document.head.appendChild(style);" +
            "    console.log('[Native] ✅ Safe area CSS injected');" +
            "  }" +
            "})();";
        
        webView.evaluateJavascript(javascript, null);
    }
}