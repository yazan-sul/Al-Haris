package com.example.alharischild;

import java.util.concurrent.ConcurrentHashMap;

public class DomainDecisionCache {
    private static class Entry {
        final DomainDecision decision;
        final long expiresAt;
        boolean reportSent;

        Entry(DomainDecision decision, long expiresAt) {
            this.decision = decision;
            this.expiresAt = expiresAt;
            this.reportSent = false;
        }
    }

    private final ConcurrentHashMap<String, Entry> map = new ConcurrentHashMap<>();
    private final long ttlMs;

    public DomainDecisionCache(long ttlMs) {
        this.ttlMs = ttlMs;
    }

    public DomainDecision get(String domain) {
        domain = normalize(domain);
        Entry e = map.get(domain);
        if (e == null) return null;

        if (System.currentTimeMillis() > e.expiresAt) {
            map.remove(domain);
            return null;
        }
        return e.decision;
    }

    public boolean isReportSent(String domain) {
        domain = normalize(domain);
        Entry e = map.get(domain);
        return e != null && e.reportSent;
    }

    public void markReportSent(String domain) {
        domain = normalize(domain);
        Entry e = map.get(domain);
        if (e != null) e.reportSent = true;
    }

    public void put(String domain, DomainDecision decision) {
        domain = normalize(domain);
        map.put(domain, new Entry(decision,
                System.currentTimeMillis() + ttlMs));
    }

    public void clear() {
        map.clear();
    }

    private String normalize(String domain) {
        return domain == null ? "" : domain.toLowerCase();
    }
}
