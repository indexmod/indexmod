export default function indexTemplate(pages = []) {
  const uniquePages = deduplicatePages(pages);
  const groups = {};

  uniquePages.forEach(page => {
    const title = String(page.title || page.slug || "Untitled").trim();
    const letter = (title[0] || "#").toLocaleUpperCase();

    if (!groups[letter]) groups[letter] = [];
    groups[letter].push({ ...page, title });
  });

  Object.values(groups).forEach(group => {
    group.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" }));
  });

  const letters = Object.keys(groups).sort((a, b) => a.localeCompare(b));
  const cols = [[], [], []];
  letters.forEach((letter, index) => cols[index % cols.length].push(letter));

  let html = `
<section class="index-intro" aria-labelledby="indexmod-title">
<h1 id="indexmod-title">Indexmod Fashion and Art</h1>
<p>Indexmod is an independent encyclopedia documenting fashion, art, designers, brands, institutions, exhibitions, publications, cities and fashion weeks.</p>
<p><strong>${uniquePages.length}</strong> published entries</p>
<p class="index-links"><a href="#about">About Indexmod</a> · <a href="#editorial-policy">Editorial policy</a></p>
</section>

<nav class="alphabet" aria-label="Alphabetical index">
${letters.map(letter => `<a href="#letter-${encodeURIComponent(letter)}">${escapeHtml(letter)}</a>`).join("\n")}
</nav>

<div class="grid" aria-label="Published encyclopedia entries">
`;

  cols.forEach(col => {
    html += `<div class="col">`;

    col.forEach(letter => {
      html += `
<section class="index-group" id="letter-${encodeURIComponent(letter)}" aria-labelledby="heading-${encodeURIComponent(letter)}">
<h2 class="letter" id="heading-${encodeURIComponent(letter)}">${escapeHtml(letter)}</h2>
`;

      groups[letter].forEach(page => {
        html += `<a href="/${encodeURI(page.slug)}">${escapeHtml(page.title)}</a>\n`;
      });

      html += `</section>`;
    });

    html += `</div>`;
  });

  html += `</div>
<section class="index-information" id="about" aria-labelledby="about-title">
<h2 id="about-title">About Indexmod</h2>
<p>Indexmod preserves and connects information about fashion and art across regions, institutions, independent practices and historical periods. Entries are maintained as editorial documents and may be expanded as reliable sources become available.</p>
</section>
<section class="index-information" id="editorial-policy" aria-labelledby="editorial-title">
<h2 id="editorial-title">Editorial policy</h2>
<p>Articles should use a neutral, encyclopedic tone; distinguish verified facts from interpretation; cite identifiable sources; credit images; preserve meaningful revision history; and correct errors without covert advertising or promotional claims.</p>
</section>`;

  return html;
}

function deduplicatePages(pages) {
  const bySlug = new Map();

  for (const page of pages || []) {
    const slug = String(page?.slug || "").trim();
    if (!slug || slug.startsWith("_") || slug.startsWith("admin/")) continue;

    const current = bySlug.get(slug);
    const title = String(page.title || slug).trim();

    if (!current || title.localeCompare(String(current.title || current.slug)) < 0) {
      bySlug.set(slug, { ...page, slug, title });
    }
  }

  return [...bySlug.values()];
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
