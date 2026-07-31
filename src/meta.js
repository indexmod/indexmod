// ===============================
// UNIVERSAL META GENERATOR
// ===============================

import { normalizeSlug } from "./slug.js";

const DOMAIN = "https://indexmod.press";
const SITE_NAME = "Indexmod Fashion and Art";

export function buildMeta(data = {}) {
  const title = clean(data.title || data.name || "Indexmod");
  const description = clean(
    data.description ||
    extractDescription(data.content || data.html || "") ||
    "Indexmod — independent fashion and art encyclopedia"
  );

  const slug = normalizeSlug(data.slug || "");
  const url = slug ? encodeURI(`${DOMAIN}/${slug}`) : `${DOMAIN}/`;

  return {
    title,
    description,
    slug,
    url,
    robots: data.robots || "index,follow,max-image-preview:large",
    type: slug ? "article" : "website",
    image: data.image || null,
    language: data.language || "en",
    created: data.created || data.date || null,
    updated: data.updated || data.update || null,
    author: data.author || "Indexmod Editorial"
  };
}

export function og(meta = {}) {
  return `
<meta property="og:type" content="${meta.type || "website"}">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:title" content="${escapeHtml(meta.title)}">
<meta property="og:description" content="${escapeHtml(meta.description)}">
<meta property="og:url" content="${escapeHtml(meta.url)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(meta.title)}">
<meta name="twitter:description" content="${escapeHtml(meta.description)}">
${meta.image ? `
<meta property="og:image" content="${escapeHtml(meta.image)}">
<meta property="og:image:alt" content="${escapeHtml(meta.title)}">
<meta name="twitter:image" content="${escapeHtml(meta.image)}">
<meta name="twitter:image:alt" content="${escapeHtml(meta.title)}">
` : ""}
`;
}

export function structuredData(meta = {}) {
  const data = meta.type === "article"
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: meta.title,
        description: meta.description,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": meta.url
        },
        url: meta.url,
        inLanguage: meta.language || "en",
        author: {
          "@type": "Organization",
          name: meta.author || "Indexmod Editorial",
          url: `${DOMAIN}/`
        },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: `${DOMAIN}/`
        },
        ...(meta.image ? { image: [meta.image] } : {}),
        ...(meta.created ? { datePublished: meta.created } : {}),
        ...(meta.updated ? { dateModified: meta.updated } : {})
      }
    : {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: `${DOMAIN}/`,
        description: meta.description,
        inLanguage: meta.language || "en"
      };

  return `<script type="application/ld+json">${safeJson(data)}</script>`;
}

function extractDescription(text = "") {
  return String(text)
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[[^\]]+\]\([^)]*\)/g, "")
    .replace(/[#>*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 170);
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
