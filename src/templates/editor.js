export default function editorTemplate(page = {}) {


const fallback = `---
title:
slug:
---

Write text here...
`;



return `

<textarea id="md">${escapeHtml(
page.content || fallback
)}</textarea>



<script>


async function save(){


const md =
document
.getElementById("md")
.value;



// берём slug из frontmatter

const slugMatch =
md.match(
/^slug:\s*(.+)$/m
);



let slug =
slugMatch
?
slugMatch[1].trim()
:
"";



// если slug нет — создаём из title

if(!slug){


const titleMatch =
md.match(
/^title:\s*(.+)$/m
);



slug =
titleMatch
?
titleMatch[1]
:
"untitled";


}



slug =
slug

.toLowerCase()

.trim()

.replace(
/[^a-z0-9а-яё\s-]/gi,
""
)

.replace(
(/\s+/g),
"-"
)

.replace(
(/-+/g),
"-"
);



const res =
await fetch(
"/_save",
{

method:"POST",

headers:{
"Content-Type":
"application/json"
},

body:
JSON.stringify({

slug,

content:md

})

});



if(!res.ok){

alert(
"Save error"
);

return;

}



location.href =
"/" + slug;


}



</script>


`;

}



function escapeHtml(str = "") {


return String(str)

.replace(/&/g,"&amp;")

.replace(/</g,"&lt;")

.replace(/>/g,"&gt;")

.replace(/"/g,"&quot;");


}
