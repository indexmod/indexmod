import { list } from "./storage.js";


const DOMAIN =
"https://indexmod.press";



export async function generateSitemap(env){


const pages =
await list(env);



const urls =
pages.map(page => {


return `

<url>

<loc>
${DOMAIN}/${page.slug}
</loc>

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

</url>


${urls}


</urlset>

`;

}



export const sitemap =
generateSitemap;
