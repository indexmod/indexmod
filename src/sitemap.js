import { listSeoPages } from "./storage.js";
import { canonicalUrl, DOMAIN } from "./meta.js";
import { normalizeSlug } from "./slug.js";

export async function generateSitemap(env) {
  const pages = await listSeoPages(env);
  const unique = new Map();

  for (const page of pages || []) {
    const slug = normalizeSlug(page?.slug || "");
    if (!slug || isPrivateSlug(slug)) continue;

    const lastmod = normalizeDate(page.lastmod || page.updated || page.update || page.modified);
    const previous = unique.get(slug);

    if (!previous || (lastmod && (!previous.lastmod || lastmod > previous.lastmod))) {
      unique.set(slug, { slug, lastmod });
    }
  }

  const urls = [...unique.values()]
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map(page => renderUrl({
      loc: canonicalUrl(page.slug),
      lastmod: page.lastmod,
      changefreq: "monthly",
      priority: "0.7"
    }))
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${renderUrl({
    loc: `${DOMAIN}/`,
    changefreq: "weekly",
    priority: "1.0"
  })}${urls}</urlset>\n`;
}

export const sitemap = generateSitemap;

function renderUrl({ loc, lastmod, changefreq, priority }) {
  return `<url>\n<loc>${escapeXml(loc)}</loc>\n${lastmod ? `<lastmod>${escapeXml(lastmod)}</lastmod>\n` : ""}<changefreq>${changefreq}</changefreq>\n<priority>${priority}</priority>\n</url>\n`;
}

function isPrivateSlug(slug) {
  return slug.startsWith("_") || slug.startsWith("admin/") || slug.startsWith("edit/");
}

function normalizeDate(value) {
  const match = String(value || "").trim().match(/^\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : "";
}

function escapeXml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
