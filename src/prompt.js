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
    /^- Добавить во фронтаматер image: true.*\n?/gim,
    ""
  );

  prompt = prompt.replace(
    /IMAGE RULES:\s*[\s\S]*?(?=\nCONTENT:)/i,
    `IMAGE RULES:

- Использовать automedia: true только как флаг автоматической иллюстрации, а не как URL.
- Добавлять {{automedia:image}} отдельной строкой после абзаца, где должна появиться иллюстрация.
- Не искать изображения, не вставлять ссылки на изображения и не добавлять подписи вручную.
- Подбор файла, проверку лицензии, подпись и атрибуцию выполняет AutoMedia.
`
  );

  if (!prompt.includes("записывать automedia: true во frontmatter")) {
    prompt = prompt.replace(
      "- Статья должна быть структурирована как справочный материал.",
      "- Статья должна быть структурирована как справочный материал.\n- Если статья нуждается в иллюстрации, записывать automedia: true во frontmatter и ставить отдельной строкой {{automedia:image}} в месте вставки."
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
