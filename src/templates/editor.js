export default `

<textarea id="md"></textarea>


<button onclick="save()">Save</button>


<script>


const slug =
location.pathname
.split("/")
.filter(Boolean)
.pop();



const tpl = (title, slug) => \`

---
title: \${title}
slug: \${slug}
---

Write here...

![](https://images.unsplash.com/photo-1520975916090-3105956dac38)


## Basic markup

**bold text**

*italic text*

- list item 1
- list item 2


## Footnote example

Text with reference [1]

\`;



async function load(){


if(location.pathname === "/new"){


document.getElementById("md").value =
tpl(
"New page",
"new-page"
);


return;

}



const r =
await fetch(
"/_get/" + slug
);



const d =
await r.json();



document.getElementById("md").value =

\`---
title: \${d.title || slug}
slug: \${slug}
---

\${d.content || ""}
\`;



}



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



load();


</script>

`;
