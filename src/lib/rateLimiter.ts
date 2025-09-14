type RateLimitEntry = {
    count: number
    lastReset: number
};

const RATE_LIMIT_WINDOW = 60*1000;
const MAX_REQUESTS = 10

const store = new Map<string, RateLimitEntry>()

export function rateLimit(key: string) {
    const now = Date.now()
    const entry = store.get(key)

    if (!entry) {
        store.set(key, { count: 1, lastReset: now });
        return { success: true };
    }

    if (now - entry.lastReset > RATE_LIMIT_WINDOW) {
        store.set(key, { count: 1, lastReset: now });
        return { success: true };
    }

    if (entry.count >= MAX_REQUESTS) {
        return { success: false, retryAfter: RATE_LIMIT_WINDOW - (now - entry.lastReset) };
    }

    entry.count++;
    store.set(key, entry);
    return { success: true };
}