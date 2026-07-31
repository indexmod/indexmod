export default function indexTemplate(pages = []) {
  const groups = {};

  pages.forEach(page => {
    const title = String(page.title || page.slug || "Untitled");
    const letter = (title[0] || "#").toUpperCase();

    if (!groups[letter]) {
      groups[letter] = [];
    }

    groups[letter].push({
      ...page,
      title
    });
  });

  const letters = Object.keys(groups).sort();
  const cols = [[], [], []];

  letters.forEach((letter, index) => {
    cols[index % 3].push(letter);
  });

  let html = `
<section class="index-intro">
<h1>Indexmod Fashion and Art Encyclopedia</h1>
<p>Independent encyclopedia of fashion, art, designers, brands, institutions, exhibitions and fashion weeks.</p>
<p><strong>${pages.length}</strong> published entries, arranged alphabetically.</p>
</section>

<nav class="alphabet" aria-label="Alphabetical index">
${letters.map(letter => `<a href="#letter-${encodeURIComponent(letter)}">${escapeHtml(letter)}</a>`).join("\n")}
</nav>

<div class="grid">
`;

  cols.forEach(col => {
    html += `<div class="col">`;

    col.forEach(letter => {
      html += `
<section class="index-group" id="letter-${encodeURIComponent(letter)}">
<h2 class="letter">${escapeHtml(letter)}</h2>
`;

      groups[letter].forEach(page => {
        html += `
<a href="/${encodeURI(page.slug)}">${escapeHtml(page.title)}</a>
`;
      });

      html += `</section>`;
    });

    html += `</div>`;
  });

  html += `</div>`;
  return html;
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
