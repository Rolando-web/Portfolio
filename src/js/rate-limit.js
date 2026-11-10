const memoryStore = new Map();

function readState(key) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return memoryStore.get(key) || null;
    return JSON.parse(raw);
  } catch {
    return memoryStore.get(key) || null;
  }
}

function writeState(key, state) {
  memoryStore.set(key, state);
  try {
    window.localStorage.setItem(key, JSON.stringify(state));
  } catch {
    /* storage blocked — memory fallback stays authoritative */
  }
}

/**
 * Client-side throttle for outbound requests (EmailJS, etc.).
 * Not a security boundary on its own — pair with provider-side origin rules.
 */
export function createRateLimiter({
  key,
  cooldownMs = 60_000,
  windowMs = 10 * 60_000,
  maxInWindow = 3,
} = {}) {
  if (!key) throw new Error("createRateLimiter requires a key");

  function status(now = Date.now()) {
    const state = readState(key) || {};
    const lastAt = Number(state.lastAt) || 0;
    const hits = Array.isArray(state.hits)
      ? state.hits.filter((hit) => now - hit < windowMs)
      : [];

    const cooldownRemaining = Math.max(0, lastAt + cooldownMs - now);
    const windowRemaining =
      hits.length >= maxInWindow
        ? Math.max(0, hits[0] + windowMs - now)
        : 0;

    if (hits.length >= maxInWindow) {
      return {
        allowed: false,
        reason: "window",
        retryAfterMs: windowRemaining,
        remainingInWindow: 0,
      };
    }

    if (cooldownRemaining > 0) {
      return {
        allowed: false,
        reason: "cooldown",
        retryAfterMs: cooldownRemaining,
        remainingInWindow: maxInWindow - hits.length,
      };
    }

    return {
      allowed: true,
      reason: null,
      retryAfterMs: 0,
      remainingInWindow: maxInWindow - hits.length,
    };
  }

  function record(now = Date.now()) {
    const state = readState(key) || {};
    const hits = Array.isArray(state.hits)
      ? state.hits.filter((hit) => now - hit < windowMs)
      : [];

    writeState(key, {
      lastAt: now,
      hits: [...hits, now].slice(-maxInWindow),
    });
  }

  function reset() {
    memoryStore.delete(key);
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }

  return { status, record, reset };
}

export function formatWait(ms) {
  const seconds = Math.ceil(Math.max(0, ms) / 1000);
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return rest ? `${minutes}m ${rest}s` : `${minutes}m`;
}
