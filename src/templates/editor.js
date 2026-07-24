export default function editorTemplate(page = {}) {


const slug =
page.slug || "";


const title =
page.title || "";


const content =
page.content || "";



return `

<textarea id="md"></textarea>


<button onclick="save()">
Save
</button>


<script>


document.getElementById("md").value =
\`---
title: ${title}
slug: ${slug}
---

${content}
\`;



async function save(){


const md =
document.getElementById("md").value;



const match =
md.match(
/slug:\\s*(.*)/
);



const slug =

(
match
? match[1]
: ""
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

`;

}
