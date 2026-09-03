import { og, structuredData } from "../meta.js";
import yandexMetrika from "../metrics.js";

const assetVersion = "20260815-footer-align";

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

  return openLinksInNewTabs(`
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
<link rel="stylesheet" href="${styleHref("/styles/base.css")}">
<link rel="stylesheet" href="${styleHref("/styles/view.css")}">
<link rel="stylesheet" href="${styleHref("/styles/editor.css")}">
<link rel="stylesheet" href="${styleHref("/styles/index.css")}">
${yandexMetrika()}
</head>
<body>
${statusHeader()}
<header class="site-header">
<a href="/" class="logo" aria-label="Indexmod home">
<img src="/logo.svg" alt="Indexmod" width="48" height="48">
</a>
<div class="actions">
${rightUI}
</div>
</header>
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
${statusScript()}
</body>
</html>
`);
}

export function attachStatusHeader(documentHtml = "") {
  let html = String(documentHtml);

  if (!html) {
    return html;
  }

  html = versionStyleLinks(html);
  html = openLinksInNewTabs(html);

  if (html.includes("id=\"operation-status\"")) {
    return html;
  }

  html = html.replace(/<body([^>]*)>/i, (match) => `${match}\n${statusHeader()}`);

  if (html.includes("</body>")) {
    return html.replace(/<\/body>/i, `${statusScript()}\n</body>`);
  }

  return `${html}\n${statusScript()}`;
}

function styleHref(path) {
  return `${path}?v=${assetVersion}`;
}

function versionStyleLinks(html) {
  return html.replace(
    /href="(\/styles\/(?:base|view|editor|index)\.css)(?:\?[^"]*)?"/g,
    (match, path) => `href="${styleHref(path)}"`
  );
}

function openLinksInNewTabs(html = "") {
  return String(html).replace(/<a\b([^>]*)>/gi, (match, attributes) => {
    let nextAttributes = attributes;

    if (!/\starget\s*=/i.test(nextAttributes)) {
      nextAttributes += ` target="_blank"`;
    }

    if (!/\srel\s*=/i.test(nextAttributes)) {
      nextAttributes += ` rel="noopener noreferrer"`;
    }

    return `<a${nextAttributes}>`;
  });
}

function statusHeader() {
  return `<header id="operation-status" class="operation-status" aria-live="polite" aria-atomic="true"></header>`;
}

function statusScript() {
  return `<script>
(function(){
  const status = document.getElementById("operation-status");
  if(!status) return;

  const slowDelay = 300;
  const doneDelay = 900;
  const frames = ["●", "● ●", "● ● ●", "● ● ● ●", "● ● ● ● ●", "● ● ● ● ● ●"];
  let active = null;

  function clearActive(task){
    if(task && task.timer) clearTimeout(task.timer);
    if(task && task.interval) clearInterval(task.interval);
    if(active === task) active = null;
  }

  function show(text){
    status.textContent = text;
    status.classList.add("is-visible");
  }

  function hide(){
    status.classList.remove("is-visible");
    status.textContent = "";
  }

  function start(label){
    const task = {
      label,
      startedAt: Date.now(),
      shown: false,
      frame: 0,
      timer: 0,
      interval: 0
    };

    task.timer = setTimeout(function(){
      task.shown = true;
      show(label + " " + frames[task.frame]);
      task.interval = setInterval(function(){
        task.frame = (task.frame + 1) % frames.length;
        show(label + " " + frames[task.frame]);
      }, 180);
    }, slowDelay);

    active = task;
    return task;
  }

  function done(task, label){
    if(!task) return;
    const wasShown = task.shown;
    clearActive(task);

    if(wasShown){
      show(label || (task.label + " done"));
      setTimeout(hide, doneDelay);
    }
  }

  function fail(task, label){
    if(!task) return;
    const wasShown = task.shown;
    clearActive(task);

    if(wasShown){
      show(label || (task.label + " failed"));
      setTimeout(hide, doneDelay * 2);
    }
  }

  function labelForUrl(input){
    const value = typeof input === "string" ? input : (input && input.url) || "";
    let pathname = value;

    try {
      pathname = new URL(value, location.href).pathname;
    }
    catch(error){}

    if(pathname === "/_save") return "Saving";
    if(pathname === "/_prompt") return "Saving prompt";
    if(pathname === "/_admin/permalink") return "Saving permalink";
    if(pathname === "/_admin/delete") return "Deleting";
    if(pathname === "/_admin/delete-many") return "Deleting";
    if(pathname === "/_list") return "Loading list";
    if(pathname.startsWith("/_get/")) return "Opening page";
    return "Working";
  }

  window.IndexmodStatus = {
    start,
    done,
    fail,
    show,
    hide,
    run: async function(label, promise){
      const task = start(label);
      try {
        const result = await promise;
        done(task, label + " done");
        return result;
      }
      catch(error){
        fail(task, label + " failed");
        throw error;
      }
    }
  };

  const originalFetch = window.fetch;
  if(originalFetch){
    window.fetch = async function(input, init){
      const task = start(labelForUrl(input));
      try {
        const response = await originalFetch.apply(this, arguments);
        if(response.ok) done(task);
        else fail(task);
        return response;
      }
      catch(error){
        fail(task);
        throw error;
      }
    };
  }

  document.addEventListener("click", function(event){
    const link = event.target.closest && event.target.closest("a[href]");
    if(!link || link.target || link.hasAttribute("download")) return;

    let url;
    try {
      url = new URL(link.href, location.href);
    }
    catch(error){
      return;
    }

    if(url.origin !== location.origin) return;
    start("Opening page");
  }, true);

  window.addEventListener("beforeunload", function(){
    if(!active) start("Opening page");
  });

  window.addEventListener("load", function(){
    const nav = performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
    if(!nav) return;

    const duration = Math.round(nav.responseEnd - nav.startTime);
    if(duration > 700){
      show("Page opened " + duration + "ms");
      setTimeout(hide, doneDelay);
    }
  });
})();
</script>`;
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
