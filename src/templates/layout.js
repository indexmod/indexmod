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
<a class="footer-link" href="https://mod.indexmod.press">
<span class="footer-dot"></span>
<span class="footer-text">xx лет</span>
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
