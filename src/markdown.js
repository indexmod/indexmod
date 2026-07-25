import { marked } from "marked";


export function parse(md = "") {


let title = "";
let description = "";
let image = "";

let content = md;



// ===============================
// FRONTMATTER
// ===============================

const fm =
md.match(
/^---\n([\s\S]*?)\n---\n([\s\S]*)$/
);



if(fm){


const meta = fm[1];

content = fm[2];


meta
.split("\n")
.forEach(line=>{


const i =
line.indexOf(":");


if(i === -1)
return;


const key =
line.slice(0,i).trim();


const value =
line.slice(i+1).trim();



if(key==="title")
title=value;


if(key==="description")
description=value;


if(key==="image")
image=value;


});


}



// ===============================
// FALLBACK TITLE
// ===============================


if(!title){

const h =
content.match(
/^#\s+(.+)$/m
);


if(h)
title=h[1];

}



// ===============================
// FALLBACK DESCRIPTION
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
/\n+/g,
" "
)

.trim()

.slice(0,180);

}



// ===============================
// FALLBACK IMAGE
// ===============================


if(!image){

const img =
content.match(
/!\[.*?\]\((.*?)\)/
);


if(img)
image=img[1];

}



// ===============================
// MARKDOWN HTML
// ===============================


const html =
marked.parse(content);



return {

title,

description,

image,

content,

html

};


}
