import defaultPrompt from "./templates/prompt.js";

export function promptForEditor(article, prompt) {
  const cleanArticle = String(article || "")
    .replace(/\n*<!--\s*(?:INDEXMOD(?: ADMIN)? PROMPT|Prompt:)[\s\S]*?-->\s*$/i, "")
    .trimEnd();

  const cleanPrompt = normalizePrompt(prompt || defaultPrompt);
  if (!cleanPrompt) return cleanArticle;

  return `${cleanArticle}\n\n<!-- INDEXMOD ADMIN PROMPT\n${cleanPrompt}\n-->\n`;
}

export function promptForAdmin(prompt) {
  return normalizePrompt(prompt || defaultPrompt);
}

function normalizePrompt(value) {
  let prompt = stripComment(value);

  const directImageRules = `## IMAGE RULES

- Найти релевантный файл только в проверенном источнике, предпочтительно Wikimedia Commons.
- Проверить автора, источник и лицензию. Не использовать Fair use, страницы файлов и придуманные URL.
- В image: во frontmatter записать только чистый прямой URL файла изображения, без Markdown-разметки, квадратных скобок и круглых скобок.
- В Markdown статьи вставлять иллюстрацию только через селектор {{page:image}}. Рендер подставит image из frontmatter и обработает внешний URL через медиапрокси.
- Не использовать формат [URL](URL) для URL изображения во frontmatter или внутри src.
- После первого смыслового абзаца вставить блок в следующем виде, заменив URL и кредит реальными данными:

{{page:image}}

*Image: Wikimedia Commons. Author: Name. License: CC BY-SA 4.0. Source: https://commons.wikimedia.org/*`;

  prompt = prompt.replace(
    /### Правила обработки изображений[\s\S]*?(?=\n---\s*\n\s*## STRUCTURE)/i,
    directImageRules
  );

  prompt = prompt.replace(
    /## IMAGE RULES[\s\S]*?(?=\n---\s*\n\s*## CONTENT)/i,
    directImageRules
  );

  prompt = prompt.replace(
    /^- (?:Добавить во фронтаматер image: true.*|Если статья нуждается в иллюстрации, записывать automedia: true.*)\n?/gim,
    ""
  );

  prompt = prompt.replace(
    /IMAGE RULES:\s*[\s\S]*?(?=\nCONTENT:)/i,
    directImageRules.replace("## IMAGE RULES", "IMAGE RULES:") + "\n"
  );

  if (!prompt.includes("чистый прямой URL файла изображения")) {
    prompt = prompt.replace(
      "- Статья должна быть структурирована как справочный материал.",
      "- Статья должна быть структурирована как справочный материал.\n- Если статья нуждается в иллюстрации, записывать чистый прямой URL файла изображения в image: во frontmatter, а в Markdown статьи вставлять картинку через селектор {{page:image}}."
    );
  }

  return prompt.trim();
}

function stripComment(value = "") {
  return String(value)
    .trim()
    .replace(/^<!--\s*/, "")
    .replace(/\s*-->$/, "")
    .trim();
}
