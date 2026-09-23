export const ORIGIN = "https://indexmod.press";
export const HOME_ALIASES = new Set(["home", "index"]);
export const GONE_SLUGS = new Set(["new-page"]);

// Evaluate visible text only: instructions inside HTML comments are not content.
// Publishing substantial text automatically makes a placeholder indexable again.
export function isPlaceholder(content = "") {
  const text = String(content)
    .replace(/^\s*---\s*\r?\n[\s\S]*?\r?\n---\s*\r?\n?/, "")
    .replace(/<!--[\s\S]*?(?:-->|$)/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\{\{[^}]+\}\}/g, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\*|_|`/g, "")
    .trim();
  return !text || /(?:^|\n)\s*Write (?:text )?here\s*(?:\.{3}|…)?\s*(?:\n|$)/i.test(text);
}

export function isPublicPage(page) {
  const slug = String(page?.slug || "");
  return /^[a-z0-9а-яё]+(?:-[a-z0-9а-яё]+)*$/i.test(slug)
    && !HOME_ALIASES.has(slug) && !GONE_SLUGS.has(slug)
    && !["edit", "new", "admin"].includes(slug)
    && !/(?:^|,)\s*noindex\b/i.test(page.robots || "")
    && page.draft !== true && page.draft !== "true"
    && !page.placeholder;
}

export function canonicalUrl(slug = "") {
  return `${ORIGIN}/${encodeURIComponent(slug)}`;
}

// Combine host, protocol and legacy-home corrections in one response.
export function redirectTarget(url, pathname = url.pathname) {
  if (HOME_ALIASES.has(pathname.replace(/^\/+|\/+$/g, ""))) pathname = "/";
  if (url.protocol === "https:" && url.hostname === "indexmod.press" && url.pathname === pathname) return null;
  return `${ORIGIN}${pathname}${url.search}`;
}

export function publicLinks(html) {
  return html.replace(/<a\b([^>]*?)\bhref\s*=\s*(["'])(.*?)\2([^>]*)>([\s\S]*?)<\/a>/gi,
    (anchor, before, quote, href, after, label) => {
      let url;
      try { url = new URL(href.replace(/&amp;/g, "&"), ORIGIN); } catch { return anchor; }
      if (!["indexmod.press", "www.indexmod.press"].includes(url.hostname)) return anchor;
      let path;
      try { path = decodeURIComponent(url.pathname).replace(/\/+$/, "") || "/"; }
      catch { return anchor; }
      if (href.startsWith("#")) return anchor;
      if (/^\/(new|admin)(\/|$)/.test(path) || GONE_SLUGS.has(path.slice(1))) return label;
      if (HOME_ALIASES.has(path.slice(1))) url.pathname = "/";
      url.protocol = "https:";
      url.hostname = "indexmod.press";
      const target = `${url.pathname}${url.search}${url.hash}`.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
      return `<a${before}href=${quote}${target}${quote}${after}>${label}</a>`;
    });
}
