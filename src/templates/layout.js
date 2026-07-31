import { og, structuredData } from "../meta.js";
import yandexMetrika from "../metrics.js";

export default function layout(
  c,
  rightUI = "",
  meta = {}
) {
  const title = meta.title || "Indexmod";
  const description = meta.description || "Indexmod — independent fashion and art encyclopedia";
  const url = meta.url || (meta.slug
    ? `https://indexmod.press/${meta.slug}`
    : "https://indexmod.press/"
  );
  const language = meta.language || "en";
  const documentTitle = title === "Indexmod"
    ? "Indexmod — Fashion and Art Encyclopedia"
    : `${title} — Indexmod`;

  return `
<!doctype html>
<html lang="${escapeHtml(language)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="referrer" content="strict-origin-when-cross-origin">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<title>${escapeHtml(documentTitle)}</title>
<meta name="description" content="${escapeHtml(description)}">
<meta name="robots" content="${escapeHtml(meta.robots || "index,follow,max-image-preview:large")}">
<link rel="canonical" href="${escapeHtml(url)}">
${og({ ...meta, title, description, url })}
${structuredData({ ...meta, title, description, url })}
<link rel="stylesheet" href="/styles/base.css">
<link rel="stylesheet" href="/styles/view.css">
<link rel="stylesheet" href="/styles/editor.css">
<link rel="stylesheet" href="/styles/index.css">
${yandexMetrika()}
</head>
<body>
<header class="site-header">
<a href="/" class="logo" aria-label="Indexmod home">
<img src="/logo.svg" alt="Indexmod" width="48" height="48">
</a>
</header>
<div class="action-bar">
<div></div>
<div class="actions">
${rightUI}
</div>
</div>
<main>
${c}
</main>
<footer class="site-footer">
<a
  class="footer-link"
  href="https://mod.indexmod.press"
  aria-label="XX лет"
>
<svg class="footer-badge" viewBox="0 0 1000 1000" role="img" aria-hidden="true" focusable="false">
<defs>
  <radialGradient id="footer-sphere-gradient" cx="40%" cy="35%" r="75%">
    <stop offset="0%" stop-color="#e0e0e0"/>
    <stop offset="45%" stop-color="#b8b8b8"/>
    <stop offset="100%" stop-color="#6f6f6f"/>
  </radialGradient>
  <radialGradient id="footer-sphere-shine" cx="35%" cy="30%" r="55%">
    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25"/>
    <stop offset="40%" stop-color="#ffffff" stop-opacity="0.08"/>
    <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
  </radialGradient>
</defs>
<rect width="1000" height="1000" fill="#1a73e8"/>
<g transform="translate(158.455 219.122) scale(1.544974 1.544974)">
  <circle cx="64" cy="64" r="63" fill="url(#footer-sphere-gradient)"/>
  <circle cx="52" cy="48" r="32" fill="url(#footer-sphere-shine)"/>
  <circle cx="64" cy="64" r="63" fill="none" stroke="#4f4f4f" stroke-opacity="0.18"/>
</g>
<path d="M415 370 644 729H469L331 489L204 729H22L248 370L22 0H192L331 253L469 0H644Z" fill="#fff" transform="translate(395.781 415.333) scale(0.312969 -0.267032)"/>
<path d="M415 370 644 729H469L331 489L204 729H22L248 370L22 0H192L331 253L469 0H644Z" fill="#fff" transform="translate(638.448 415.333) scale(0.312969 -0.267032)"/>
<path d="M5 0H89C173 -1 247 71 244 149V604H475V0H625V729H94V160C93 136 81 125 58 125H5Z" fill="#fff" transform="translate(158.430 779.333) scale(0.313978 -0.267032)"/>
<path d="M223 314H572V439H223V604H600V729H73V0H618V125H223Z" fill="#fff" transform="translate(375.701 779.333) scale(0.369386 -0.267032)"/>
<path d="M384 604H597V729H13V604H234V0H384Z" fill="#fff" transform="translate(641.000 779.333) scale(0.333333 -0.267032)"/>
</svg>
</a>
</footer>
</body>
</html>
`;
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
