import fs from "node:fs";
import path from "node:path";

const root = "generated-articles/a";
const sourceDir = path.join(root, "source");
const outDir = root;
const acceptedTest = "";
const updated = "2026-08-25";

fs.mkdirSync(sourceDir, { recursive: true });
fs.mkdirSync(outDir, { recursive: true });

await prepareSources();

const wanted = JSON.parse(fs.readFileSync(path.join(root, "wanted.json"), "utf8"));
const accepted = extractAccepted(acceptedTest);

const categoryBySlug = {
  "about-clothing": "Brand",
  "abraham-thakore": "Brand",
  "abu-dhabi": "City",
  "abu-jani-sandeep-khosla": "Brand",
  "created": "Exhibition",
  "acne-studios": "Brand",
  "adelaide-fashion-festival": "Fashion event",
  "adjara-fashion-week": "Fashion event",
  "aesf": "Artist collective",
  "afghanistan": "Country or territory",
  "afisha-magazine": "Publication",
  "africa-toto": "Music",
  "africa-fashion-week": "Fashion event",
  "africa-fashion-week-london": "Fashion event",
  "africa-fashion-week-nigeria": "Fashion event",
  "african-art-centre": "Institution",
  "african-fashion": "Fashion concept",
  "african-fashion-international": "Institution",
  "african-fashion-week-toronto": "Fashion event",
  "armen-agop": "Person",
  "amina-agueznay": "Person",
  "ai-weiwei": "Person",
  "aksenov-aleksei": "Person",
  "akulinichev-kirill": "Person",
  "al-mubarakiah-souq": "Place",
  "al-numan-leila": "Person",
  "azzedine-alaia": "Person",
  "albania": "Country or territory",
  "alberta-fashion-week": "Fashion event",
  "alexander-maxim": "Person",
  "almaty": "City",
  "alserkal-avenue": "Place",
  "altanshagai": "Person",
  "altuzarra": "Brand",
  "amarbayasgalant": "Place",
  "american-eagle": "Brand",
  "amirkhanova-shakri": "Person",
  "amman": "City",
  "amsterdam": "City",
  "amsterdam-fashion-week": "Fashion event",
  "andorra": "Country or territory",
  "andorra-la-vella": "City",
  "oksana-andreieva-antii-gonna": "Person",
  "anguilla": "Country or territory",
  "ankara": "City",
  "another-magazine": "Publication",
  "antigua-and-barbuda": "Country or territory",
  "aoyama-theatre": "Venue",
  "aperture": "Publication",
  "apia": "City",
  "apocalypses": "Archive",
  "arab-world-institute": "Institution",
  "archive-store": "Store",
  "argentina": "Country or territory",
  "armenia": "Country or territory",
  "armenian-fashion-week": "Fashion event",
  "art-in-america": "Publication",
  "art-monthly": "Publication",
  "art-newspaper-the": "Publication",
  "artcom-media": "Media group",
  "artfido": "Media platform",
  "artforum": "Publication",
  "artmajeur": "Media platform",
  "artnet": "Media platform",
  "artnews": "Publication",
  "artpress": "Publication",
  "artreview": "Publication",
  "artyomov-andrey": "Person",
  "aruba": "Country or territory",
  "alexander-arutyunov-brand": "Brand",
  "alexander-arutyunov-jewelry": "Jewellery",
  "as-seen-below-the-dome": "Artwork",
  "ashgabad-fashion-week": "Fashion event",
  "ashgabat": "City",
  "asia-world-fashion-week": "Fashion event",
  "asos": "Brand",
  "astafyev-gleb": "Person",
  "athens": "City",
  "australia": "Country or territory",
  "australian-fashion-chamber": "Institution",
  "austria": "Country or territory",
  "anne-avantie": "Person",
  "axenoff-jewellery": "Jewellery",
  "azerbaijan-fashion-week": "Fashion event"
};

