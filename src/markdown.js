// ===============================
// MARKDOWN PARSER
// ===============================


export function parse(md = "") {


const front =
{
title:"",
slug:"",
content:""
};



// ===============================
// FRONTMATTER
// ===============================


const match =
md.match(
/^---\n([\s\S]*?)\n---\n([\s\S]*)$/
);



let body =
md;



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
// SIMPLE HTML
// ===============================


let html =
body;



html =
html
.replace(
/^# (.*)$/gm,
"<h1>$1</h1>"
);



html =
html
.replace(
/^## (.*)$/gm,
"<h2>$1</h2>"
);



html =
html
.replace(
/\*\*(.*?)\*\*/g,
"<strong>$1</strong>"
);



html =
html
.replace(
/\n\n/g,
"<br><br>"
);



return {


title:
front.title ||
front.slug ||
"untitled",


slug:
front.slug ||
"",


content:
body,


html


};


}
