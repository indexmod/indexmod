import { listSeoPages } from "./storage.js";


const DOMAIN =
"https://indexmod.press";



export async function generateSitemap(env){


const pages =
await listSeoPages(env);



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
