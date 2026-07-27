const stopWords = new Set([
  "The", "This", "That", "These", "Those", "And", "But", "For", "With",
  "В", "Во", "На", "Из", "Для", "Это", "Как", "При", "После", "Перед", "Также"
]);

export function analyzeMarkdown(markdown = "") {
  const body = stripFrontmatter(markdown);
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(isMeaningfulParagraph);

  const firstParagraph = paragraphs[0] || "";
  const entities = extractEntities(body);
  const topics = extractTopics(body);

  return {
    firstParagraph,
    entities,
    topics,
    queries: buildQueries(entities, topics, firstParagraph)
  };
}

export function extractEntities(text = "") {
  const matches = text.match(/\b(?:[A-ZА-ЯЁ][\p{L}'-]*\s+){0,3}[A-ZА-ЯЁ][\p{L}'-]*/gu) || [];
  const unique = new Set();

  for (const match of matches) {
    const value = match.trim();
    if (value.length > 2 && !stopWords.has(value)) unique.add(value);
  }

  return [...unique].slice(0, 8);
}

export function extractTopics(text = "") {
  const words = (text.toLowerCase().match(/[\p{L}]{5,}/gu) || [])
    .filter((word) => !stopWords.has(word));
  const frequency = new Map();

  for (const word of words) frequency.set(word, (frequency.get(word) || 0) + 1);

  return [...frequency]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 5)
    .map(([word]) => word);
}

export function buildQueries(entities, topics, paragraph = "") {
  const queries = [...entities];

  if (entities[0] && topics[0]) queries.push(`${entities[0]} ${topics[0]}`);
  if (!queries.length && topics.length) queries.push(topics.join(" "));
  if (!queries.length && paragraph) queries.push(paragraph.split(/\s+/).slice(0, 8).join(" "));

  return [...new Set(queries)].slice(0, 5);
}

function stripFrontmatter(markdown) {
  return markdown.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, "");
}

function isMeaningfulParagraph(value) {
  return value.length > 40 && !value.startsWith("#") && !value.startsWith("!");
}
