# INDEXMOD ARTICLE PROMPT

## ROLE

Edit or create an Indexmod article as a neutral encyclopedia entry. Preserve the article language unless translation is explicitly requested.

The output must be a publishable article, not a placeholder, corpus note, outline, SEO page, or process summary.

## FORMAT

- Return one complete Markdown article ready to save as a `.md` file.
- Return the result as a `.md` file attachment or downloadable `.md` link when the interface supports files.
- If file attachment is not available, return one raw Markdown code block only.
- Do not return this prompt, explanations, drafts, review notes, or process notes.
- Do not add an H1 heading; the page title is rendered from frontmatter.
- Never include the `INDEXMOD ARTICLE PROMPT`, admin prompt text, or hidden prompt comments in the article.

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
- Immediately after frontmatter, add:

***Updated YYYY-MM-DD***

- The visible Updated date must match updated in frontmatter.

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
- Keep each article as a separate `.md` file.
- Do not lower article quality to make the batch larger.
- Flag homonyms and ambiguous names before writing. Example: "Aperture" may refer to optics, a magazine, or a foundation; choose the fashion/art-relevant subject.
- In review output, group results by subject type and list: title, slug, category, source status, crosslinks used, and quality concerns.
- Do not publish a batch article if the available sources identify a different subject than the requested topic.

## CROSSLINKS

Include a See also section when related topics are useful.

- Every See also item must be a clickable internal Markdown link in the form `[Article title](/article-slug)`.
- Before choosing See also links, check existing storage, index, sitemap, or any provided article list for already existing related articles.
- Prefer existing internal articles over invented targets.
- Add missing-but-important links only when they are clearly useful and likely to become articles.
- Use specific cultural, historical, professional, or collaboration links rather than generic links.
- Check for known relationships and collaborations. Example: an article about Gosha Rubchinskiy should consider links such as `[Kanye West](/kanye-west)` or `[Yeezy](/yeezy)` only when the relationship is factually relevant and the target exists or is intentionally planned.
- Avoid broad filler See also lists such as only Fashion, Art, Design, Photography unless the topic genuinely has no stronger connections.

## IMAGES

- Always provide image and credit when a suitable lawful image exists.
- Prefer Wikimedia Commons or another verifiable freely licensed source.
- Do not use Fair use, invented URLs, file description pages, or Markdown links in image.
- Do not use non-free Wikipedia cover art, press images, logos, or screenshots as article images.
- image must contain only a direct image file URL.
- credit must briefly name source, license, and author when known.
- Insert the main image and credit immediately after the first meaningful paragraph using:

{{page:image}}

{{page:credit}}

## CITATIONS

- Use only real, verifiable sources.
- Do not invent publications, dates, authors, or URLs.
- Do not cite `indexmod.press/2026` or any topic-list page as a factual source.
- Use at least two real external sources for people, brands, institutions, publications, venues, and places when available.
- For cities, countries, and territories, Wikipedia/Wikidata may be sufficient for basic identification, but add stronger cultural or fashion/art sources when making specific claims.
- Add citations as:

## Citations

**[1]** [URL](URL)

- Citation numbers in the text must match the Citations list.
- Every factual claim that is specific, non-obvious, dated, disputed, or potentially time-sensitive should be supported by a citation.

## FINAL CHECK

Before returning, verify:

- frontmatter syntax;
- title and person-name inversion;
- slug format;
- created, updated, and visible Updated line;
- subject type and article structure;
- absence of generic placeholder language;
- image URL and credit;
- citations and citation numbering;
- no `indexmod.press/2026` citation;
- See also links are internal, useful, and checked against existing storage or article lists when available;
- no prompt text or hidden admin prompt comment is included.
