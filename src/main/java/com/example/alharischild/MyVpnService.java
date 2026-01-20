package com.example.alharischild;

import android.annotation.SuppressLint;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.VpnService;
import android.os.Build;
import android.os.ParcelFileDescriptor;
import android.util.Log;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.nio.ByteBuffer;

public class MyVpnService extends VpnService {

    private static final String TAG = "MyVpnService";

    public static final String ACTION_STOP_VPN =
            "com.example.alharischild.ACTION_STOP_VPN";

    private ParcelFileDescriptor vpnInterface;
    private volatile boolean running;

    private BackendClient backendClient;
    private DomainDecisionCache cache;
    private SessionManager sessionManager;

    @SuppressLint("ForegroundServiceType")
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        if (intent != null && ACTION_STOP_VPN.equals(intent.getAction())) {
            Log.d(TAG, "STOP_VPN action received");
            stopVpnProperly();
            return START_NOT_STICKY;
        }

        running = true;
        startForeground(1, createNotification());

        sessionManager = new SessionManager(this);
        backendClient = new BackendClient();
        cache = new DomainDecisionCache(10 * 60 * 1000L); // 10 minutes

        Builder builder = new Builder();
        try {
            builder.setSession("AlHarisVPN")
                    .addAddress("10.0.0.2", 32)
                    .addRoute("0.0.0.0", 0)
                    .addDnsServer("1.1.1.1")
                    .addDisallowedApplication(getPackageName());
        } catch (PackageManager.NameNotFoundException e) {
            Log.e(TAG, "Failed to exclude app from VPN", e);
            stopSelf();
            return START_NOT_STICKY;
        }

        try {
            vpnInterface = builder.establish();
            if (vpnInterface == null) {
                Log.e(TAG, "VPN establish returned null");
                stopSelf();
                return START_NOT_STICKY;
            }

            Thread vpnThread =
                    new Thread(this::runVpn, "AlHaris-VPN-Thread");
            vpnThread.start();

            Log.d(TAG, "VPN Started");

        } catch (Exception e) {
            Log.e(TAG, "VPN Error", e);
            stopSelf();
        }

        return START_NOT_STICKY;
    }

    private void runVpn() {
        try (
                FileInputStream in =
                        new FileInputStream(vpnInterface.getFileDescriptor());
                FileOutputStream out =
                        new FileOutputStream(vpnInterface.getFileDescriptor())
        ) {
            ByteBuffer buffer = ByteBuffer.allocate(32767);

            Log.d(TAG, "VPN loop running...");

            while (running) {

                int childId = sessionManager.getChildId();
                if (childId <= 0) {
                    Log.w(TAG, "No childId found. Stopping VPN.");
                    stopVpnProperly();
                    break;
                }

                int length = in.read(buffer.array());
                if (length <= 0) {
                    buffer.clear();
                    continue;
                }

                if (isDnsPacket(buffer.array(), length)) {
                    String domain = extractDomain(buffer.array(), length);

                    if (domain != null && !domain.isEmpty()) {
                        domain = domain.toLowerCase();
                        Log.d(TAG, "DNS captured: " + domain);

                        DomainDecision decision = cache.get(domain);
                        if (decision == null) {
                            decision =
                                    backendClient.checkDomain(childId, domain);
                            cache.put(domain, decision);
                        }

                        if (!decision.unknown && decision.blocked) {
                            Log.d(TAG,
                                    "Blocked domain: " + domain +
                                            " reason=" + decision.reason);

                            if (!cache.isReportSent(domain)) {
                                backendClient.sendReportAsync(
                                        childId,
                                        "https://" + domain
                                );
                                cache.markReportSent(domain);
                            }

                            buffer.clear();
                            continue;
                        }
                    }
                }

                out.write(buffer.array(), 0, length);
                buffer.clear();
            }

        } catch (Exception e) {
            Log.e(TAG, "VPN loop error", e);
        }
    }

    private void stopVpnProperly() {
        Log.d(TAG, "Stopping VPN properly");

        running = false;

        try {
            if (vpnInterface != null) {
                vpnInterface.close();
                vpnInterface = null;
            }
        } catch (Exception ignored) {}

        stopForeground(true);
        stopSelf();
    }

    private boolean isDnsPacket(byte[] packet, int length) {
        if (length < 28) return false;
        int protocol = packet[9] & 0xFF;
        if (protocol != 17) return false;
        int destPort =
                ((packet[22] & 0xFF) << 8) | (packet[23] & 0xFF);
        return destPort == 53;
    }

    private String extractDomain(byte[] packet, int length) {
        try {
            int pos = 28;
            StringBuilder domain = new StringBuilder();

            while (pos < length) {
                int len = packet[pos++] & 0xFF;
                if (len == 0) break;
                if (domain.length() > 0) domain.append(".");
                for (int i = 0; i < len && pos < length; i++) {
                    domain.append((char) packet[pos++]);
                }
            }
            return domain.toString();
        } catch (Exception e) {
            return null;
        }
    }

    private Notification createNotification() {
        String channelId = "vpn";

        if (Build.VERSION.SDK_INT >= 26) {
            NotificationChannel channel =
                    new NotificationChannel(
                            channelId,
                            "VPN",
                            NotificationManager.IMPORTANCE_LOW
                    );
            getSystemService(NotificationManager.class)
                    .createNotificationChannel(channel);
        }

        return new Notification.Builder(this, channelId)
                .setContentTitle("Al-Haris Protection Active")
                .setSmallIcon(android.R.drawable.ic_lock_lock)
                .build();
    }

    @Override
    public void onDestroy() {
        Log.d(TAG, "onDestroy called");
        running = false;
        if (cache != null) cache.clear();
        stopForeground(true);
        super.onDestroy();
    }
}
