export default function adminPanelTemplate(pages = [], nextCursor = null) {
  const rows = pages.map((page) => `
<tr>
  <td><a href="/${encodeURIComponent(page.permalink)}">${escapeHtml(page.title)}</a></td>
  <td><input value="${escapeAttribute(page.permalink)}" data-permalink="${escapeAttribute(page.storageSlug)}"></td>
  <td>${page.duplicate ? "Duplicate" : ""}</td>
  <td>
    <button onclick="savePermalink('${escapeJs(page.storageSlug)}')">Save</button>
    ${page.duplicate ? `<button onclick="deletePage('${escapeJs(page.storageSlug)}')">Delete</button>` : ""}
  </td>
</tr>`).join("");

  return `
<div class="admin-panel">
  <table>
    <thead><tr><th>Title</th><th>Permalink</th><th>Status</th><th></th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  ${nextCursor ? `<p><a href="/admin/panel?cursor=${encodeURIComponent(nextCursor)}">Next articles</a></p>` : ""}
</div>

<script>
async function savePermalink(storageSlug){
  const input = document.querySelector('[data-permalink="' + CSS.escape(storageSlug) + '"]');
  const response = await fetch('/_admin/permalink', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ storageSlug, permalink: input.value })
  });
  if(!response.ok){ alert(await response.text()); return; }
  location.reload();
}

async function deletePage(storageSlug){
  if(!confirm('Delete this article?')) return;
  const response = await fetch('/_admin/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ storageSlug })
  });
  if(!response.ok){ alert(await response.text()); return; }
  location.reload();
}
</script>`;
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function escapeAttribute(value = "") {
  return escapeHtml(value);
}

function escapeJs(value = "") {
  return String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}
