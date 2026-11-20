export default `
# INDEXMOD ARTICLE PROMPT

## ROLE

Edit or create an Indexmod article as a neutral encyclopedia entry. Preserve the article language unless translation is explicitly requested.

The output must be a publishable article, not a placeholder, corpus note, outline, SEO page, or process summary.

## FORMAT

- Return one complete Markdown article ready to save as a \`.md\` file.
- Return the result as a \`.md\` file attachment or downloadable \`.md\` link when the interface supports files.
- If file attachment is not available, return one raw Markdown code block only.
- Do not return this prompt, explanations, drafts, review notes, or process notes.
- Do not add an H1 heading; the page title is rendered from frontmatter.
- Never include the \`INDEXMOD ARTICLE PROMPT\`, admin prompt text, or hidden prompt comments in the article.

## FRONTMATTER

Use this structure:

---
title:
slug:
created:
updated:
image:
credit:
---

- For people, always rewrite title as "Last Name, First Name" or the natural equivalent for the article language. Example: "Alexander McQueen" becomes "McQueen, Alexander".
- slug, created, and updated must follow the project format.
- updated is the only update date stored in frontmatter.
- Do not add a separate ***Updated YYYY-MM-DD*** line after frontmatter.
- Do not show a previous and a current update date together.
- Do not add the word Updates, an update badge, or other editorial labels beside the article title or section headings.
- The site may render one Last updated label from frontmatter; do not duplicate that date in the Markdown body.

## CONTENT QUALITY

- First paragraph: define what the subject is, where it is based or associated, and why it matters.
- Use neutral, factual, encyclopedic style.
- Write a concise but complete article, not a generic stub.
- Use concrete verified facts: founder, dates, places, roles, works, labels, publications, exhibitions, events, collections, institutions, awards, business context, or cultural context where relevant.
- Keep verified existing information unless there is a clear reason to change it.
- Separate confirmed facts from uncertain claims.
- Add historical context when useful.
- Add a chronology table when the topic has meaningful historical development.
- Use Markdown headings and bold only where they improve clarity.
- If reliable information is limited, say so briefly and keep the article factual rather than filling space.

## EXISTING ARTICLE REVISIONS

- When this prompt is applied to an already written article, preserve the original article as much as possible. Do not rewrite it from scratch or replace its structure, wording, or voice unless necessary.
- First identify what must be corrected, updated, or added; change only those passages and retain all other original text.
- Keep unchanged original passages unmarked. Do not silently rewrite existing text.
- For every substantive changed or added sentence or paragraph, add one short numeric update marker immediately after the changed passage. The marker must use the same square-bracket style as a source citation and link to its matching entry in Updates Review, for example [4](#update-4).
- Do not use Markdown footnote syntax, footnote identifiers, or a Revision notes section for the new system.
- Group related changes into one update entry instead of marking every minor copy edit.
- If the article still contains the old standalone Updated line, References section, or Revision notes, migrate those structural elements to the new system during the substantive revision. Do not leave both systems in the final article.
- If no substantive change is needed, preserve the article, keep its existing updated date, and do not create an artificial Updates Review section.

Do not use generic corpus language such as:

- "relevant to Indexmod's coverage"
- "treated as"
- "helps connect individual entries"
- "reference corpus"
- "topic included in the Indexmod 2026 list"
- "article prepared for the Indexmod reference corpus"

## SUBJECT TYPE

Identify the subject type before writing and let it shape the article. Use the type naturally in prose; add a visible "Category" section only when it improves clarity.

- Person: definition, background, career, work or influence, chronology.
- Brand or company: definition, history, design identity, business or cultural significance, chronology.
- Publication or media platform: definition, history, editorial scope, significance, chronology.
- Institution, venue, or place: definition, history, activities or cultural role, fashion/art relevance, chronology.
- City, country, or territory: definition, cultural context, fashion and art infrastructure, significance, chronology.
- Movement, style, or concept: definition, origins, features, examples, influence, chronology.

## BATCH MODE

When creating or reviewing multiple articles in one batch:

- Group topics by subject type before writing or review: people; brands/companies; publications/media; institutions/venues/places; cities/countries/territories; movements/styles/concepts.
- Prefer small batches of 5-8 articles when quality matters.
- Keep each article as a separate \`.md\` file.
- Do not lower article quality to make the batch larger.
- Flag homonyms and ambiguous names before writing. Example: "Aperture" may refer to optics, a magazine, or a foundation; choose the fashion/art-relevant subject.
- In review output, group results by subject type and list: title, slug, category, source status, crosslinks used, and quality concerns.
- Do not publish a batch article if the available sources identify a different subject than the requested topic.

## CROSSLINKS

Include a See also section when related topics are useful.

- Every See also item must be a clickable internal Markdown link in the form \`[Article title](/article-slug)\`.
- Before choosing See also links, check existing storage, index, sitemap, or any provided article list for already existing related articles.
- Prefer existing internal articles over invented targets.
- Add missing-but-important links only when they are clearly useful and likely to become articles.
- Use specific cultural, historical, professional, or collaboration links rather than generic links.
- Check for known relationships and collaborations. Example: an article about Gosha Rubchinskiy should consider links such as \`[Kanye West](/kanye-west)\` or \`[Yeezy](/yeezy)\` only when the relationship is factually relevant and the target exists or is intentionally planned.
- Avoid broad filler See also lists such as only Fashion, Art, Design, Photography unless the topic genuinely has no stronger connections.

## IMAGES

- Always try to provide \`image\` and \`credit\` when a suitable lawful image exists.
- Prefer Wikimedia Commons or another verifiable freely licensed source whenever a suitable image exists.
- For freely licensed images, \`credit\` must name the author, source, and license when known.
- If no suitable freely licensed image exists, an official editorial, press, institutional, gallery, museum, brand, designer, artist, or photographer image may be used when it is published by a clearly identifiable primary or authoritative source.
- When using an official non-free editorial or press image, do not claim that it is freely licensed. Credit the photographer or creator when known and name the organization or website that published the image.
- Prefer, in this order: freely licensed portrait or subject image; freely licensed image of the subject's work; official portrait from the subject, studio, institution, museum, gallery, brand, or press page; official image of a representative work, collection, exhibition, product, building, or project; another reputable editorial image with clear authorship and source.
- Do not use anonymous image aggregators, Pinterest, repost accounts, search-result thumbnails, scraped image hosts, invented URLs, file description pages, or Markdown links in \`image\`.
- Do not use non-free Wikipedia cover art, logos, screenshots, or unrelated promotional images as article images.
- \`image\` must contain only a clean direct image file URL that can be loaded by the site.
- Do not change the image selector syntax. Insert the main image only with the existing selector \`{{page:image}}\`; the renderer will replace it with the \`image\` value from frontmatter.
- Do not change the credit selector syntax. Insert the image credit only with the existing selector \`{{page:credit}}\`; the renderer will replace it with the \`credit\` value from frontmatter.
- Keep \`{{page:image}}\` and \`{{page:credit}}\` compatible with existing pages. Do not replace them with Markdown image syntax, HTML, new selector names, or inline URLs.
- Insert the main image and credit immediately after the first meaningful paragraph using:

{{page:image}}

{{page:credit}}

## CITATIONS

- Use only real, verifiable sources.
- Do not invent publications, dates, authors, or URLs.
- Do not cite indexmod.press/2026 or any topic-list page as a factual source.
- Use at least two real external sources for people, brands, institutions, publications, venues, and places when available.
- For cities, countries, and territories, Wikipedia/Wikidata may be sufficient for basic identification, but add stronger cultural or fashion/art sources when making specific claims.
- Use one continuous sequence of square-bracket numbers across source citations and update markers, based on first appearance in the article. Numbers must not restart in the second section.
- A source marker in the article uses the visible form [n] and links to its entry in Citations, for example [1](#citation-1). An update marker uses the same visible form and links to Updates Review, for example [4](#update-4). Do not use a different icon, star, arrow, label, or footnote syntax to distinguish them.
- Do not place update markers beside headings. Place them after the changed sentence or paragraph.
- At the bottom of the article, use these sections in this order:

## Citations

<a id="citation-1"></a>
**[1]** [Source title](URL)

## Updates Review

<a id="update-4"></a>
**[4]** 2026-11-20 — Short description of the substantive change.

- Citations contains source entries only, using the numbers assigned by the shared sequence. If a number belongs to an update, it is intentionally absent from Citations.
- Updates Review is placed immediately after Citations. Each entry begins with its square-bracket number, includes the date, and contains one short sentence no longer than two rendered lines.
- Do not call the source section References. Do not call the update section Revision notes.
- Create Updates Review only when the article has substantive updates. One entry may cover several related changes.
- The updated value in frontmatter must be the date of the latest substantive update recorded in Updates Review.

## FINAL CHECK

Before returning, verify:

- frontmatter syntax;
- title and person-name inversion;
- slug format;
- created and updated values;
- absence of a separate Updated line and duplicate dates;
- absence of Updates labels beside the title or headings;
- subject type and article structure;
- absence of generic placeholder language;
- image URL and credit;
- every source marker and update marker uses the shared square-bracket sequence;
- citation markers link to the matching Citations entry;
- update markers link to the matching Updates Review entry;
- Citations and Updates Review use one continuous sequence and the correct section names;
- every Updates Review entry is substantive, dated, concise, and no longer than two rendered lines;
- no indexmod.press/2026 citation;
- See also links are internal, useful, and checked against existing storage or article lists when available;
- existing article text is preserved unless a change is necessary;
- no artificial update entry was created when no substantive change was made;
- no prompt text or hidden admin prompt comment is included.
`;
