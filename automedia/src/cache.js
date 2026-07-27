export class MemoryCache {
  constructor() {
    this.values = new Map();
  }

  async get(key) {
    const entry = this.values.get(key);

    if (!entry || entry.expiresAt <= Date.now()) {
      this.values.delete(key);
      return null;
    }

    return entry.value;
  }

  async set(key, value, ttlMs = 3_600_000) {
    this.values.set(key, {
      value,
      expiresAt: Date.now() + ttlMs
    });
  }
}

export function cacheKey(namespace, value) {
  return `${namespace}:${JSON.stringify(value)}`;
}
