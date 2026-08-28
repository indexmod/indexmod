import defaultPrompt from "./templates/prompt.js";

export function promptForEditor(article, prompt) {
  const cleanArticle = stripPromptComment(article);

  const cleanPrompt = normalizePrompt(prompt || defaultPrompt);
  if (!cleanPrompt) return cleanArticle;

  return `${cleanArticle}\n\n<!-- INDEXMOD ADMIN PROMPT\n${cleanPrompt}\n-->\n`;
}

export function stripPromptComment(article) {
  return String(article || "")
    .replace(/\n*<!--\s*(?:INDEXMOD(?: ADMIN)? PROMPT|Prompt:)[\s\S]*?-->\s*$/i, "")
    .trimEnd();
}

export function promptForAdmin(prompt) {
  return normalizePrompt(prompt || defaultPrompt);
}

function normalizePrompt(value) {
  let prompt = stripComment(value);

  if (isLegacyPrompt(prompt)) {
    prompt = stripComment(defaultPrompt);
  }

  prompt = prompt.replace(
    /^- Provide the result as a downloadable \.md file link\.$/m,
    [
      "- Return the result as a .md file attachment or downloadable .md link when the interface supports files.",
      "- If file attachment is not available, return one raw Markdown code block only."
    ].join("\n")
  );

  prompt = prompt.replace(
    /^- For biography titles, use "Last Name, First Name" or the natural equivalent for the article language\.$/m,
    '- For people, always rewrite title as "Last Name, First Name" or the natural equivalent for the article language. Example: "Alexander McQueen" becomes "McQueen, Alexander".'
  );

  const directImageRules = `## IMAGE RULES

- Всегда стараться заполнить image: и credit: во frontmatter, если существует подходящее законное изображение.
- Предпочитать Wikimedia Commons или другой проверяемый источник со свободной лицензией, когда подходящее изображение существует.
- Для свободно лицензированных изображений credit: должен называть автора, источник и лицензию, когда они известны.
- Если подходящего свободно лицензированного изображения нет, можно использовать официальное editorial, press, institutional, gallery, museum, brand, designer, artist или photographer изображение, опубликованное понятным первичным или авторитетным источником.
- Для официального несвободного editorial или press изображения не заявлять свободную лицензию. Указать фотографа или автора, когда он известен, и назвать организацию или сайт, где изображение опубликовано.
- Не использовать анонимные агрегаторы, Pinterest, repost-аккаунты, thumbnails из поиска, scraped image hosts, придуманные URL, страницы файлов и Markdown-ссылки в image:.
- В image: во frontmatter записать только чистый прямой URL файла изображения, который может загрузить сайт.
- Не менять синтаксис селектора изображения. В Markdown статьи вставлять иллюстрацию только через существующий селектор {{page:image}}. Рендер подставит image из frontmatter и обработает внешний URL через медиапрокси.
- Не менять синтаксис селектора кредита. В Markdown статьи вставлять кредит изображения только через существующий селектор {{page:credit}}. Рендер подставит credit из frontmatter.
- Сохранять совместимость {{page:image}} и {{page:credit}} со старыми страницами. Не заменять их Markdown-картинкой, HTML, новыми именами селекторов или inline URL.
- После первого смыслового абзаца вставить блок в точности в следующем виде:

{{page:image}}

{{page:credit}}`;

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
      "- Статья должна быть структурирована как справочный материал.\n- Если статья нуждается в иллюстрации, записывать чистый прямой URL файла изображения в image: во frontmatter, credit изображения в credit:, а в Markdown статьи вставлять картинку через селектор {{page:image}} и кредит через {{page:credit}}."
    );
  }

  if (!prompt.includes("Every See also item must be a clickable internal Markdown link")) {
    prompt = prompt.replace(
      /^- Include a See also section when related topics are useful\.$/m,
      "- Include a See also section when related topics are useful. Every See also item must be a clickable internal Markdown link in the form `[Article title](/article-slug)`, even when the linked article does not yet exist in storage."
    );
  }

  return prompt.trim();
}

function isLegacyPrompt(prompt = "") {
  return /(?:Всегда включать этот промпт|Keep this Prompt after editing|INDEXMOD PROMPT всегда должен полностью сохраняться)/i.test(
    prompt
  );
}

function stripComment(value = "") {
  return String(value)
    .trim()
    .replace(/^<!--\s*/, "")
    .replace(/\s*-->$/, "")
    .trim();
}
