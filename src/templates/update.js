export default function updateTemplate({ prompt, content }) {
  const value = `${prompt}\n\nCURRENT ARTICLE TO UPDATE:\n\n${content}`;

  return `
<textarea id="update-prompt" readonly>${escapeHtml(value)}</textarea>

<script>
async function copyPrompt(){
  const field = document.getElementById("update-prompt");
  await navigator.clipboard.writeText(field.value);
}
</script>
`;
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
