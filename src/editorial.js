import { parse } from "./markdown.js";

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

const acne = `**Acne Studios** is a Swedish fashion house founded in Stockholm in 1996, with **Jonny Johansson** as co-founder and creative director. ACNE stands for *Ambition to Create New Expressions*. Its headquarters are in Stockholm, while production takes place in several countries: the FY 2024/25 supplier report lists Italy, Portugal and China among the main manufacturing locations. Vogue reported in June 2025 that Johansson and Mikael Schiller jointly held a 59% majority stake. [Ownership source](https://www.vogue.com/article/you-need-to-sacrifice-a-lot-to-be-good-acne-studioss-jonny-johansson-on-the-power-of-control) · [Manufacturing report](https://cdn.acnestudios.com/static/sustainability/AcneStudios_SustainabilityProgressReport_FY24-25_04_Online.pdf)

## Questions and answers

### Who founded Acne Studios, and when?
The fashion house dates to 1996 in Stockholm. Co-founder Jonny Johansson leads its creative direction; the label grew from the multidisciplinary ACNE collective.

### What does the name Acne mean?
ACNE is an abbreviation of *Ambition to Create New Expressions*, reflecting the collective's work across fashion and other creative fields.

### Where is Acne Studios based, and where are its clothes made?
The headquarters are in Stockholm, Sweden. Manufacturing is international: the FY 2024/25 report identifies Italy, Portugal and China as major product-manufacturing countries. The country for a particular item should be checked on its label.

### Who owns Acne Studios?
Vogue's June 2025 profile reported a combined 59% majority holding for Jonny Johansson and Mikael Schiller. This is a dated ownership report, rather than a claim that the share register cannot have changed since then.
`;

const oriflame = `**Oriflame** was founded in Stockholm in 1967 by **Jonas and Robert af Jochnick** and **Bengt Hellsten**. It is a beauty and wellness business of Swedish origin with corporate offices in Switzerland. According to its December 2025 recapitalisation announcement, the af Jochnick family remained the main shareholder. Products are manufactured in more than one country; in July 2026 the company announced an agreement covering its facilities in Noida and Roorkee, India, and a future supply partnership with Akums. [Company history](https://corporate.oriflame.com/about-oriflame/our-history/) · [Company profile](https://corporate.oriflame.com/about-oriflame/who-we-are/) · [Ownership announcement](https://corporate.oriflame.com/news/oriflame-completes-recapitalisation-and-secures-strategic-investment-to-fund-next-stage-of-growth/) · [Manufacturing announcement](https://corporate.oriflame.com/news/oriflame-announces-strategic-manufacturing-partnership-with-akums-in-india/)

## Questions and answers

### Who founded Oriflame, and when?
Jonas and Robert af Jochnick founded the company with Bengt Hellsten in Stockholm in 1967.

### Is Oriflame Swedish or Swiss?
The company originated in Sweden and has corporate offices in Switzerland. The brand's origin and its corporate-office location refer to different things.

### Where are Oriflame products manufactured?
Manufacturing is international. The July 2026 announcement names Noida and Roorkee in India and describes an agreement to transfer those operations to an Akums subsidiary, subject to closing conditions and regulatory approvals. It does not establish that the transfer has completed. Check the packaging for the origin of an individual product.

### Who owns Oriflame?
The December 2025 recapitalisation announcement identifies the af Jochnick family as the main shareholder and says the group's shareholding structure remained unchanged.
`;

export function editorialUpdated(slug) {
  return metadata[slug] || ["acne-studios", "oriflame-company"].includes(slug) ? "2026-09-22" : "";
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
  const intro = slug === "acne-studios" ? acne : slug === "oriflame-company" ? oriflame : "";
  if (intro && !page.content.includes("<!-- seo-editorial-2026-09-22 -->")) {
    let content = page.content;
    if (slug === "oriflame-company") {
      // Replace stale claims instead of presenting conflicting ownership and factory lists.
      content = content.replace(/## Manufacturing and Operations[\s\S]*?(?=\n## |$)/,
        "## Manufacturing and Operations\n\nSee the dated manufacturing information above.\n");
      content = content.replace(/\(Est\. 1967, Switzerland\)[^\n]*(?:\n|$)/, "");
    }
    const enhanced = `${intro}\n<!-- seo-editorial-2026-09-22 -->\n\n${content}`;
    next.html = parse(enhanced).html;
  }
  if (editorialUpdated(slug)) next.updated = [page.updated, editorialUpdated(slug)].filter(Boolean).sort().at(-1);
  return next;
}
