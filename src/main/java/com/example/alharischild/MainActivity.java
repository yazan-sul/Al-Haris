package com.example.alharischild;

import android.app.admin.DevicePolicyManager;
import android.content.ComponentName;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.VpnService;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

public class MainActivity extends AppCompatActivity {

    public static final String ACTION_DISABLE_ADMIN = "disable_admin";

    private static final String PREF_NAME = "alharis_settings";
    private static final String KEY_PROTECTION = "protection_enabled";
    private static final int VPN_REQUEST_CODE = 100;

    private TextView statusText;
    private Button enableBtn;
    private Button disableBtn;
    private Button allowRemoveBtn;
    private Button demoBtn;

    private SharedPreferences prefs;
    private SessionManager session;

    private DevicePolicyManager dpm;
    private ComponentName adminComponent;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        session = new SessionManager(this);

        if (!session.isLoggedIn()) {
            startActivity(new Intent(this, LoginActivity.class));
            finish();
            return;
        }

        setContentView(R.layout.activity_main);

        prefs = getSharedPreferences(PREF_NAME, MODE_PRIVATE);

        statusText = findViewById(R.id.statusText);
        enableBtn = findViewById(R.id.enableBtn);
        disableBtn = findViewById(R.id.disableBtn);
        allowRemoveBtn = findViewById(R.id.allowRemoveBtn);
        demoBtn = findViewById(R.id.demoBtn);

        setupDeviceAdmin();
        updateStatus();

        if (!session.hasChildId()) {
            startActivity(new Intent(this, SelectChildActivity.class));
            finish();
            return;
        }

        enableBtn.setOnClickListener(v -> onEnableClicked());

        disableBtn.setOnClickListener(v ->
                requestReAuth(MyVpnService.ACTION_STOP_VPN)
        );

        allowRemoveBtn.setOnClickListener(v ->
                requestReAuth(ACTION_DISABLE_ADMIN)
        );

        demoBtn.setOnClickListener(v ->
                startActivity(new Intent(this, DemoBrowserActivity.class))
        );
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (!dpm.isAdminActive(adminComponent)) {
            Toast.makeText(this,
                    "Device admin is required",
                    Toast.LENGTH_LONG).show();
            finishAffinity();
        }

        updateStatus();
    }

    private void setupDeviceAdmin() {
        dpm = (DevicePolicyManager) getSystemService(DEVICE_POLICY_SERVICE);
        adminComponent = new ComponentName(this, MyDeviceAdminReceiver.class);

        if (!dpm.isAdminActive(adminComponent)) {
            Intent intent =
                    new Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN);
            intent.putExtra(
                    DevicePolicyManager.EXTRA_DEVICE_ADMIN,
                    adminComponent
            );
            intent.putExtra(
                    DevicePolicyManager.EXTRA_ADD_EXPLANATION,
                    "Device admin is required to prevent uninstallation."
            );
            startActivity(intent);
        }
    }

    private void onEnableClicked() {
        if (isProtectionEnabled()) {
            Toast.makeText(this,
                    "Protection already active",
                    Toast.LENGTH_SHORT).show();
            return;
        }

        Intent vpnIntent = VpnService.prepare(this);
        if (vpnIntent != null) {
            startActivityForResult(vpnIntent, VPN_REQUEST_CODE);
        } else {
            startVpn();
        }
    }

    @Override
    protected void onActivityResult(
            int requestCode, int resultCode, Intent data) {

        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == VPN_REQUEST_CODE && resultCode == RESULT_OK) {
            startVpn();
        }
    }

    private void startVpn() {
        ContextCompat.startForegroundService(
                this,
                new Intent(this, MyVpnService.class)
        );
        setProtection(true);
        updateStatus();
        Toast.makeText(this,
                "Protection enabled",
                Toast.LENGTH_SHORT).show();
    }


    private void requestReAuth(String action) {
        session.setPendingAction(action);
        startActivity(new Intent(this, LoginActivity.class));
    }

    private void setProtection(boolean enabled) {
        prefs.edit().putBoolean(KEY_PROTECTION, enabled).apply();
    }

    private boolean isProtectionEnabled() {
        return prefs.getBoolean(KEY_PROTECTION, false);
    }

    private void updateStatus() {
        boolean active = isProtectionEnabled();

        statusText.setText(
                active
                        ? "Protection Status: ACTIVE"
                        : "Protection Status: INACTIVE"
        );

        enableBtn.setEnabled(!active);
        disableBtn.setEnabled(active);

        statusText.setTextColor(
                ContextCompat.getColor(
                        this,
                        active
                                ? R.color.status_active
                                : R.color.status_inactive
                )
        );
    }
}
