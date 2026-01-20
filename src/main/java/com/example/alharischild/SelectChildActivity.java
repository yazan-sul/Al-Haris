package com.example.alharischild;

import android.content.Intent;
import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;

public class SelectChildActivity extends AppCompatActivity {

    private static final String BASE_URL =
            "https://al-haris-production.up.railway.app";

    private SessionManager sessionManager;

    private ListView listView;

    private final HashMap<Integer, Integer> childIdMap = new HashMap<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        sessionManager = new SessionManager(this);

        if (!sessionManager.isLoggedIn()) {
            startActivity(new Intent(this, LoginActivity.class));
            finish();
            return;
        }

        setContentView(R.layout.activity_select_child);

        listView = findViewById(R.id.childrenList);

        fetchChildren();
    }

    private void fetchChildren() {

        new Thread(() -> {

            HttpURLConnection conn = null;

            try {
                URL url = new URL(BASE_URL + "/parent/children");
                conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setRequestProperty(
                        "Authorization",
                        "Bearer " + sessionManager.getAccessToken()
                );
                conn.setConnectTimeout(5000);
                conn.setReadTimeout(5000);

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
                    parseChildren(sb.toString());
                } else {
                    runOnUiThread(() ->
                            Toast.makeText(this,
                                    "Failed to load children",
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
            }

        }).start();
    }

    private void parseChildren(String jsonStr) {

        try {
            JSONObject json = new JSONObject(jsonStr);
            JSONArray children = json.getJSONArray("children");

            ArrayList<String> displayList = new ArrayList<>();

            for (int i = 0; i < children.length(); i++) {
                JSONObject child = children.getJSONObject(i);

                int id = child.getInt("id");
                String name = child.getString("name");
                String device = child.optString("device_name", "Unknown device");

                displayList.add(name + " (" + device + ")");
                childIdMap.put(i, id);
            }

            runOnUiThread(() -> {
                ArrayAdapter<String> adapter =
                        new ArrayAdapter<>(
                                this,
                                android.R.layout.simple_list_item_1,
                                displayList
                        );

                listView.setAdapter(adapter);

                listView.setOnItemClickListener((p, v, pos, id) -> {
                    int childId = childIdMap.get(pos);
                    sessionManager.saveChildId(childId);

                    Toast.makeText(this,
                            "Child selected",
                            Toast.LENGTH_SHORT).show();

                    startActivity(
                            new Intent(this, MainActivity.class)
                    );
                    finishAffinity();
                });
            });

        } catch (Exception e) {
            runOnUiThread(() ->
                    Toast.makeText(this,
                            "Invalid response",
                            Toast.LENGTH_SHORT).show()
            );
        }
    }
}
