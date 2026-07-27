export function renderMarkdownImage(image, { alt = image.title } = {}) {
  const caption = `${image.title}. ${creditLine(image)}`;
  return `![${escapeMarkdown(alt)}](${image.url} "${escapeMarkdown(caption)}")\n\n*${escapeMarkdown(caption)}*\n\n[Source](${image.sourceUrl}) | [License: ${escapeMarkdown(image.license)}](${image.licenseUrl || image.sourceUrl})`;
}

export function renderHtmlImage(image, { alt = image.title } = {}) {
  const caption = escapeHtml(`${image.title}. ${creditLine(image)}`);
  return `<figure class="automedia-image"><img src="${escapeAttribute(image.url)}" alt="${escapeAttribute(alt)}" loading="lazy"><figcaption>${caption} <a href="${escapeAttribute(image.sourceUrl)}" rel="noopener noreferrer">Source</a> <a href="${escapeAttribute(image.licenseUrl || image.sourceUrl)}" rel="license noopener noreferrer">${escapeHtml(image.license)}</a></figcaption></figure>`;
}

export function insertAfterFirstParagraph(markdown, block) {
  const frontmatter = markdown.match(/^(---\s*\n[\s\S]*?\n---\s*\n?)/)?.[0] || "";
  const body = markdown.slice(frontmatter.length);
  const parts = body.split(/(\n\s*\n)/);
  let paragraphIndex = 0;

  for (let index = 0; index < parts.length; index += 2) {
    if (parts[index].trim().length > 40 && !parts[index].trim().startsWith("#")) {
      paragraphIndex = index;
      break;
    }
  }

  parts.splice(paragraphIndex + 1, 0, "\n\n", block, "\n\n");
  return `${frontmatter}${parts.join("")}`;
}

function creditLine(image) {
  return `Photo by ${image.author}; ${image.license}.`;
}

function escapeMarkdown(value = "") {
  return String(value).replace(/[\[\]]/g, "\\$&");
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function escapeAttribute(value = "") {
  return escapeHtml(value);
}
