import { marked } from "marked";
import { isAllowedImageSourceUrl } from "./image-hosts.js";


// ===============================
// PARSE MARKDOWN
// ===============================

export function parse(md = "") {


let title = "";
let description = "";
let image = "";
let credit = "";
let slug = "";
let created = "";
let updated = "";

let content = md;



// ===============================
// FRONTMATTER
// ===============================


const fm =
md.match(
/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/
);



if(fm){


const meta =
fm[1];


content =
fm[2];



meta

.split(/\r?\n/)

.forEach(line=>{


const i =
line.indexOf(":");



if(i === -1)
return;



const key =
line
.slice(0,i)
.trim();



const value =
stripEnclosingQuotes(
line
.slice(i+1)
.trim()
);



switch(key){


case "title":

title = value;

break;


case "description":

description = value;

break;


case "image":

image =
unwrapMarkdownUrl(value);

break;

case "credit":

credit = value;

break;


case "slug":

slug = value;

break;

case "created":

created = value;

break;

case "updated":

updated = value;

break;


}


});


}



// ===============================
// TITLE FALLBACK
// ===============================


if(!title){


const h =
content.match(
/^#\s+(.+)$/m
);



if(h)
title =
h[1].trim();


}



// ===============================
// DESCRIPTION FALLBACK
// ===============================


if(!description){


description =

content

.replace(
/!\[.*?\]\(.*?\)/g,
""
)

.replace(
/[#>*_`]/g,
""
)

.replace(
/\s+/g,
" "
)

.trim()

.slice(0,180);


}



// ===============================
// IMAGE FALLBACK
// ===============================


if(!image){


const img =
content.match(
/!\[.*?\]\((.*?)\)/
);



if(img)
image =
unwrapMarkdownUrl(img[1]);


}



// ===============================
// HTML
// ===============================


const html =
proxyExternalImages(
marked.parse(
normalizeImageMarkdown(
renderPageSelectors(content, {
image,
credit
})
)
)
);



// ===============================
// RETURN
// ===============================


return {

title,

description,

image,

credit,

slug,

created,

updated,

content,

html,

raw: md

};


}



function proxyExternalImages(html = "") {


return html.replace(
/<img\b([^>]*?)\bsrc="(https?:\/\/[^"\s]+)"([^>]*)>/gi,
(_match, before, source, after) => {


let sourceUrl;

try {


sourceUrl =
new URL(source);


}
catch {


return `<img${before}src="${source}"${after}>`;


}


if(!isAllowedImageSourceUrl(sourceUrl))
return `<img${before}src="${source}"${after}>`;


return `<img${before}src="/_media?url=${encodeURIComponent(source)}" data-source="${escapeHtmlAttribute(source)}" onerror="this.onerror=null;this.src=this.dataset.source"${after}>`;


}
);


}



function escapeHtmlAttribute(value = "") {


return String(value)
.replace(/&/g, "&amp;")
.replace(/"/g, "&quot;")
.replace(/</g, "&lt;")
.replace(/>/g, "&gt;");


}



function renderPageSelectors(content = "", page = {}) {


return String(content)
.split(/(<!--[\s\S]*?-->)/g)
.map(part =>
part.startsWith("<!--")
?
part
:
part
.replace(
/\{\{\s*(?:image:\s*)?page:image\s*\}\}/gi,
page.image
?
`![](${unwrapMarkdownUrl(page.image)})`
:
""
)
.replace(
/\{\{\s*(?:credit:\s*)?page:credit\s*\}\}/gi,
page.credit
?
`*Image credit: ${page.credit}*`
:
""
)
)
.join("");


}



function normalizeImageMarkdown(content = "") {


return String(content).replace(
/!\[([^\]]*)\]\(\s*\[[^\]]*\]\((https?:\/\/[^)\s]+)\)\s*\)/gi,
(_match, alt, source) =>
`![${alt}](${source})`
);


}



function unwrapMarkdownUrl(value = "") {


const source =
String(value).trim();


const markdownLink =
source.match(/^\[[^\]]*\]\((https?:\/\/[^)\s]+)\)$/i);


return markdownLink
?
markdownLink[1]
:
source;


}



function stripEnclosingQuotes(value = "") {


const source =
String(value).trim();


const quote =
source[0];


return (quote === `"` || quote === `'`) && source.endsWith(quote)
?
source.slice(1, -1)
:
source;


}
