export default function adminPromptTemplate(prompt = "") {
  return `
<textarea id="prompt">${escapeHtml(prompt)}</textarea>

<script>
async function savePrompt(){
  const prompt = document.getElementById("prompt").value;
  const response = await fetch("/_prompt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });

  if(!response.ok){
    alert("Prompt save error: " + await response.text());
    return;
  }

  location.href = "/";
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
