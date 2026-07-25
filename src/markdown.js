import { marked } from "marked";


// ===============================
// PARSE MARKDOWN
// ===============================

export function parse(md = "") {


let title = "";

let slug = "";

let description = "";

let image = "";

let content = md;



// ===============================
// FRONTMATTER
// ===============================

const fm =
md.match(
/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/
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


case "slug":

slug = value;

break;


case "description":

description = value;

break;


case "image":

image = value;

break;


}


});


}



// ===============================
// REMOVE INTERNAL PROMPT
// FROM PUBLIC HTML
// ===============================

const publicContent =
content.replace(
/<!--\s*INDEXMOD PROMPT[\s\S]*?-->/,
""
);



// ===============================
// MARKDOWN → HTML
// ===============================

const html =
marked.parse(
publicContent
);



return {

title,

slug,

description,

image,

content,

html

};


}
