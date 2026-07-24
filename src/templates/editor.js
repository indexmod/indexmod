export default function editorTemplate(page = {}) {


const slug =
page.slug || "";


const content =
page.content || "";



return `

<textarea id="md"></textarea>


<script>


const initial = \`
---
title: ${page.title || ""}
slug: ${slug}
---

${content}
\`;



document.getElementById("md").value =
initial;



async function save(){


const md =
document.getElementById("md").value;



const slug =

(
md.match(/slug:\\s*(.*)/)?.[1]
|| ""
)

.trim()

.toLowerCase()

.replace(
/[^a-z0-9-]/g,
"-"
)

|| "untitled";



await fetch(
"/_save",
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:
JSON.stringify({

slug,

content:md

})

}

);



location.href =
"/" + slug;


}



</script>


<button onclick="save()">
Save
</button>


`;

}
