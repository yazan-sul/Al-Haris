package com.example.alharischild;

public class DomainDecision {

    public final boolean blocked;
    public final String reason;
    public final boolean unknown;

    private DomainDecision(boolean blocked, String reason, boolean unknown) {
        this.blocked = blocked;
        this.reason = reason;
        this.unknown = unknown;
    }

    public static DomainDecision blocked(String reason) {
        return new DomainDecision(true, reason, false);
    }

    public static DomainDecision allowed() {
        return new DomainDecision(false, null, false);
    }

    public static DomainDecision unknown() {
        return new DomainDecision(false, null, true);
    }

    public boolean isBlocked() {
        return !unknown && blocked;
    }

    public boolean isAllowed() {
        return !unknown && !blocked;
    }
}
