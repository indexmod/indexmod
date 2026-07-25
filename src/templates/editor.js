export default function editorTemplate(page = {}) {


return `

<h1>
${page.slug ? "Edit" : "New"}
</h1>



<textarea id="md">${page.content || `---
title:
slug:
---

Write text here...
`}</textarea>



<br><br>



<button onclick="save()">
Save
</button>



<script>


async function save(){


const md =
document
.getElementById("md")
.value;



const slugMatch =
md.match(
/^slug:\s*(.+)$/m
);



const slug =

(
slugMatch
?
slugMatch[1]
:
"untitled"
)

.trim()

.toLowerCase()

.replace(
/[^a-z0-9-]/g,
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
