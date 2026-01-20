package com.example.alharischild;

import android.util.Log;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

public class BackendClient {

    private static final String TAG = "BackendClient";
    private static final String BASE_URL = "https://al-haris-production.up.railway.app";

    private static final int CONNECT_TIMEOUT_MS = 3000;
    private static final int READ_TIMEOUT_MS = 3000;

    public DomainDecision checkDomain(int childId, String domain) {
        HttpURLConnection conn = null;

        try {
            String encodedDomain = URLEncoder.encode(domain, "UTF-8");
            String urlStr = BASE_URL + "/child/" + childId + "/check?domain=" + encodedDomain;

            URL url = new URL(urlStr);
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(CONNECT_TIMEOUT_MS);
            conn.setReadTimeout(READ_TIMEOUT_MS);

            int code = conn.getResponseCode();
            BufferedReader br = new BufferedReader(new InputStreamReader(
                    code >= 200 && code < 300
                            ? conn.getInputStream()
                            : conn.getErrorStream(),
                    StandardCharsets.UTF_8
            ));

            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) sb.append(line);
            br.close();

            if (code < 200 || code >= 300) {
                Log.w(TAG, "checkDomain failed: " + code + " " + sb);
                return DomainDecision.unknown();
            }

            JSONObject json = new JSONObject(sb.toString());
            boolean blocked = json.optBoolean("blocked", false);
            String reason = json.isNull("reason") ? null : json.optString("reason", null);

            if (blocked) {
                return DomainDecision.blocked(reason);
            } else {
                return DomainDecision.allowed();
            }


        } catch (Exception e) {
            Log.e(TAG, "checkDomain exception", e);
            return DomainDecision.unknown();
        } finally {
            if (conn != null) conn.disconnect();
        }
    }

    public void sendReportAsync(int childId, String websiteUrl) {
        new Thread(() -> sendReport(childId, websiteUrl)).start();
    }

    private void sendReport(int childId, String websiteUrl) {
        HttpURLConnection conn = null;

        try {
            URL url = new URL(BASE_URL + "/child/report");

            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setConnectTimeout(CONNECT_TIMEOUT_MS);
            conn.setReadTimeout(READ_TIMEOUT_MS);
            conn.setDoOutput(true);
            conn.setRequestProperty("Content-Type", "application/json");

            JSONObject payload = new JSONObject();
            payload.put("child_id", childId);
            payload.put("website_url", websiteUrl);

            BufferedWriter writer = new BufferedWriter(
                    new OutputStreamWriter(conn.getOutputStream(), StandardCharsets.UTF_8)
            );
            writer.write(payload.toString());
            writer.flush();
            writer.close();

            int code = conn.getResponseCode();
            Log.d(TAG, "report sent, code=" + code);

        } catch (Exception e) {
            Log.e(TAG, "sendReport exception", e);
        } finally {
            if (conn != null) conn.disconnect();
        }
    }
}
