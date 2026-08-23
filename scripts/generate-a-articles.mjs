import fs from "node:fs/promises";
import path from "node:path";

const updated = "2026-08-23";
const outDir = path.resolve("generated-articles/a");

const topics = [
  ["African Fashion International", "South Africa - A major fashion platform in South Africa, promoting African designers on a global stage."],
  ["Agnes Gund", ""],
  ["Ahmed Mater", "Saudi Arabia - Saudi artist and photographer whose works often focus on social change and modern life in Saudi Arabia."],
  ["Ai Weiwei", ""],
  ["Akira Minagawa", ""],
  ["Akira Naka", ""],
  ["Al-Mubarakiah Souq", "Kuwait - One of the oldest markets in Kuwait, where traditional and modern fashion co-exist."],
  ["Alasdair McLellan", ""],
  ["Albania", ""],
  ["Aleksei Kruchyonykh", ""],
  ["Alexander Kosolapov", ""],
  ["Alexander Rodchenko", ""],
  ["Alexandra Shulman", ""],
  ["Alexandre Herchcovitch", "Brazil"],
  ["Alexi Lubomirski", ""],
  ["Ali Banisadr", "Iran - Iranian-born artist, whose large-scale abstract paintings draw on his experiences growing up during the Iran-Iraq war."],
  ["Almaty", ""],
  ["Alserkal Avenue", "UAE - A cultural district in Dubai, home to galleries, fashion events, and installations showcasing local and international artists."],
  ["Altanshagai", ""],
  ["Altuzarra", ""],
  ["Amaka Osakwe", "Nigeria - Fashion designer and the creative force behind Maki Oh, a Nigerian brand celebrated for its contemporary take on African fashion."],
  ["Amal Murad", "UAE - Fashion entrepreneur and designer, combining modern fashion with Middle Eastern cultural elements."],
  ["Amancio Ortega", "Spain, Founder of Inditex (Zara, Massimo Dutti, Pull&Bear, etc.)"],
  ["Amarbayasgalant", ""],
  ["American Eagle", "USA, global"],
  ["Amina Agueznay", "Morocco - A Moroccan artist famous for her traditional craftwork that blends artistic and cultural heritage in innovative ways."],
  ["Amman", ""],
  ["Amsterdam", ""],
  ["Amy Odell", ""],
  ["Anderson Cooper", ""],
  ["Andorra la Vella", ""],
  ["Andorra", ""],
  ["Andrea Fraser", ""],
  ["Andrei Molodkin", ""],
  ["Andrey Bartenev", ""],
  ["Andy Warhol", ""],
  ["Anguilla", ""],
  ["Anita Dongre", "Offers elegant ethnic wear and is known for her sustainable and ethical practices"],
  ["Ankara", ""],
  ["Ann Demeulemeester", ""],
  ["Anna Dello Russo", ""],
  ["Anna Sui", ""],
  ["Anna Wintour", "USA, Editor-in-Chief of Vogue"],
  ["Anne Avantie", ""],
  ["Annie Leibovitz", ""],
  ["Another Magazine", "UK"],
  ["Anselm Kiefer", ""],
  ["Antigua and Barbuda", ""],
  ["Antony Gormley", ""],
  ["Antwaun Sargent", ""],
  ["Anya Hindmarch", ""],
  ["Aoyama Theatre", "A popular venue for runway shows and presentations, located in Tokyo's stylish Aoyama district."],
  ["Aperture", "USA, global (focused on photography)"],
  ["Apia", ""],
  ["Arab World Institute", "Paris, France - An important cultural center promoting Arab culture, including art and fashion."],
  ["Argentina", ""],
  ["Armenia", ""],
  ["Arseny Zhilyaev", ""],
  ["Art in America", "USA"],
  ["Art Monthly", "UK"],
  ["Artforum", "USA, global"],
  ["Arthur Elgort", ""],
  ["Artnet", "USA, global"],
  ["ARTnews", "USA, global"],
  ["ArtPress", "France"],
  ["ArtReview", "UK, global"],
  ["Aruba", ""],
  ["Ashgabat", ""],
  ["ASOS", "UK, global"],
  ["Athens", ""],
  ["Australia", ""],
  ["Austria", ""],
  ["Azza Fahmy", "Egypt - Famous jewelry designer known for her contemporary interpretations of Egyptian art and history."]
];

const existing = new Set(["azzedine-alaia"]);

