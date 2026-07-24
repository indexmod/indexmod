export default function editorTemplate(page = {}) {

return `

<h1>
${page.slug ? "Edit" : "New"}
</h1>


<textarea id="md">${page.content || ""}</textarea>


<button onclick="save()">
Save
</button>



<script>


async function save(){


const md =
document.getElementById("md").value;



const slug =

(
md.match(
/slug:\s*(.*)/
)?.[1]
|| "untitled"
)

.trim()

.toLowerCase()

.replace(
/[^a-z0-9-]/g,
"-"
);



await fetch("/_save", {

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:
JSON.stringify({

slug,

content:md

})

});



location.href =
"/" + slug;


}


</script>


`;

}
