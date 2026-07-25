// ===============================
// SEO GENERATORS
// ===============================


const DOMAIN =
"https://indexmod.press";



// ===============================
// ROBOTS.TXT
// ===============================


export function robots(){


return `

User-agent: *

Allow: /

Sitemap: ${DOMAIN}/sitemap.xml

`;

}




// ===============================
// SITEMAP.XML
// ===============================


export async function sitemap(env){


const res =
await env.PAGES.list();



const pages =
res.objects

.filter(
o =>
o.key.endsWith(".md")
)

.map(
o =>
o.key.replace(".md","")
);



const urls =
pages
.map(slug=>`

<url>

<loc>
${DOMAIN}/${slug}
</loc>

</url>

`)
.join("");



return `<?xml version="1.0" encoding="UTF-8"?>

<urlset
xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">


<url>

<loc>
${DOMAIN}/
</loc>

</url>


${urls}


</urlset>
`;

}
