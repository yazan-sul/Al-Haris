package com.example.alharischild;

import android.content.Context;
import android.content.SharedPreferences;

public class SessionManager {

    private static final String PREF_NAME = "alharis_session";

    private static final String KEY_ACCESS_TOKEN = "access_token";
    private static final String KEY_LOGGED_IN = "logged_in";

    private static final String KEY_CHILD_ID = "child_id";

    private static final String KEY_PENDING_ACTION = "pending_action";


    private final SharedPreferences prefs;

    public SessionManager(Context context) {
        prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
    }


    public void saveAuthSession(String accessToken) {
        prefs.edit()
                .putString(KEY_ACCESS_TOKEN, accessToken)
                .putBoolean(KEY_LOGGED_IN, true)
                .apply();
    }

    public boolean isLoggedIn() {
        return prefs.getBoolean(KEY_LOGGED_IN, false)
                && getAccessToken() != null;
    }

    public String getAccessToken() {
        return prefs.getString(KEY_ACCESS_TOKEN, null);
    }

    public void clearAuth() {
        prefs.edit()
                .remove(KEY_ACCESS_TOKEN)
                .putBoolean(KEY_LOGGED_IN, false)
                .apply();
    }



    public void saveChildId(int childId) {
        prefs.edit().putInt(KEY_CHILD_ID, childId).apply();
    }

    public int getChildId() {
        return prefs.getInt(KEY_CHILD_ID, -1);
    }

    public boolean hasChildId() {
        return getChildId() > 0;
    }

    public void clearChild() {
        prefs.edit().remove(KEY_CHILD_ID).apply();
    }


    public void setPendingAction(String action) {
        prefs.edit().putString(KEY_PENDING_ACTION, action).apply();
    }

    public String getPendingAction() {
        return prefs.getString(KEY_PENDING_ACTION, null);
    }

    public void clearPendingAction() {
        prefs.edit().remove(KEY_PENDING_ACTION).apply();
    }

    public void logout() {
        prefs.edit().clear().apply();
    }
}
