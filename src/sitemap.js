import { getIndexPages, listSeoPages } from "./storage.js";

const DOMAIN =
"https://indexmod.press";

export async function generateSitemap(env){

const indexedPages =
await getIndexPages(env);

const pages =
indexedPages
? indexedPages.map(page => ({
slug:page.slug,
title:page.title,
lastmod:formatDate(page.updatedAt)
}))
: await listSeoPages(env);

const urls =
pages.map(page => {

return `

<url>

<loc>
${escapeXml(pageUrl(page.slug))}
</loc>

${page.lastmod ? `
<lastmod>
${escapeXml(page.lastmod)}
</lastmod>
` : ""}

<changefreq>
weekly
</changefreq>

<priority>
0.8
</priority>

</url>

`;

}).join("");

return `<?xml version="1.0" encoding="UTF-8"?>

<urlset
xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

<url>

<loc>
${DOMAIN}/
</loc>

<changefreq>
daily
</changefreq>

<priority>
1.0
</priority>

</url>

${urls}

</urlset>

`;

}

export const sitemap =
generateSitemap;

function formatDate(value){
if(!value)
return "";

const date =
new Date(value);

return Number.isNaN(date.getTime())
? ""
: date.toISOString().slice(0,10);
}

function escapeXml(value = ""){
return String(value)
.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;")
.replace(/"/g,"&quot;")
.replace(/'/g,"&apos;");
}

function pageUrl(slug = ""){
return encodeURI(
`${DOMAIN}/${slug}`
);
}
