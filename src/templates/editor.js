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

const originalSlug =
${JSON.stringify(page.storageSlug || page.slug || "")};


async function save(){


const md =
document
.getElementById("md")
.value;



// берём slug из frontmatter

const slugMatch =
md.match(
/^slug:\\s*(.+)$/m
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
/^title:\\s*(.+)$/m
);



slug =
titleMatch
?
titleMatch[1]
:
"untitled";


}

let res;


try {


res =
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

originalSlug,

content:md

})

});



}
catch(error){


alert(
"Save error: " + error.message
);

return;


}



if(!res.ok){

const message =
await res.text();

alert(
"Save error: " + message
);
return;

}



location.href =
"/" + encodeURIComponent(slug);


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



function normalizeSlug(value = "") {


return String(value)

.normalize("NFKD")

.replace(/[ßẞ]/g,"ss")

.replace(/[æÆ]/g,"ae")

.replace(/[œŒ]/g,"oe")

.replace(/[øØ]/g,"o")

.replace(/[đĐ]/g,"d")

.replace(/[þÞ]/g,"th")

.replace(/[ðÐ]/g,"d")

.replace(/[łŁ]/g,"l")

.replace(/[\u0300-\u036f]/g,"")

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
)

.replace(
(/^-|-$/g),
""
);


}
