package com.example.alharischild;

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

public class LoginActivity extends AppCompatActivity {

    private EditText emailInput;
    private EditText passwordInput;
    private Button loginBtn;

    private static final String BASE_URL =
            "https://al-haris-production.up.railway.app";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        emailInput = findViewById(R.id.usernameInput);
        passwordInput = findViewById(R.id.passwordInput);
        loginBtn = findViewById(R.id.loginBtn);

        loginBtn.setOnClickListener(v -> attemptLogin());

        Button qrLoginBtn = findViewById(R.id.qrLoginBtn);

        qrLoginBtn.setOnClickListener(v ->
                startActivity(
                        new Intent(this, ScanQrActivity.class)
                )
        );

    }



    private void attemptLogin() {

        String email = emailInput.getText().toString().trim();
        String password = passwordInput.getText().toString().trim();

        if (email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this,
                    "Enter email and password",
                    Toast.LENGTH_SHORT).show();
            return;
        }

        loginBtn.setEnabled(false);

        new Thread(() -> {

            HttpURLConnection conn = null;

            try {
                URL url = new URL(BASE_URL + "/auth/login");
                conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setConnectTimeout(5000);
                conn.setReadTimeout(5000);
                conn.setDoOutput(true);

                JSONObject body = new JSONObject();
                body.put("email", email);
                body.put("password", password);

                OutputStream os = conn.getOutputStream();
                os.write(body.toString().getBytes(StandardCharsets.UTF_8));
                os.flush();
                os.close();

                int code = conn.getResponseCode();

                BufferedReader br = new BufferedReader(
                        new InputStreamReader(
                                code >= 200 && code < 300
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

                if (code >= 200 && code < 300) {
                    runOnUiThread(() -> {

                        Toast.makeText(this,
                                "Verification code sent to email",
                                Toast.LENGTH_SHORT).show();

                        Intent i = new Intent(this, SetPinActivity.class);
                        i.putExtra("email", email);
                        startActivity(i);
                    });
                } else {
                    runOnUiThread(() ->
                            Toast.makeText(this,
                                    "Login failed",
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
                runOnUiThread(() -> loginBtn.setEnabled(true));
            }

        }).start();
    }
}
