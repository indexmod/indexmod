import { marked } from "marked";


// ===============================
// PARSE MARKDOWN
// ===============================

export function parse(md = "") {


let title = "";
let description = "";
let image = "";
let slug = "";

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
line
.slice(i+1)
.trim();



switch(key){


case "title":

title = value;

break;


case "description":

description = value;

break;


case "image":

image = value;

break;


case "slug":

slug = value;

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
img[1];


}



// ===============================
// HTML
// ===============================


const html =
proxyExternalImages(
marked.parse(content)
);



// ===============================
// RETURN
// ===============================


return {

title,

description,

image,

slug,

content,

html,

raw: md

};


}



function proxyExternalImages(html = "") {


return html.replace(
/<img\b([^>]*?)\bsrc="(https:\/\/[^"\s]+)"([^>]*)>/gi,
(_match, before, source, after) =>
`<img${before}src="/_media?url=${encodeURIComponent(source)}"${after}>`
);


}
