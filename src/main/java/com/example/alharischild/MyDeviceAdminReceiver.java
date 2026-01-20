package com.example.alharischild;

import android.app.admin.DeviceAdminReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

public class MyDeviceAdminReceiver extends DeviceAdminReceiver {

    private static final String TAG = "DeviceAdmin";

    @Override
    public void onEnabled(Context context, Intent intent) {
        Log.d(TAG, "Device Admin enabled");
        Toast.makeText(
                context,
                "Parental protection enabled",
                Toast.LENGTH_SHORT
        ).show();
    }

    @Override
    public void onDisabled(Context context, Intent intent) {
        Log.w(TAG, "Device Admin disabled!");

        Toast.makeText(
                context,
                "Protection disabled! Parent login required.",
                Toast.LENGTH_LONG
        ).show();

        Intent i = new Intent(context, LoginActivity.class);
        i.addFlags(
                Intent.FLAG_ACTIVITY_NEW_TASK |
                        Intent.FLAG_ACTIVITY_CLEAR_TASK
        );
        context.startActivity(i);
    }
}
