import { marked } from "marked";



export function parse(md = "") {


let title = "";

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



if(key === "title") {

title = value;

}


});


}




// ===============================
// MARKDOWN → HTML
// ===============================


const html =
marked.parse(
content
);



return {

title,

content,

html

};


}
