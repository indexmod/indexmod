import fs from "node:fs/promises";
import path from "node:path";

const updated = "2026-08-23";
const outDir = path.resolve("generated-articles/a");

const topics = [
  ["African Fashion International", "institution", "African Fashion International is a South African fashion platform associated with designer showcases and the international visibility of African fashion."],
  ["Agnes Gund", "person", ""],
  ["Ahmed Mater", "person", "Ahmed Mater is a Saudi artist and photographer whose work is often discussed in relation to social change, urban development, and contemporary life in Saudi Arabia."],
  ["Ai Weiwei", "person", ""],
  ["Akira Minagawa", "person", "Akira Minagawa is a Japanese designer and the founder of mina perhonen, a fashion and textile brand known for hand-drawn patterns and long-term design thinking."],
  ["Akira Naka", "person", "Akira Naka is a Japanese fashion designer whose namesake label is associated with knitwear, tailoring, and contemporary womenswear."],
  ["Al-Mubarakiah Souq", "place", "Souq Al-Mubarakiya is a historic market in Kuwait City where traditional commerce, dress, food, and everyday urban culture remain visible."],
  ["Alasdair McLellan", "person", ""],
  ["Albania", "country or territory", ""],
  ["Aleksei Kruchyonykh", "person", ""],
  ["Alexander Kosolapov", "person", ""],
  ["Alexander Rodchenko", "person", ""],
  ["Alexandra Shulman", "person", ""],
  ["Alexandre Herchcovitch", "person", "Alexandre Herchcovitch is a Brazilian fashion designer known for his work in Brazilian and international fashion."],
  ["Alexi Lubomirski", "person", ""],
  ["Ali Banisadr", "person", "Ali Banisadr is an Iranian-born artist whose large-scale abstract paintings are often read through memory, conflict, migration, and sensory experience."],
  ["Almaty", "city", ""],
  ["Alserkal Avenue", "place", "Alserkal Avenue is a cultural district in Dubai with galleries, arts organisations, design spaces, and fashion-related events."],
  ["Altanshagai", "person", "Altanshagai is treated here as a cultural figure requiring further source development before a fuller Indexmod article is written."],
  ["Altuzarra", "brand", "Altuzarra is a New York-based luxury womenswear brand founded by designer Joseph Altuzarra in 2008."],
  ["Amaka Osakwe", "person", "Amaka Osakwe is a Nigerian fashion designer and the founder of Maki Oh, a label known for contemporary interpretations of African textile and dress traditions."],
  ["Amal Murad", "person", "Amal Murad is a UAE-based fashion designer associated with abaya design, modest wear, and contemporary Middle Eastern fashion."],
  ["Amancio Ortega", "person", "Amancio Ortega is a Spanish businessperson and the founder of Inditex, the group behind Zara and other global retail brands."],
  ["Amarbayasgalant", "place", "Amarbayasgalant Monastery is a major Buddhist monastic complex in Mongolia and an important site of architecture, religious heritage, and craft history."],
  ["American Eagle", "brand", "American Eagle is a US-based apparel and lifestyle retail brand associated with casualwear and youth-oriented fashion retail."],
  ["Amina Agueznay", "person", "Amina Agueznay is a Moroccan artist whose practice connects architecture, jewellery, textiles, installation, and craft traditions."],
  ["Amman", "city", ""],
  ["Amsterdam", "city", ""],
  ["Amy Odell", "person", ""],
  ["Anderson Cooper", "person", ""],
  ["Andorra la Vella", "city", ""],
  ["Andorra", "country or territory", ""],
  ["Andrea Fraser", "person", ""],
  ["Andrei Molodkin", "person", ""],
  ["Andrey Bartenev", "person", ""],
  ["Andy Warhol", "person", ""],
  ["Anguilla", "country or territory", ""],
  ["Anita Dongre", "person", "Anita Dongre is an Indian fashion designer known for womenswear, bridalwear, craft collaborations, and sustainability-oriented fashion practice."],
  ["Ankara", "city", ""],
  ["Ann Demeulemeester", "person", ""],
  ["Anna Dello Russo", "person", ""],
  ["Anna Sui", "person", ""],
  ["Anna Wintour", "person", "Anna Wintour is a fashion editor associated with Vogue and the institutional power of fashion media."],
  ["Anne Avantie", "person", ""],
  ["Annie Leibovitz", "person", ""],
  ["Another Magazine", "publication", "AnOther Magazine is a UK-based fashion, art, and culture publication."],
  ["Anselm Kiefer", "person", ""],
  ["Antigua and Barbuda", "country or territory", ""],
  ["Antony Gormley", "person", ""],
  ["Antwaun Sargent", "person", ""],
  ["Anya Hindmarch", "person", ""],
  ["Aoyama Theatre", "place", "Aoyama Theatre was a Tokyo venue associated with performance, presentation, and the cultural life of the Aoyama district."],
  ["Aperture", "publication", "Aperture is a photography publisher and arts organisation known for Aperture magazine, books, exhibitions, and photography criticism."],
  ["Apia", "city", ""],
  ["Arab World Institute", "institution", "The Arab World Institute is a Paris cultural institution devoted to Arab culture, exhibitions, education, and public programmes."],
  ["Argentina", "country or territory", ""],
  ["Armenia", "country or territory", ""],
  ["Arseny Zhilyaev", "person", "Arseny Zhilyaev is a Russian artist whose projects often use exhibitions, museums, archives, and speculative histories as artistic media."],
  ["Art in America", "publication", "Art in America is a US art magazine covering contemporary art, exhibitions, criticism, and the art market."],
  ["Art Monthly", "publication", "Art Monthly is a UK contemporary art magazine focused on criticism, reviews, and debate."],
  ["Artforum", "publication", "Artforum is an international contemporary art magazine based in the United States."],
  ["Arthur Elgort", "person", ""],
  ["Artnet", "publication", "Artnet is an online art-market and art-news platform."],
  ["ARTnews", "publication", "ARTnews is an art magazine and online publication covering visual art, museums, galleries, artists, and the art market."],
  ["ArtPress", "publication", "Art Press is a French contemporary art magazine."],
  ["ArtReview", "publication", "ArtReview is a London-based contemporary art magazine and publishing platform."],
  ["Aruba", "country or territory", ""],
  ["Ashgabat", "city", ""],
  ["ASOS", "brand", "ASOS is a UK-based online fashion retailer with international e-commerce operations."],
  ["Athens", "city", ""],
  ["Australia", "country or territory", ""],
  ["Austria", "country or territory", ""],
  ["Azza Fahmy", "person", "Azza Fahmy is an Egyptian jewellery designer known for contemporary jewellery informed by Egyptian and Middle Eastern visual culture."]
];

