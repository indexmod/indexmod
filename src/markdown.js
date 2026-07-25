import { marked } from "marked";


// ===============================
// MARKDOWN PARSER
// ===============================

export function parse(md = "") {


const front = {

title:"",
slug:"",
created:"",
update:""

};



let body = md;



// ===============================
// FRONTMATTER
// ===============================


const match =
md.match(
/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/
);



if(match){


const yaml =
match[1];


body =
match[2];



yaml
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



front[key] =
value;


});


}



// ===============================
// MARKDOWN → HTML
// ===============================


const html =
marked.parse(
body
);



return {


title:
front.title ||
front.slug ||
"untitled",



slug:
front.slug ||
"",



created:
front.created ||
"",



update:
front.update ||
"",



content:
body,



html


};


}
