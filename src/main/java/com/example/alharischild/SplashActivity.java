package com.example.alharischild;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

public class SplashActivity extends AppCompatActivity {

    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        sessionManager = new SessionManager(this);
        navigate();
    }

    private void navigate() {
        Intent intent;

        if (!sessionManager.isLoggedIn()) {
            intent = new Intent(this, LoginActivity.class);

        } else if (!sessionManager.hasChildId()) {
            intent = new Intent(this, SelectChildActivity.class);

        } else {
            intent = new Intent(this, MainActivity.class);
        }

        startActivity(intent);
        finish();
    }
}
