import defaultPrompt from "./templates/prompt.js";

export function promptForEditor(article, prompt) {
  const cleanArticle = String(article || "")
    .replace(/\n*<!--\s*(?:INDEXMOD ADMIN PROMPT|Prompt:)[\s\S]*?-->\s*$/i, "")
    .trimEnd();

  const cleanPrompt = stripComment(prompt || defaultPrompt);
  if (!cleanPrompt) return cleanArticle;

  return `${cleanArticle}\n\n<!-- INDEXMOD ADMIN PROMPT\n${cleanPrompt}\n-->\n`;
}

export function promptForAdmin(prompt) {
  return stripComment(prompt || defaultPrompt);
}

function stripComment(value = "") {
  return String(value)
    .trim()
    .replace(/^<!--\s*/, "")
    .replace(/\s*-->$/, "")
    .trim();
}
