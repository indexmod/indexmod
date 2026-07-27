import { cacheKey } from "../cache.js";
import { validateLicense } from "../licenses.js";

const endpoint = "https://commons.wikimedia.org/w/api.php";

export class WikimediaCommonsProvider {
  constructor({ fetchImpl = fetch, cache = null } = {}) {
    this.fetchImpl = fetchImpl;
    this.cache = cache;
    this.name = "wikimedia-commons";
  }

  async search(query, { limit = 10 } = {}) {
    const key = cacheKey("wikimedia-search", { query, limit });
    const cached = await this.cache?.get(key);
    if (cached) return cached;

    const params = new URLSearchParams({
      action: "query",
      format: "json",
      generator: "search",
      gsrsearch: query,
      gsrnamespace: "6",
      gsrlimit: String(limit),
      prop: "imageinfo",
      iiprop: "url|extmetadata",
      iiurlwidth: "1600",
      origin: "*"
    });

    const response = await this.fetchImpl(
      `${endpoint}?${params}`,
      {
        headers: {
          "Api-User-Agent": "AutoMedia/0.1 (https://indexmod.press)"
        }
      }
    );
    if (!response.ok) throw new Error(`Wikimedia Commons request failed: ${response.status}`);

    const payload = await response.json();
    const images = Object.values(payload.query?.pages || {})
      .map((page) => toImage(page))
      .filter(Boolean);

    await this.cache?.set(key, images, 86_400_000);
    return images;
  }
}

function toImage(page) {
  const info = page.imageinfo?.[0];
  if (!info?.thumburl && !info?.url) return null;

  const rights = validateLicense(info.extmetadata);
  if (!rights.verified) return null;

  return {
    id: `wikimedia:${page.pageid}`,
    provider: "wikimedia-commons",
    title: page.title.replace(/^File:/, ""),
    url: info.thumburl || info.url,
    originalUrl: info.url,
    width: info.thumbwidth || info.width,
    height: info.thumbheight || info.height,
    sourceUrl: `https://commons.wikimedia.org/?curid=${page.pageid}`,
    ...rights
  };
}
