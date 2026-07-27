import defaultPrompt from "./templates/prompt.js";

export function promptForEditor(article, prompt) {
  const cleanArticle = String(article || "")
    .replace(/\n*<!--\s*(?:INDEXMOD ADMIN PROMPT|Prompt:)[\s\S]*?-->\s*$/i, "")
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
    /^- Добавить во фронтаматер image: true.*\n?/gim,
    ""
  );

  prompt = prompt.replace(
    /IMAGE RULES:\s*[\s\S]*?(?=\nCONTENT:)/i,
    `IMAGE RULES:

- Использовать image: true только как флаг автоматической иллюстрации, а не как URL.
- Не искать изображения, не вставлять ссылки на изображения и не добавлять подписи вручную.
- Подбор файла, проверку лицензии, подпись и атрибуцию выполняет AutoMedia.
`
  );

  if (!prompt.includes("записывать image: true во frontmatter вместо ссылки")) {
    prompt = prompt.replace(
      "- Статья должна быть структурирована как справочный материал.",
      "- Статья должна быть структурирована как справочный материал.\n- Если статья нуждается в иллюстрации, записывать image: true во frontmatter вместо ссылки на изображение."
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