const exactOverrides = new Map([
  ["Al-Mubarakiah Souq", "Souq Al-Mubarakiya"],
  ["Amarbayasgalant", "Amarbayasgalant Monastery"],
  ["American Eagle", "American Eagle Outfitters"],
  ["Another Magazine", "Another Magazine"],
  ["Aoyama Theatre", "Aoyama Theatre"],
  ["Aperture", "Aperture (magazine)"],
  ["ArtPress", "Art Press"],
  ["ASOS", "ASOS.com"]
]);

const approvedSourceTitles = new Map([
  ["Al-Mubarakiah Souq", ["Souq Al-Mubarakiya"]],
  ["Amarbayasgalant", ["Amarbayasgalant Monastery"]],
  ["American Eagle", ["American Eagle Outfitters"]],
  ["ArtPress", ["Art press"]],
  ["ASOS", ["ASOS plc", "ASOS.com"]]
]);

const peopleNoReverse = new Set(["Ai Weiwei"]);

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[ßẞ]/g, "ss")
    .replace(/[æÆ]/g, "ae")
    .replace(/[œŒ]/g, "oe")
    .replace(/[øØ]/g, "o")
    .replace(/[đĐ]/g, "d")
    .replace(/[þÞ]/g, "th")
    .replace(/[ðÐ]/g, "d")
    .replace(/[łŁ]/g, "l")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яё\s-]/gi, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function reversePersonTitle(title, summary) {
  if (peopleNoReverse.has(title)) return title;
  const hint = `${summary.description || ""} ${summary.extract || ""}`.toLowerCase();
  const personWords = [
    "born", "artist", "designer", "photographer", "editor", "journalist",
    "curator", "collector", "businessman", "businesswoman", "writer",
    "painter", "sculptor", "critic", "architect", "model"
  ];
  if (!personWords.some(word => hint.includes(word))) return title;
  const parts = title.split(/\s+/);
  if (parts.length < 2 || parts.length > 4) return title;
  return `${parts.at(-1)}, ${parts.slice(0, -1).join(" ")}`;
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Indexmod/1.0 (https://indexmod.press)"
    }
  });
  if (!response.ok) return null;
  return response.json();
}

