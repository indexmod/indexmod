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

  prompt = prompt.replace(
    /^- (?:Добавить во фронтаматер image: true.*|Если статья нуждается в иллюстрации, записывать automedia: true.*)\n?/gim,
    ""
  );

  prompt = prompt.replace(
    /IMAGE RULES:\s*[\s\S]*?(?=\nCONTENT:)/i,
    `IMAGE RULES:

- Найти релевантный файл только в проверенном источнике, предпочтительно Wikimedia Commons.
- Проверить автора, источник и лицензию. Не использовать Fair use, страницы файлов и придуманные URL.
- В image: во frontmatter записать тот же прямой URL файла, который используется в статье.
- После первого смыслового абзаца вставить блок в следующем виде, заменив URL и кредит реальными данными:

![](https://upload.wikimedia.org/wikipedia/commons/8/87/Space-gallery_798-art-district.jpg)

*Image: Wikimedia Commons. Author: Name. License: CC BY-SA 4.0. Source: https://commons.wikimedia.org/*
`
  );

  if (!prompt.includes("записывать её прямой URL в image:")) {
    prompt = prompt.replace(
      "- Статья должна быть структурирована как справочный материал.",
      "- Статья должна быть структурирована как справочный материал.\n- Если статья нуждается в иллюстрации, записывать её прямой URL в image: во frontmatter и вставлять её в Markdown статьи."
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
