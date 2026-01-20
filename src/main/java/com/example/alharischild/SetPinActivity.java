package com.example.alharischild;

import android.app.admin.DevicePolicyManager;
import android.content.ComponentName;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public class SetPinActivity extends AppCompatActivity {

    private EditText codeInput;
    private Button verifyBtn;
    private SessionManager sessionManager;

    private static final String BASE_URL =
            "https://al-haris-production.up.railway.app";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_set_pin);

        sessionManager = new SessionManager(this);

        codeInput = findViewById(R.id.pinInput);
        verifyBtn = findViewById(R.id.savePinBtn);

        String email = getIntent().getStringExtra("email");
        if (email == null) {
            Toast.makeText(this,
                    "Missing email",
                    Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        verifyBtn.setOnClickListener(v ->
                verifyCode(email)
        );
    }

    private void verifyCode(String email) {

        String code = codeInput.getText().toString().trim();

        if (code.isEmpty()) {
            Toast.makeText(this,
                    "Enter verification code",
                    Toast.LENGTH_SHORT).show();
            return;
        }

        verifyBtn.setEnabled(false);

        new Thread(() -> {

            HttpURLConnection conn = null;

            try {
                URL url = new URL(BASE_URL + "/auth/verify");
                conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setConnectTimeout(5000);
                conn.setReadTimeout(5000);
                conn.setDoOutput(true);

                JSONObject body = new JSONObject();
                body.put("email", email);
                body.put("code", code);

                OutputStream os = conn.getOutputStream();
                os.write(body.toString().getBytes(StandardCharsets.UTF_8));
                os.flush();
                os.close();

                int responseCode = conn.getResponseCode();

                BufferedReader br = new BufferedReader(
                        new InputStreamReader(
                                responseCode >= 200 && responseCode < 300
                                        ? conn.getInputStream()
                                        : conn.getErrorStream(),
                                StandardCharsets.UTF_8
                        )
                );

                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    sb.append(line);
                }
                br.close();

                if (responseCode >= 200 && responseCode < 300) {

                    JSONObject json = new JSONObject(sb.toString());
                    String token = json.getString("access_token");

                    sessionManager.saveAuthSession(token);

                    runOnUiThread(() -> {
                        Toast.makeText(this,
                                "Verification successful",
                                Toast.LENGTH_SHORT).show();

                        handlePostVerification();
                    });

                } else {
                    runOnUiThread(() ->
                            Toast.makeText(this,
                                    "Invalid verification code",
                                    Toast.LENGTH_SHORT).show()
                    );
                }

            } catch (Exception e) {
                runOnUiThread(() ->
                        Toast.makeText(this,
                                "Network error",
                                Toast.LENGTH_SHORT).show()
                );
            } finally {
                if (conn != null) conn.disconnect();
                runOnUiThread(() -> verifyBtn.setEnabled(true));
            }

        }).start();
    }

    private void handlePostVerification() {

        String pendingAction = sessionManager.getPendingAction();

        if (MyVpnService.ACTION_STOP_VPN.equals(pendingAction)) {

            Intent stopIntent = new Intent(this, MyVpnService.class);
            stopIntent.setAction(MyVpnService.ACTION_STOP_VPN);
            startService(stopIntent);

            getSharedPreferences("alharis_settings", MODE_PRIVATE)
                    .edit()
                    .putBoolean("protection_enabled", false)
                    .apply();
        }

        if (MainActivity.ACTION_DISABLE_ADMIN.equals(pendingAction)) {
            DevicePolicyManager dpm =
                    (DevicePolicyManager) getSystemService(DEVICE_POLICY_SERVICE);
            ComponentName admin =
                    new ComponentName(this, MyDeviceAdminReceiver.class);
            if (dpm != null && dpm.isAdminActive(admin)) {
                dpm.removeActiveAdmin(admin);
            }

        }

        sessionManager.clearPendingAction();

        Intent next;
        if (!sessionManager.hasChildId()) {
            next = new Intent(this, SelectChildActivity.class);
        } else {
            next = new Intent(this, MainActivity.class);
        }

        startActivity(next);
        finishAffinity();
    }
}
