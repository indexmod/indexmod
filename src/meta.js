// ===============================
// UNIVERSAL META GENERATOR
// ===============================

import { normalizeSlug } from "./slug.js";


const DOMAIN =
"https://indexmod.press";



// ===============================
// BUILD META
// ===============================


export function buildMeta(data = {}) {


const title =
clean(
data.title ||
data.name ||
"Indexmod"
);



const description =
clean(
data.description ||
extractDescription(
data.content ||
data.html ||
""
) ||
"Indexmod — fashion and art encyclopedia"
);



const slug =
normalizeSlug(
data.slug || ""
);



const url =
slug
?
encodeURI(`${DOMAIN}/${slug}`)
:
DOMAIN;



return {

title,

description,

slug,

url,

robots:
data.robots || "index,follow",

type:
slug
?
"article"
:
"website",

image:
data.image || null

};


}




// ===============================
// OPEN GRAPH
// ===============================


export function og(
meta = {}
){


return `


<meta property="og:type"
content="${meta.type || "website"}">



<meta property="og:site_name"
content="Indexmod Fashion and Art">



<meta property="og:title"
content="${escapeHtml(meta.title)}">



<meta property="og:description"
content="${escapeHtml(meta.description)}">



<meta property="og:url"
content="${escapeHtml(meta.url)}">


<meta name="twitter:card"
content="summary_large_image">



<meta name="twitter:title"
content="${escapeHtml(meta.title)}">



<meta name="twitter:description"
content="${escapeHtml(meta.description)}">


${
meta.image
?
`

<meta property="og:image"
content="${escapeHtml(meta.image)}">


<meta name="twitter:image"
content="${escapeHtml(meta.image)}">

`
:
""

}


`;

}





// ===============================
// DESCRIPTION
// ===============================


function extractDescription(
text = ""
){


return String(text)

.replace(/<[^>]*>/g,"")

.replace(/[#>*_`\[\]()]/g,"")

.replace(/\s+/g," ")

.trim()

.slice(0,180);


}





// ===============================
// CLEAN
// ===============================


function clean(
text=""
){

return String(text)

.replace(/\s+/g," ")

.trim();

}





// ===============================
// ESCAPE
// ===============================


function escapeHtml(
str=""
){

return String(str)

.replace(/&/g,"&amp;")

.replace(/"/g,"&quot;")

.replace(/</g,"&lt;")

.replace(/>/g,"&gt;");

}