const sourceOverrides = new Map([
  ["African Fashion International", [{ label: "African Fashion International", url: "https://africanfashioninternational.com/" }]],
  ["Akira Minagawa", [{ label: "mina perhonen - About", url: "https://www.mina-perhonen.jp/en/about/" }]],
  ["Akira Naka", [{ label: "AKIRA NAKA - About", url: "https://akiranaka.com/about/" }]],
  ["Altanshagai", [{ label: "Fantastic Production - Altanshagai", url: "https://en.fantasticproduction.mn/altanshagai" }]],
  ["Altuzarra", [{ label: "Altuzarra", url: "https://www.altuzarra.com/" }, { label: "Joseph Altuzarra", url: "https://en.wikipedia.org/wiki/Joseph_Altuzarra" }]],
  ["Amal Murad", [{ label: "Amal Murad", url: "https://amalmurad.ae/" }]],
  ["Aperture", [{ label: "Aperture", url: "https://aperture.org/" }]],
  ["Arab World Institute", [{ label: "Institut du monde arabe", url: "https://www.imarabe.org/en" }]],
  ["Arseny Zhilyaev", [{ label: "Whitechapel Gallery - Arseny Zhilyaev", url: "https://www.whitechapelgallery.org/events/arseniy-zhilyaev-conversation/" }]]
]);

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
  ["Aperture", ["Aperture (magazine)"]],
  ["ArtPress", ["Art press"]],
  ["ASOS", ["ASOS plc", "ASOS.com"]]
]);

const peopleNoReverse = new Set(["Ai Weiwei"]);

const seeAlsoByCategory = {
  person: ["[Fashion designers](/fashion-designers)", "[Artists](/artists)", "[Photography](/photography)", "[Fashion media](/fashion-media)"],
  place: ["[Cultural districts](/cultural-districts)", "[Fashion venues](/fashion-venues)", "[Museums](/museums)", "[Cities](/cities)"],
  institution: ["[Cultural institutions](/cultural-institutions)", "[Museums](/museums)", "[Exhibitions](/exhibitions)", "[Art](/art)"],
  brand: ["[Fashion brands](/fashion-brands)", "[Retail](/retail)", "[Ready-to-wear](/ready-to-wear)", "[Fashion business](/fashion-business)"],
  publication: ["[Fashion media](/fashion-media)", "[Art magazines](/art-magazines)", "[Photography](/photography)", "[Criticism](/criticism)"],
  city: ["[Fashion capitals](/fashion-capitals)", "[Cities](/cities)", "[Cultural geography](/cultural-geography)", "[Art scenes](/art-scenes)"],
  "country or territory": ["[Countries](/countries)", "[Cultural geography](/cultural-geography)", "[Fashion systems](/fashion-systems)", "[Art scenes](/art-scenes)"]
};

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

function articleWord(category) {
  return /^[aeiou]/i.test(category) ? "an" : "a";
}

function displayCategory(category) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function reversePersonTitle(title, category) {
  if (category !== "person" || peopleNoReverse.has(title)) return title;
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
  if (!found) return null;

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
  return comparable(topic) === comparable(summary.title || "");
}

function cleanExtract(summary) {
  return String(summary.extract || "").replace(/\s+/g, " ").trim();
}

