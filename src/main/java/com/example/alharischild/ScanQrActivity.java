package com.example.alharischild;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.zxing.integration.android.IntentIntegrator;
import com.google.zxing.integration.android.IntentResult;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public class ScanQrActivity extends AppCompatActivity {

    private static final String BASE_URL =
            "https://al-haris-production.up.railway.app";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        IntentIntegrator integrator = new IntentIntegrator(this);
        integrator.setPrompt("Scan QR Code");
        integrator.setBeepEnabled(true);
        integrator.setOrientationLocked(true);
        integrator.initiateScan();
    }

    @Override
    protected void onActivityResult(
            int requestCode, int resultCode, Intent data) {

        IntentResult result =
                IntentIntegrator.parseActivityResult(
                        requestCode, resultCode, data);

        if (result != null && result.getContents() != null) {
            String qrToken = result.getContents();
            loginWithQr(qrToken);
        } else {
            super.onActivityResult(requestCode, resultCode, data);
            finish();
        }
    }

    private void loginWithQr(String qrToken) {

        new Thread(() -> {
            try {
                URL url = new URL(BASE_URL + "/auth/login-qr");
                HttpURLConnection conn =
                        (HttpURLConnection) url.openConnection();

                conn.setRequestMethod("POST");
                conn.setRequestProperty(
                        "Content-Type", "application/json"
                );
                conn.setDoOutput(true);

                JSONObject body = new JSONObject();
                body.put("token", qrToken);

                OutputStream os = conn.getOutputStream();
                os.write(body.toString().getBytes(StandardCharsets.UTF_8));
                os.close();

                if (conn.getResponseCode() == 200) {
                    BufferedReader br = new BufferedReader(
                            new InputStreamReader(conn.getInputStream())
                    );

                    StringBuilder sb = new StringBuilder();
                    String line;
                    while ((line = br.readLine()) != null) {
                        sb.append(line);
                    }

                    JSONObject json = new JSONObject(sb.toString());
                    String jwt = json.getString("access_token");

                    SessionManager session =
                            new SessionManager(this);
                    session.saveAuthSession(jwt);

                    runOnUiThread(() -> {
                        startActivity(
                                new Intent(
                                        this,
                                        SelectChildActivity.class
                                )
                        );
                        finish();
                    });

                } else {
                    throw new Exception();
                }

            } catch (Exception e) {
                runOnUiThread(() ->
                        Toast.makeText(
                                this,
                                "QR login failed",
                                Toast.LENGTH_SHORT
                        ).show()
                );
                finish();
            }
        }).start();
    }
}