const fallbackSources = {
  "aesf": [
    ["AES+F Artist Residency Award 2022", "https://aesf.art/page/aesf-artist-residency-award-at-iscp_2022/"],
    ["AES+F — Predictions and Revelations", "https://aesf.art/news/predictions-and-revelations/"],
    ["Gropius Bau — AES+F. The Trilogy", "https://www.berlinerfestspiele.de/en/gropius-bau/programm/2012/ausstellungen/aesf-die-trilogie"],
    ["LABoral — Last Riot", "https://laboralcentrodearte.org/en/artworks/last-riot-2007-2/"]
  ],
  "artcom-media": [["Artcom Media", "https://artcommedia.ru/"]],
  "artfido": [["Artfido", "https://www.artfido.com/"]],
  "art-newspaper-the": [["The Art Newspaper", "https://www.theartnewspaper.com/"]],
  "artmajeur": [["ArtMajeur", "https://www.artmajeur.com/"]],
  "archive-store": [["Archive Store", "https://archivestore.nl/"]],
  "amsterdam-fashion-week": [["Amsterdam Fashion Week", "https://amsterdamfashionweek.nl/"]],
  "armenian-fashion-week": [["Armenian Fashion Week", "https://www.instagram.com/armenianfashionweek/"]],
  "australian-fashion-chamber": [["Australian Fashion Council", "https://ausfashioncouncil.com/"]],
  "azerbaijan-fashion-week": [["Azerbaijan Fashion Week", "https://www.instagram.com/azerbaijanfashionweek/"]],
  "axenoff-jewellery": [["Axenoff Jewellery", "https://axenoffjewellery.com/"]],
  "alberta-fashion-week": [["Western Canada Fashion Week", "https://westerncanadafashionweek.com/"]],
  "africa-toto": [["Toto — Africa", "https://en.wikipedia.org/wiki/Africa_(Toto_song)"]],
  "akulinichev-kirill": [["Akhmadullina Dreams", "https://akhmadullinadreams.com/"]],
  "amirkhanova-shakri": [["Tatler Russia — Shakri Amirkhanova", "https://www.tatler.ru/geroi/shakri-amirhanova"]],
  "apocalypses": [["Garage Archive Collection", "https://archive.garagemca.org/"]],
  "as-seen-below-the-dome": [["Moscow Museum of Modern Art", "https://mmoma.ru/"]],
  "astafyev-gleb": [["Gleb Astafyev", "https://www.instagram.com/glebastafyev/"]]
};

const seeAlsoByCategory = {
  "Brand": ["[Fashion brands](/fashion-brands)", "[Ready-to-wear](/ready-to-wear)", "[Fashion business](/fashion-business)"],
  "Fashion event": ["[Fashion weeks around the world](/fashion-weeks-around-the-world)", "[Fashion capitals](/fashion-capitals)", "[Fashion systems](/fashion-systems)"],
  "Publication": ["[Fashion media](/fashion-media)", "[Art magazines](/art-magazines)", "[Criticism](/criticism)"],
  "Media platform": ["[Fashion media](/fashion-media)", "[Digital culture](/digital-culture)", "[Art magazines](/art-magazines)"],
  "Media group": ["[Fashion media](/fashion-media)", "[Digital culture](/digital-culture)", "[Advertising](/advertising)"],
  "Person": ["[Fashion designers](/fashion-designers)", "[Artists](/artists)", "[Fashion media](/fashion-media)"],
  "Artist collective": ["[Artists](/artists)", "[Installation art](/installation-art)", "[Video art](/video-art)"],
  "Country or territory": ["[Countries](/countries)", "[Cultural geography](/cultural-geography)", "[Fashion systems](/fashion-systems)"],
  "City": ["[Cities](/cities)", "[Cultural geography](/cultural-geography)", "[Fashion capitals](/fashion-capitals)"],
  "Institution": ["[Cultural institutions](/cultural-institutions)", "[Museums](/museums)", "[Exhibitions](/exhibitions)"],
  "Place": ["[Cultural districts](/cultural-districts)", "[Cities](/cities)", "[Exhibitions](/exhibitions)"],
  "Venue": ["[Fashion venues](/fashion-venues)", "[Performance](/performance)", "[Cities](/cities)"],
  "Jewellery": ["[Jewellery](/jewellery)", "[Craft](/craft)", "[Fashion brands](/fashion-brands)"],
  "Store": ["[Retail](/retail)", "[Fashion business](/fashion-business)", "[Fashion brands](/fashion-brands)"],
  "Fashion concept": ["[Textiles](/textiles)", "[Fashion systems](/fashion-systems)", "[African fashion](/african-fashion)"],
  "Archive": ["[Archives](/archives)", "[Fashion media](/fashion-media)", "[Cultural memory](/cultural-memory)"],
  "Artwork": ["[Art](/art)", "[Installation art](/installation-art)", "[Exhibitions](/exhibitions)"],
  "Music": ["[Popular culture](/popular-culture)", "[Media](/media)", "[Cultural memory](/cultural-memory)"],
  "Exhibition": ["[Exhibitions](/exhibitions)", "[Moscow Fashion Week](/moscow-fashion-week)", "[Art scenes](/art-scenes)"]
};