function firstParagraph(topic, category, summary, description) {
  const intro = `**${topic}** is ${articleWord(category)} ${category} relevant to Indexmod's coverage of fashion, art, design, media, and cultural geography.`;
  const extract = cleanExtract(summary);
  if (extract) return `${intro} ${extract}[1]`;
  return description ? `${intro} ${description}` : intro;
}

function contextParagraph(topic, category) {
  const byCategory = {
    person: `${topic} is treated as a named creative, editorial, business, or cultural figure. The entry focuses on public practice and documented relevance rather than private biography.`,
    place: `${topic} is treated as a place or venue. The entry focuses on its role as a setting for cultural exchange, presentation, commerce, or visual identity.`,
    institution: `${topic} is treated as an institution or platform. The entry focuses on how organisations structure visibility, exhibitions, education, markets, and professional networks.`,
    brand: `${topic} is treated as a brand or company. The entry focuses on design identity, retail context, production, distribution, and public positioning.`,
    publication: `${topic} is treated as a publication or media platform. The entry focuses on editorial framing, criticism, photography, fashion coverage, and art discourse.`,
    city: `${topic} is treated as a city. The entry focuses on geography, cultural infrastructure, creative scenes, and its usefulness as a reference point for fashion and art history.`,
    "country or territory": `${topic} is treated as a country or territory. The entry focuses on cultural geography, institutions, markets, textile traditions, and the conditions in which fashion and art circulate.`
  };
  return byCategory[category];
}

function chronology(summary) {
  const rows = [];
  if (summary.timestamp) {
    rows.push(`| ${summary.timestamp.slice(0, 4)} | Source information for this article was checked.[1] |`);
  }
  rows.push(`| ${updated.slice(0, 4)} | Article prepared for the Indexmod reference corpus. |`);
  return rows.join("\n");
}

function citations(topic, summary) {
  const sources = [];
  if (summary.content_urls?.desktop?.page) {
    sources.push({ label: summary.title || topic, url: summary.content_urls.desktop.page });
  }
  if (summary.wikibase_item) {
    sources.push({ label: `Wikidata ${summary.wikibase_item}`, url: `https://www.wikidata.org/wiki/${summary.wikibase_item}` });
  }
  if (!sources.length && sourceOverrides.has(topic)) {
    sources.push(...sourceOverrides.get(topic));
  }
  if (!sources.length) return "";

  return `\n## Citations\n\n${sources.map((source, index) => `**[${index + 1}]** [${source.label}](${source.url})`).join("\n\n")}\n`;
}

function articleFor(topic, category, description, summary) {
  const slug = slugify(topic);
  const title = reversePersonTitle(topic, category);
  const candidateImage = summary.originalimage?.source || summary.thumbnail?.source || "";
  const image = candidateImage.includes("/wikipedia/commons/") ? candidateImage : "";
  const credit = image ? "Wikimedia Commons or Wikipedia image file; license and author as stated on the source file page." : "";
  const imageBlock = image ? `\n{{page:image}}\n\n*Image credit: ${credit}*\n` : "";
  const seeAlso = (seeAlsoByCategory[category] || seeAlsoByCategory.person).map(item => `- ${item}`).join("\n");

  return `---\ntitle: ${title}\nslug: ${slug}\ncreated: ${updated}\nupdated: ${updated}\nimage: ${image}\ncredit: ${credit}\n---\n\n***Updated ${updated}***\n\n${firstParagraph(topic, category, summary, description)}\n${imageBlock}\n## Category\n\n**Category:** ${displayCategory(category)}\n\n## Context\n\n${contextParagraph(topic, category)}\n\n## Significance\n\nAs ${articleWord(category)} ${category}, ${topic} helps connect individual entries in Indexmod to broader systems of authorship, place, image-making, publishing, commerce, and cultural memory. Where the available record is incomplete, this article keeps claims concise and separates identification from interpretation.\n\n## Chronology\n\n| Year | Event |\n|---|---|\n${chronology(summary)}\n\n## See also\n\n${seeAlso}\n${citations(topic, summary)}`;
}

await fs.mkdir(outDir, { recursive: true });
for (const entry of await fs.readdir(outDir)) {
  if (entry.endsWith(".md") || entry === "manifest.json") {
    await fs.unlink(path.join(outDir, entry));
  }
}

const manifest = [];
for (const [topic, category, description] of topics) {
  const slug = slugify(topic);
  const summary = (await searchTitle(topic)) || {};
  const content = articleFor(topic, category, description, summary);
  await fs.writeFile(path.join(outDir, `${slug}.md`), content, "utf8");
  manifest.push({
    topic,
    slug,
    category,
    sourceTitle: summary.title || null,
    hasManualSource: sourceOverrides.has(topic),
    hasImage: Boolean(summary.originalimage || summary.thumbnail)
  });
  await new Promise(resolve => setTimeout(resolve, 120));
}

await fs.writeFile(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
console.log(`Generated ${manifest.length} articles in ${outDir}`);