async function searchTitle(topic) {
  const query = exactOverrides.get(topic) || topic;
  const direct = await fetchJson(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
  );
  if (isUsableSummary(topic, direct)) return direct;

  const params = new URLSearchParams({
    action: "opensearch",
    search: query,
    limit: "1",
    namespace: "0",
    format: "json"
  });
  const search = await fetchJson(`https://en.wikipedia.org/w/api.php?${params}`);
  const found = Array.isArray(search) && search[1] && search[1][0];
  if (!found) return isUsableSummary(topic, direct) ? direct : null;
  const foundSummary = await fetchJson(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(found)}`
  );
  return isUsableSummary(topic, foundSummary) ? foundSummary : null;
}

function comparable(value = "") {
  return slugify(value)
    .replace(/\bplc\b/g, "")
    .replace(/\bcom\b/g, "")
    .replace(/\boutfitters\b/g, "eagle")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function isUsableSummary(topic, summary) {
  if (!summary || summary.type === "disambiguation" || !summary.extract) return false;
  const approved = approvedSourceTitles.get(topic);
  if (approved && approved.includes(summary.title)) return true;
  const topicKey = comparable(topic);
  const summaryKey = comparable(summary.title || "");
  return topicKey === summaryKey;
}

function typeLabel(topic, summary, note) {
  const text = `${topic} ${summary.description || ""} ${summary.extract || ""} ${note}`.toLowerCase();
  if (text.includes("country") || ["Albania", "Andorra", "Anguilla", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria"].includes(topic)) return "country or territory";
  if (text.includes("city") || ["Almaty", "Amman", "Amsterdam", "Andorra la Vella", "Ankara", "Apia", "Ashgabat", "Athens"].includes(topic)) return "city";
  if (text.includes("magazine") || text.includes("publication") || text.includes("news")) return "publication";
  if (text.includes("platform") || text.includes("fashion week") || text.includes("event")) return "institution, place, or venue";
  if (text.includes("brand") || text.includes("company") || text.includes("retailer")) return "brand or company";
  if (text.includes("museum") || text.includes("institute") || text.includes("avenue") || text.includes("theatre") || text.includes("souq") || text.includes("monastery")) return "institution, place, or venue";
  if (text.includes("artist") || text.includes("designer") || text.includes("photographer") || text.includes("editor") || text.includes("journalist") || text.includes("curator") || text.includes("business")) return "person";
  return "topic";
}

function firstParagraph(topic, title, summary, note) {
  const label = typeLabel(topic, summary, note);
  const article = /^[aeiou]/i.test(label) ? "an" : "a";
  const extract = summary.extract || "";
  if (extract) {
    return `**${topic}** is ${article} ${label} included in the Indexmod 2026 topic list. ${extract.replace(/\s+/g, " ")}[1]`;
  }
  const cleanNote = note.replace(/[.。]\s*$/, "");
  const context = cleanNote ? ` The 2026 list identifies the topic as ${cleanNote}.` : "";
  return `**${topic}** is ${article} ${label} included in the Indexmod 2026 topic list.${context} This entry records the topic as a reference point for fashion, art, design, media, geography, or cultural infrastructure.`;
}

function articleFor(topic, note, summary) {
  const slug = slugify(topic);
  const title = reversePersonTitle(topic, summary);
  const sourceUrl = summary.content_urls?.desktop?.page || "https://indexmod.press/2026";
  const wikidata = summary.wikibase_item ? `https://www.wikidata.org/wiki/${summary.wikibase_item}` : "";
  const image = summary.originalimage?.source || summary.thumbnail?.source || "";
  const credit = image
    ? `Wikimedia Commons or Wikipedia image file, license and author as stated on the source file page.`
    : "";
  const noteLine = note
    ? `Within the Indexmod list, the topic is contextualized as: ${note} This description should be read as an editorial orientation rather than a substitute for independent documentation.`
    : `Within Indexmod, the topic is relevant as part of the wider network of fashion, art, design, media, institutions, cities, and cultural geography.`;
  const label = typeLabel(topic, summary, note);
  const article = /^[aeiou]/i.test(label) ? "an" : "a";
  const imageBlock = image ? `\n{{page:image}}\n\n*Image credit: ${credit}*\n` : "";
  const chronologyYear = summary.timestamp ? summary.timestamp.slice(0, 4) : "2026";
  const citation2 = wikidata ? `\n\n**[2]** [${wikidata}](${wikidata})` : "";

  return `---\ntitle: ${title}\nslug: ${slug}\ncreated: ${updated}\nupdated: ${updated}\nimage: ${image}\ncredit: ${credit}\n---\n\n***Updated ${updated}***\n\n${firstParagraph(topic, title, summary, note)}\n${imageBlock}\n## Context\n\n${noteLine}\n\nThe topic is treated here as a concise encyclopedia entry. Where the available source record is broad, the article emphasizes the aspects most relevant to Indexmod: fashion systems, visual culture, publishing, cultural institutions, places of presentation, and the circulation of style or artistic practice.\n\n## Significance\n\nAs ${article} ${label}, ${topic} can be connected to questions of cultural production, public visibility, creative economies, and the ways fashion and art are documented. The importance of the topic may vary by region and period, so this article distinguishes the stable identification of the subject from more interpretive claims about influence.\n\n## Chronology\n\n| Year | Event |\n|---|---|\n| ${chronologyYear} | Source data for this entry was checked for the Indexmod 2026 article set.[1] |\n| 2026 | The topic appears in the Indexmod 2026 list of pages in progress. |\n\n## See also\n\n- [Fashion](/fashion)\n- [Art](/art)\n- [Design](/design)\n- [Photography](/photography)\n- [Fashion media](/fashion-media)\n\n## Citations\n\n**[1]** [${sourceUrl}](${sourceUrl})${citation2}\n`;
}

await fs.mkdir(outDir, { recursive: true });
for (const entry of await fs.readdir(outDir)) {
  if (entry.endsWith(".md") || entry === "manifest.json") {
    await fs.unlink(path.join(outDir, entry));
  }
}

const manifest = [];
for (const [topic, note] of topics) {
  const slug = slugify(topic);
  if (existing.has(slug)) continue;
  const summary = (await searchTitle(topic)) || {};
  const content = articleFor(topic, note, summary);
  await fs.writeFile(path.join(outDir, `${slug}.md`), content, "utf8");
  manifest.push({ topic, slug, sourceTitle: summary.title || null, hasImage: Boolean(summary.originalimage || summary.thumbnail) });
  await new Promise(resolve => setTimeout(resolve, 120));
}

await fs.writeFile(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
console.log(`Generated ${manifest.length} articles in ${outDir}`);