const report = [];
for (const item of wanted) {
  const slug = item.slug;
  let markdown = accepted.get(slug);
  if (!markdown) markdown = buildFromR2(item);
  markdown = customArticle(slug) || markdown;
  markdown = finalTidy(markdown, slug);
  fs.writeFileSync(path.join(outDir, `${slug}.md`), markdown, "utf8");
  report.push({ slug, title: item.title, bytes: Buffer.byteLength(markdown), status: "written" });
}

fs.writeFileSync(path.join(root, "manifest.json"), JSON.stringify(wanted.map(({slug,title}) => ({slug,title})), null, 2));
fs.writeFileSync(path.join(root, "report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ written: report.length, outDir }, null, 2));

async function prepareSources() {
  const listResponse = await fetchWithTimeout("https://indexmod.press/_list");
  if (!listResponse.ok) throw new Error(`Failed to fetch _list: ${listResponse.status}`);
  const list = await listResponse.json();
  const wanted = list
    .filter(x => x.title && x.title.localeCompare("About (clothing)") >= 0 && x.title.localeCompare("Azerbaijan Fashion Week") <= 0)
    .sort((a, b) => a.title.localeCompare(b.title));
  fs.writeFileSync(path.join(root, "wanted.json"), JSON.stringify(wanted, null, 2));
  for (const [index, item] of wanted.entries()) {
    console.log(`source ${index + 1}/${wanted.length} ${item.slug}`);
    const response = await fetchWithTimeout(`https://indexmod.press/_get/${encodeURIComponent(item.slug)}`);
    const body = response.ok ? await response.text() : JSON.stringify({ error: "not found", status: response.status });
    fs.writeFileSync(path.join(sourceDir, `${item.slug}.json`), body);
  }
}

async function fetchWithTimeout(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function aesfArticle() {
  return `---
title: AES+F
slug: aesf
created: 2026-08-25
updated: 2026-08-25
image: https://upload.wikimedia.org/wikipedia/commons/e/e5/AES%2BF_in_Venice%2C_2015.jpg
credit: Asvyatsky / Wikimedia Commons. CC BY-SA 4.0; background poster by AES+F.
---

***Updated 2026-08-25***

**AES+F** is a Russian artist collective known for large-scale video installations, photography, digital collage, sculpture and immersive exhibition projects. The group was formed as **AES Group** in 1987 by **Tatiana Arzamasova**, **Lev Evzovich** and **Evgeny Svyatsky**; it became AES+F after photographer **Vladimir Fridkes** joined in 1995.[1]

{{page:image}}

*Image: Opening of AES+F's Inverso Mundus at the Venice Biennale, 2015. Photograph by Asvyatsky; background poster by AES+F. Wikimedia Commons, CC BY-SA 4.0.*

## Work

AES+F uses staged imagery, computer-generated environments, opera, advertising aesthetics, mythological references and global media culture. Its projects often present polished allegorical worlds in which luxury, violence, spectacle and social anxiety occupy the same visual system.[1][2]

The collective is especially associated with the **Liminal Space Trilogy**: **Last Riot** (2005-2007), **The Feast of Trimalchio** (2009-2010) and **Allegoria Sacra** (2011). **Last Riot** represented Russia at the 2007 Venice Biennale, and later trilogy presentations helped establish AES+F as a major post-Soviet video-art collective.[2][3]

## Chronology

| Year | Event |
|---|---|
| 1987 | AES Group was formed by Arzamasova, Evzovich and Svyatsky.[1] |
| 1995 | Vladimir Fridkes joined; the group became AES+F.[1] |
| 2007 | Last Riot was presented in the Russian Pavilion at the Venice Biennale.[3] |
| 2012 | Gropius Bau presented AES+F. The Trilogy in Berlin.[3] |
| 2019 | Manege Central Exhibition Hall in St. Petersburg presented AES+F. Predictions and Revelations.[2] |

## See also

- [Artists](/artists)
- [Installation art](/installation-art)
- [Video art](/video-art)

## Citations

**[1]** [AES+F Artist Residency Award 2022](https://aesf.art/page/aesf-artist-residency-award-at-iscp_2022/)

**[2]** [AES+F — Predictions and Revelations](https://aesf.art/news/predictions-and-revelations/)

**[3]** [Gropius Bau — AES+F. The Trilogy](https://www.berlinerfestspiele.de/en/gropius-bau/programm/2012/ausstellungen/aesf-die-trilogie)

**[4]** [LABoral — Last Riot](https://laboralcentrodearte.org/en/artworks/last-riot-2007-2/)
`;
}

function customArticle(slug) {
  if (slug === "altanshagai") {
    return `---
title: Altanshagai
slug: altanshagai
created: 2026-08-23
updated: 2026-08-25
image: 
credit: 
---

***Updated 2026-08-25***

**Altanshagai** is a Mongolian cultural figure documented through Fantastic Production. Publicly available information in English is limited; the available source identifies Altanshagai in relation to performance, media production and contemporary Mongolian cultural work.[1]

## Context

Because the published source record is narrow, this article avoids unsupported biographical claims. The entry is retained as a reference point for future documentation of Mongolian creative scenes, performance networks and fashion-adjacent cultural production.

## See also

- [Artists](/artists)
- [Cultural geography](/cultural-geography)
- [Fashion media](/fashion-media)

## Citations

**[1]** [Fantastic Production — Altanshagai](https://en.fantasticproduction.mn/altanshagai)
`;
  }

  if (slug === "arab-world-institute") {
    return `---
title: Arab World Institute
slug: arab-world-institute
created: 2026-08-23
updated: 2026-08-25
image: 
credit: 
---

***Updated 2026-08-25***

**Arab World Institute** is a cultural institution in Paris devoted to Arab culture, history, art, language and public education. Founded through cooperation between France and Arab League member states, the institute presents exhibitions, talks, screenings, concerts, educational programmes and research resources connected with the Arab world.[1]

## Cultural role

The institution is relevant to fashion and art history through its exhibitions and public programmes on visual culture, architecture, photography, craft, design, heritage and contemporary artistic production. It also functions as a Paris reference point for cultural exchange between Europe, North Africa and the Middle East.

## See also

- [Cultural institutions](/cultural-institutions)
- [Museums](/museums)
- [Exhibitions](/exhibitions)

## Citations

**[1]** [Institut du monde arabe](https://www.imarabe.org/en)
`;
  }

  return "";
}

function extractAccepted(file) {
  const map = new Map();
  if (!fs.existsSync(file)) return map;
  const md = fs.readFileSync(file, "utf8");
  for (const match of md.matchAll(/~~~markdown\n([\s\S]*?)\n~~~/g)) {
    const article = match[1].trim() + "\n";
    const slug = article.match(/^slug:\s*(.+)$/m)?.[1]?.trim();
    if (slug) map.set(slug, article);
  }
  return map;
}

function buildFromR2(item) {
  if (item.slug === "aesf") return aesfArticle();
  const sourcePath = path.join(sourceDir, `${item.slug}.json`);
  const page = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
  if (page.error) throw new Error(`No source for ${item.slug}`);
  const raw = page.raw || "";
  const fm = parseFrontmatter(raw);
  const category = categoryBySlug[item.slug] || "Topic";
  const title = page.title || fm.title || item.title;
  const created = normalizeDate(fm.created || fm.date || page.created) || "2018-01-02";
  const image = (fm.image || page.image || "").trim();
  const credit = (fm.credit || fm.credits || "").trim();
  const sources = collectSources(raw, item.slug);
  let body = stripFrontmatter(raw);
  body = cleanBody(body, title, category);
  if (!body || body.length < 80) body = fallbackIntro(title, category);

  const parts = [];
  parts.push("---");
  parts.push(`title: ${yaml(title)}`);
  parts.push(`slug: ${item.slug}`);
  parts.push(`created: ${created}`);
  parts.push(`updated: ${updated}`);
  parts.push(`image: ${image}`);
  parts.push(`credit: ${yaml(credit)}`);
  parts.push("---\n");
  parts.push(`***Updated ${updated}***\n`);
  parts.push(body);
  if (image && !body.includes("{{page:image}}")) {
    const caption = credit ? `*Image credit: ${credit}*` : "*Image credit: source and license as stated in the article metadata.*";
    const first = body.split(/\n{2,}/);
    parts[parts.length - 1] = [first[0], "{{page:image}}", caption, ...first.slice(1)].join("\n\n");
  }
  if (!/## See also/.test(parts.join("\n"))) {
    parts.push("\n## See also\n");
    parts.push((seeAlsoByCategory[category] || ["[Fashion](/fashion)", "[Art](/art)", "[Design](/design)"]).map(x => `- ${x}`).join("\n"));
  }
  if (!/## Citations/.test(parts.join("\n"))) {
    parts.push("\n## Citations\n");
    parts.push((sources.length ? sources : (fallbackSources[item.slug] || [])).map((s, i) => `**[${i + 1}]** [${escapeMd(s[0])}](${s[1]})`).join("\n\n"));
  }
  return parts.join("\n").trim() + "\n";
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---/);
  const out = {};
  if (!match) return out;
  for (const line of match[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i === -1) continue;
    out[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return out;
}

function stripFrontmatter(raw) {
  return raw.replace(/^---\s*\n[\s\S]*?\n---\s*/, "");
}

function cleanBody(body, title, category) {
  let text = body
    .replace(/\n*<!--\s*(?:INDEXMOD(?: ADMIN)? PROMPT|Prompt:)[\s\S]*?-->\s*$/gi, "")
    .replace(/\*\*\*Updated\s+\d{4}-\d{2}-\d{2}\*\*\*/g, "")
    .replace(/\[\*\*(\d+)\*\*\]/g, "[$1]")
    .replace(/\*\*\[(\d+)\]\*\*/g, "[$1]")
    .replace(/^#\s+.*$/gm, "")
    .replace(/Here(?:'|’)s a detailed overview:?\s*/gi, "")
    .replace(/Here are key details about the event:?\s*/gi, "")
    .replace(/\bupcoming\b/gi, "documented");

  text = text.replace(new RegExp(`^\\*\\*${escapeRe(title)}\\*\\*\\s+is\\s+[^.]*?relevant to Indexmod's coverage of fashion, art, design, media, and cultural geography\\.\\s*`, "i"), "");
  text = text.replace(/^.*?\s+relevant to Indexmod's coverage of fashion, art, design, media, and cultural geography\.\s*/gim, "");
  text = removeSection(text, "Category");
  text = removeSection(text, "Context");
  text = removeSection(text, "Significance");
  text = text.replace(/\n## Chronology\n\n\| Year \| Event \|\n\|---\|---\|\n(?:\| 20\d{2} \| (?:Source information|Article prepared)[^\n]+\|\n?)+/gi, "");
  text = text.replace(/^.*?\bis treated as\b[^\n]*\n?/gim, "");
  text = text.replace(/^As an? [^,\n]+, .*?helps connect individual entries in Indexmod[^\n]*\n?/gim, "");
  text = text.replace(/^.*?helps connect individual entries in Indexmod[^\n]*\n?/gim, "");
  text = text.replace(/Where the available record is incomplete[^\n]*\n?/gim, "");
  text = text.replace(/^[-*]\s+\*\*Next Event\*\*:[^\n]*\n?/gim, "");
  text = text.replace(/## Upcoming Events[\s\S]*?(?=\n## |\nCitations:|\n## Citations|$)/gi, "");
  text = text.replace(/Citations:\s*/g, "## Citations\n\n");
  text = normalizeSeeAlso(text);
  text = text.replace(/\n{3,}/g, "\n\n").trim();
  if (!text.startsWith(`**${title}**`) && !/^[-#|]/.test(text)) {
    text = `**${title}** ${lowerFirst(text)}`;
  }
  if (!text || /^## /.test(text) || text.length < 80) return fallbackIntro(title, category);
  return text;
}

function removeSection(text, heading) {
  return text.replace(new RegExp(`\\n## ${heading}\\n[\\s\\S]*?(?=\\n## |$)`, "gi"), "");
}

function normalizeSeeAlso(text) {
  return text.replace(/\n## См\. также\n/gi, "\n## See also\n").replace(/^\+\s+\[([^\]]+)\]\(([^)]+)\)/gm, (_, label, href) => {
    const clean = href.startsWith("/") || href.startsWith("http") ? href : `/${href}`;
    return `- [${label}](${clean})`;
  });
}

function fallbackIntro(title, category) {
  const noun = {
    "Brand": "a fashion brand",
    "Fashion event": "a fashion event",
    "Publication": "a publication",
    "Media platform": "a media platform",
    "Media group": "a media group",
    "Person": "a cultural figure",
    "City": "a city",
    "Country or territory": "a country or territory",
    "Institution": "a cultural institution",
    "Place": "a place",
    "Venue": "a venue",
    "Jewellery": "a jewellery subject",
    "Artwork": "an artwork",
    "Archive": "an archive-related subject",
    "Music": "a music and popular-culture subject",
    "Exhibition": "an exhibition project"
  }[category] || "a cultural subject";
  return `**${title}** is ${noun} documented in relation to fashion, art, design, media or cultural history. Publicly verifiable information is limited, so this entry keeps the identification concise and avoids unsupported interpretation.`;
}

function collectSources(raw, slug) {
  const out = [];
  for (const match of raw.matchAll(/\*\*\[(\d+)\]\*\*\s*\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g)) add(out, match[2], match[3]);
  for (const match of raw.matchAll(/^\[(\d+)\]\s*(https?:\/\/\S+)/gm)) add(out, match[2], match[2]);
  for (const match of raw.matchAll(/^\*\*\[(\d+)\]\s*(https?:\/\/\S+)/gm)) add(out, match[2], match[2]);
  for (const match of raw.matchAll(/\*\*(\[\d+\]\s*https?:\/\/[\s\S]*?)\*\*/g)) {
    for (const url of match[1].match(/https?:\/\/[^\s\]]+/g) || []) add(out, url, url);
  }
  for (const source of fallbackSources[slug] || []) add(out, source[0], source[1]);
  return out.filter(([label, url]) => /^https?:\/\//.test(url) && !/google\.com\/policies|pinterest\.|777ONE|^URL$/i.test(url)).slice(0, 10);
}

function add(out, label, url) {
  if (!url || !/^https?:\/\//.test(url)) return;
  url = url.replace(/[),.]+$/, "");
  if (out.some(x => x[1] === url)) return;
  out.push([label.replace(/^https?:\/\//, ""), url]);
}

function finalTidy(markdown, slug) {
  let md = markdown
    .replace(/\n*<!--\s*(?:INDEXMOD(?: ADMIN)? PROMPT|Prompt:)[\s\S]*?-->\s*$/gi, "")
    .replace(/\n*<!--\s*INDEXMOD[\s\S]*$/gi, "")
    .replace(/updated: *\n/i, `updated: ${updated}\n`)
    .replace(/update: /i, "updated: ")
    .replace(/permalink: /i, "slug: ")
    .replace(/date: /i, "created: ")
    .replace(/credits: /i, "credit: ")
    .replace(/^\*\*\*Updated\s+\d{4}-\d{2}-\d{2}\*\*\*/m, `***Updated ${updated}***`)
    .trim() + "\n";
  if (!/\n\*\*\*Updated /.test(md)) md = md.replace(/---\s*\n/, `---\n\n***Updated ${updated}***\n\n`);
  md = md.replace(/^slug:.*$/m, `slug: ${slug}`);
  md = md.replace(/^updated:.*$/m, `updated: ${updated}`);
  md = md.replace(/The brand language in the earlier Indexmod article described/g, "The historical brand language described");
  md = md.replace(/The earlier Indexmod record describes/g, "The archived project description records");
  md = md.replace(/inherited Indexmod information/g, "archived project information");
  md = md.replace(/Its relevance to Indexmod is strongest in discussions of/g, "Its relevance is strongest in discussions of");
  md = md.replace(/should be treated as historical brand positioning/g, "should be read as historical brand positioning");
  md = md.replace(/should be treated as archived project information/g, "should be read as archived project information");
  md = md.replace(/therefore treated as active design systems/g, "therefore used as active design systems");
  md = md.replace(/should therefore not automatically be treated as/g, "should therefore not automatically be read as");
  md = md.replace(/should not automatically be treated as/g, "should not automatically be read as");
  md = md.replace(/\| 2026 \| Article prepared for the Indexmod reference corpus\. \|\n?/g, "");
  md = md.replace(/\| 2026 \| Source information for this article was checked\.[^|]*\|\n?/g, "");
  md = md.replace(/^!\[[^\]]*\]\([^\n]+\)\n\n?/gm, "");
  md = md.replace(/^\*\*([^*\n]+)\*\*\s+\*\*\1\*\*/m, "**$1**");
  md = md.replace(/^\*\*African Fashion International\*\*\s+\*\*African Fashion International \(AFI\)\*\*/m, "**African Fashion International (AFI)**");
  md = md.replace(/^\*\*Amirkhanova, Shakri\*\*\s+\*\*Shakri Khizrievna Amirkhanova\*\*/m, "**Shakri Khizrievna Amirkhanova**");
  md = md.replace(/^\*\*ArtMajeur \(service\)\*\*\s+\*\*ArtMajeur\*\*/m, "**ArtMajeur**");
  md = md.replace(/relevant to Indexmod's coverage of fashion, art, design, media, and cultural geography\.?\s*/gi, "");
  md = md.replace(/^.*?\bis treated as\b[^\n]*\n?/gim, "");
  md = md.replace(/^.*?helps connect individual entries in Indexmod[^\n]*\n?/gim, "");
  md = md.replace(/\n{3,}/g, "\n\n");
  return md;
}

function normalizeDate(value) {
  return String(value || "").match(/\d{4}-\d{2}-\d{2}/)?.[0] || "";
}

function yaml(value) {
  value = String(value || "");
  return /[:#\[\]{},"'&*]|^\s|\s$/.test(value) ? JSON.stringify(value) : value;
}

function escapeMd(value) {
  return String(value).replace(/\[/g, "\\[").replace(/\]/g, "\\]");
}

function escapeRe(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function lowerFirst(value) {
  return value ? value.charAt(0).toLowerCase() + value.slice(1) : value;
}
