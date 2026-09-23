// Reviewed against the live article text on 2026-09-18. CMS seo_title and
// explicit description take precedence, allowing normal editorial maintenance.
export const metadata = {
  "obolentseva-nadezhda": {
    title: "Nadezhda Obolentseva: Club 418 and Tatler",
    description: "Nadezhda Obolentseva's biography: her education, work at Russian Tatler, co-founding of Club 418, cultural projects and a chronology of her life."
  },
  "yaroslava-deriha-jasushka": {
    title: "Ярослава Дериха (Jasushka): DJ и digital creator",
    language: "ru",
    description: "Кто такая Ярослава Дериха (Jasushka): деятельность DJ и digital creator, выступления на модных событиях, аккаунты в соцсетях и источники сведений о ней."
  },
  "kusnirovich-mikhail": {
    title: "Mikhail Kusnirovich: Bosco di Ciliegi Founder",
    description: "Mikhail Kusnirovich's biography and career: founding Bosco di Ciliegi, his connection to Moscow's GUM and cultural projects including Cherry Orchard."
  },
  "rodonaya-irakli": {
    title: "Irakli Rodonaya: Producer and Actor",
    description: "Irakli Rodonaya's biography and film career: his work on Brighton 4th, roles in film production and advertising, education and professional background."
  },
  "chernykh-anna": {
    title: "Anna Chernykh: Fashion Education and FRESHBLOOD",
    description: "Anna Chernykh's work in fashion education: the BHSAD fashion design course, FRESHBLOOD, creative mentorship and support for emerging Russian designers."
  },
  "karput-olga": {
    title: "Olga Karput: KM20 Founder and Fashion Career",
    description: "Olga Karput's biography and fashion career: founding Moscow's KM20 concept store and cafe, working with international brands and supporting designers."
  },
  "marchenkova-ksenia": {
    title: "Ksenia Marchenkova: Indexmod Profile",
    description: "Explore the Indexmod profile of Ksenia Marchenkova, with a concise overview and source links from the encyclopedia's fashion and culture archive online."
  },
  "northern-swell": {
    title: "Northern Swell: Pavel Samokhvalov's AI Art",
    description: "Explore Northern Swell, Pavel Samokhvalov's AI-assisted art project: its fictional world, railway films, liminal spaces, visual language and exhibitions."
  }
};

export function editorialUpdated(slug) {
  return metadata[slug] ? "2026-09-22" : "";
}

export function applyEditorial(page, slug) {
  if (page.placeholder || page.draft) return page;
  const override = metadata[slug];
  let next = {...page};
  if (override) {
    next.seoTitle = page.seoTitle || override.title;
    // parse() creates an automatic description; only a frontmatter field is explicit.
    if (!/^description:\s*\S/m.test((page.raw || "").split(/\r?\n---/)[0])) next.description = override.description;
    next.language = page.language || override.language || "en";
  }
  if (editorialUpdated(slug)) next.updated = [page.updated, editorialUpdated(slug)].filter(Boolean).sort().at(-1);
  return next;
}
