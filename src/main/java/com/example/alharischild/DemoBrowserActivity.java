package com.example.alharischild;

import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

public class DemoBrowserActivity extends AppCompatActivity {

    private EditText urlInput;
    private Button goBtn;
    private TextView resultText;
    private WebView webView;

    private BackendClient backendClient;
    private SessionManager session;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        session = new SessionManager(this);

        if (!session.isLoggedIn()) {
            startActivity(new Intent(this, LoginActivity.class));
            finish();
            return;
        }

        setContentView(R.layout.activity_demo_browser);

        urlInput = findViewById(R.id.urlInput);
        goBtn = findViewById(R.id.goBtn);
        resultText = findViewById(R.id.resultText);
        webView = findViewById(R.id.webView);

        backendClient = new BackendClient();

        webView.getSettings().setJavaScriptEnabled(true);
        webView.setWebViewClient(new WebViewClient());

        goBtn.setOnClickListener(v -> checkAndLoad());
    }

    private void checkAndLoad() {

        int childId = session.getChildId();
        if (childId <= 0) {
            Toast.makeText(
                    this,
                    "No child selected. Please select a child first.",
                    Toast.LENGTH_LONG
            ).show();
            return;
        }

        String input = urlInput.getText().toString().trim();
        if (input.isEmpty()) {
            Toast.makeText(this, "Enter a URL", Toast.LENGTH_SHORT).show();
            return;
        }

        String url = input.startsWith("http://") || input.startsWith("https://")
                ? input
                : "https://" + input;

        String domain = extractDomain(url);
        if (domain == null || domain.isEmpty()) {
            Toast.makeText(this, "Invalid URL", Toast.LENGTH_SHORT).show();
            return;
        }

        SharedPreferences prefs =
                getSharedPreferences("alharis_settings", MODE_PRIVATE);

        boolean protectionEnabled =
                prefs.getBoolean("protection_enabled", false);

        if (!protectionEnabled) {
            resultText.setText("Protection OFF — site allowed");
            webView.loadUrl(url);
            return;
        }

        resultText.setText("Checking: " + domain + " ...");

        new Thread(() -> {

            DomainDecision decision =
                    backendClient.checkDomain(childId, domain);

            runOnUiThread(() -> {

                if (decision.unknown) {
                    resultText.setText("Backend: UNKNOWN");
                    Toast.makeText(
                            this,
                            "Backend unreachable",
                            Toast.LENGTH_SHORT
                    ).show();
                    return;
                }

                if (decision.blocked) {
                    resultText.setText(
                            "BLOCKED ✅  reason: " + decision.reason
                    );

                    backendClient.sendReportAsync(childId, url);

                    webView.loadData(
                            "<h2>Blocked</h2>" +
                                    "<p>This website is blocked (" +
                                    decision.reason +
                                    ")</p>",
                            "text/html",
                            "UTF-8"
                    );
                } else {
                    resultText.setText("ALLOWED ✅");
                    webView.loadUrl(url);
                }
            });

        }).start();
    }

    private String extractDomain(String url) {
        try {
            Uri uri = Uri.parse(url);
            String host = uri.getHost();
            if (host == null) return null;

            if (host.startsWith("www.")) {
                host = host.substring(4);
            }
            return host.toLowerCase();
        } catch (Exception e) {
            return null;
        }
    }
}
