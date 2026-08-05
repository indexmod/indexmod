import { normalizeSlug } from "./slug.js";

export const DOMAIN = "https://indexmod.press";
export const SITE_NAME = "Indexmod Fashion and Art";
export const DEFAULT_DESCRIPTION =
  "Indexmod is an independent encyclopedia of fashion, art, designers, brands, institutions, exhibitions and fashion weeks.";

export function buildMeta(data = {}) {
  const title = clean(data.title || data.name || "Indexmod");
  const description = normalizeDescription(
    data.description || extractDescription(data.content || data.html || "") || DEFAULT_DESCRIPTION
  );
  const slug = normalizeSlug(data.slug || "");
  const url = canonicalUrl(slug);
  const image = absoluteUrl(data.image || "");
  const noindex = Boolean(data.noindex || data.draft || data.private);

  return {
    title,
    description,
    slug,
    url,
    robots: noindex
      ? "noindex,follow,noarchive"
      : data.robots || "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
    type: slug ? "article" : "website",
    image: image || null,
    imageAlt: clean(data.imageAlt || data.credit || title),
    language: normalizeLanguage(data.language || data.lang || "en"),
    created: normalizeDate(data.created || data.date),
    updated: normalizeDate(data.updated || data.update || data.modified),
    author: clean(data.author || "Indexmod Editorial"),
    section: clean(data.section || data.category || "Fashion and art"),
    keywords: normalizeKeywords(data.keywords || data.tags)
  };
}

export function og(meta = {}) {
  const tags = [
    ["property", "og:type", meta.type || "website"],
    ["property", "og:site_name", SITE_NAME],
    ["property", "og:title", meta.title],
    ["property", "og:description", meta.description],
    ["property", "og:url", meta.url],
    ["property", "og:locale", toOgLocale(meta.language)],
    ["name", "twitter:card", meta.image ? "summary_large_image" : "summary"],
    ["name", "twitter:title", meta.title],
    ["name", "twitter:description", meta.description]
  ];

  if (meta.image) {
    tags.push(
      ["property", "og:image", meta.image],
      ["property", "og:image:alt", meta.imageAlt || meta.title],
      ["name", "twitter:image", meta.image],
      ["name", "twitter:image:alt", meta.imageAlt || meta.title]
    );
  }

  if (meta.type === "article") {
    if (meta.created) tags.push(["property", "article:published_time", meta.created]);
    if (meta.updated) tags.push(["property", "article:modified_time", meta.updated]);
    if (meta.section) tags.push(["property", "article:section", meta.section]);
  }

  return tags
    .filter(([, , value]) => value)
    .map(([kind, name, value]) => `<meta ${kind}="${name}" content="${escapeHtml(value)}">`)
    .join("\n");
}

export function structuredData(meta = {}) {
  const organizationId = `${DOMAIN}/#organization`;
  const websiteId = `${DOMAIN}/#website`;
  const graph = [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: SITE_NAME,
      url: `${DOMAIN}/`,
      logo: {
        "@type": "ImageObject",
        url: `${DOMAIN}/logo.svg`
      }
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      name: SITE_NAME,
      url: `${DOMAIN}/`,
      description: DEFAULT_DESCRIPTION,
      publisher: { "@id": organizationId },
      inLanguage: meta.language || "en"
    }
  ];

  if (meta.type === "article") {
    graph.push({
      "@type": "Article",
      "@id": `${meta.url}#article`,
      headline: meta.title,
      description: meta.description,
      url: meta.url,
      mainEntityOfPage: { "@type": "WebPage", "@id": meta.url },
      isPartOf: { "@id": websiteId },
      publisher: { "@id": organizationId },
      author: { "@type": "Organization", name: meta.author || "Indexmod Editorial" },
      inLanguage: meta.language || "en",
      ...(meta.image ? { image: [meta.image] } : {}),
      ...(meta.created ? { datePublished: meta.created } : {}),
      ...(meta.updated ? { dateModified: meta.updated } : {}),
      ...(meta.section ? { articleSection: meta.section } : {}),
      ...(meta.keywords.length ? { keywords: meta.keywords.join(", ") } : {})
    });
  }

  return `<script type="application/ld+json">${safeJson({
    "@context": "https://schema.org",
    "@graph": graph
  })}</script>`;
}

export function canonicalUrl(slug = "") {
  const normalized = normalizeSlug(slug);
  return normalized ? encodeURI(`${DOMAIN}/${normalized}`) : `${DOMAIN}/`;
}

function absoluteUrl(value = "") {
  const text = clean(value);
  if (!text) return "";
  try {
    return new URL(text, `${DOMAIN}/`).toString();
  } catch {
    return "";
  }
}

function extractDescription(text = "") {
  return String(text)
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/^---[\s\S]*?---/m, "")
    .replace(/<[^>]*>/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeDescription(value = "") {
  const text = clean(value);
  if (text.length <= 160) return text;
  const shortened = text.slice(0, 157).replace(/\s+\S*$/, "");
  return `${shortened || text.slice(0, 157)}…`;
}

function normalizeLanguage(value = "en") {
  const language = clean(value).toLowerCase().replace(/_/g, "-");
  return /^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/.test(language) ? language : "en";
}

function normalizeDate(value) {
  if (!value) return null;
  const text = clean(value);
  const match = text.match(/^\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : null;
}

function normalizeKeywords(value) {
  const values = Array.isArray(value) ? value : String(value || "").split(",");
  return [...new Set(values.map(clean).filter(Boolean))].slice(0, 20);
}

function toOgLocale(language = "en") {
  const [lang, region] = normalizeLanguage(language).split("-");
  return `${lang}_${(region || lang).toUpperCase()}`;
}

function clean(text = "") {
  return String(text).replace(/\s+/g, " ").trim();
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function safeJson(value) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
