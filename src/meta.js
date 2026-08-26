// ===============================
// UNIVERSAL META GENERATOR
// ===============================

import { normalizeSlug } from "./slug.js";

const DOMAIN = "https://indexmod.press";
const SITE_NAME = "Indexmod Fashion and Art";
const DEFAULT_OG_IMAGE = {
  width: 1200,
  height: 630,
  fit: "cover",
  quality: 82,
  format: "jpeg"
};

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
    socialImage: data.socialImage || socialImageUrl(data.image, data.socialImageOptions),
    socialImageWidth: positiveInteger(data.socialImageOptions?.width, DEFAULT_OG_IMAGE.width),
    socialImageHeight: positiveInteger(data.socialImageOptions?.height, DEFAULT_OG_IMAGE.height),
    language: data.language || "en",
    created: data.created || data.date || null,
    updated: data.updated || data.update || null,
    author: data.author || "Indexmod Editorial"
  };
}

export function og(meta = {}) {
  const image = meta.socialImage || meta.image;
  const width = meta.socialImageWidth || DEFAULT_OG_IMAGE.width;
  const height = meta.socialImageHeight || DEFAULT_OG_IMAGE.height;

  return `
<meta property="og:type" content="${meta.type || "website"}">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:title" content="${escapeHtml(meta.title)}">
<meta property="og:description" content="${escapeHtml(meta.description)}">
<meta property="og:url" content="${escapeHtml(meta.url)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(meta.title)}">
<meta name="twitter:description" content="${escapeHtml(meta.description)}">
${image ? `
<meta property="og:image" content="${escapeHtml(image)}">
<meta property="og:image:secure_url" content="${escapeHtml(image)}">
<meta property="og:image:width" content="${escapeHtml(width)}">
<meta property="og:image:height" content="${escapeHtml(height)}">
<meta property="og:image:alt" content="${escapeHtml(meta.title)}">
<meta name="twitter:image" content="${escapeHtml(image)}">
<meta name="twitter:image:alt" content="${escapeHtml(meta.title)}">
` : ""}
`;
}

export function socialImageUrl(image, options = {}) {
  const source = clean(image || "");

  if(!source || source === "true")
    return null;

  if(options.enabled === false)
    return absolutizeUrl(source);

  const absoluteSource =
  absolutizeUrl(source);

  if(!absoluteSource)
    return null;

  const wikimediaThumbnail =
  wikimediaThumbnailUrl(absoluteSource, positiveInteger(options.width, DEFAULT_OG_IMAGE.width));

  if(wikimediaThumbnail)
    return wikimediaThumbnail;

  const url =
  new URL("/_media", DOMAIN);

  url.searchParams.set("url", absoluteSource);
  url.searchParams.set("og", "1");
  url.searchParams.set("w", positiveInteger(options.width, DEFAULT_OG_IMAGE.width));
  url.searchParams.set("h", positiveInteger(options.height, DEFAULT_OG_IMAGE.height));
  url.searchParams.set("fit", clean(options.fit || DEFAULT_OG_IMAGE.fit));
  url.searchParams.set("q", positiveInteger(options.quality, DEFAULT_OG_IMAGE.quality));
  url.searchParams.set("format", clean(options.format || DEFAULT_OG_IMAGE.format));

  return url.toString();
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

function absolutizeUrl(value = "") {
  const url =
  clean(value);

  if(!url)
    return null;

  try {
    return new URL(url).toString();
  }
  catch {
    try {
      return new URL(url, DOMAIN).toString();
    }
    catch {
      return null;
    }
  }
}

function wikimediaThumbnailUrl(source, width) {
  let url;

  try {
    url = new URL(source);
  }
  catch {
    return null;
  }

  if(url.hostname.toLowerCase() !== "upload.wikimedia.org")
    return null;

  const path =
  url.pathname;

  if(!path.startsWith("/wikipedia/commons/") || path.startsWith("/wikipedia/commons/thumb/"))
    return null;

  const segments =
  path.split("/").filter(Boolean);

  if(segments.length < 5)
    return null;

  const filename =
  segments[segments.length - 1];

  let decodedFilename;

  try {
    decodedFilename = decodeURIComponent(filename);
  }
  catch {
    return null;
  }

  const extension =
  decodedFilename.split(".").pop().toLowerCase();

  const thumbFilename =
  extension === "svg"
  ? `${wikimediaThumbnailWidth(width)}px-${decodedFilename}.png`
  : `${wikimediaThumbnailWidth(width)}px-${decodedFilename}`;

  const thumbPath =
  [
    "",
    "wikipedia",
    "commons",
    "thumb",
    ...segments.slice(2),
    encodeURIComponent(thumbFilename).replace(/%2F/g, "/")
  ].join("/");

  return new URL(thumbPath, "https://upload.wikimedia.org").toString();
}

function wikimediaThumbnailWidth(width) {
  const allowedWidths =
  [120, 250, 330, 500, 640, 800, 960, 1024, 1280, 1920, 2560];

  return allowedWidths.find(allowedWidth => allowedWidth >= width) || 2560;
}

function positiveInteger(value, fallback) {
  const number =
  Number(value);

  if(Number.isInteger(number) && number > 0)
    return number;

  return fallback;
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
