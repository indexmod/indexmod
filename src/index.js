import {
  getFile,
  getIndex,
  savePage,
  list
} from "./storage.js";


import { parse } from "./markdown.js";
import { renderPage } from "./render.js";
import { rebuildIndex } from "./build.js";

import { buildMeta } from "./meta.js";

import { sitemap } from "./sitemap.js";
import { robots } from "./robots.js";


import articleTemplate from "./templates/article.js";
import editorTemplate from "./templates/editor.js";



export default {


async fetch(req, env) {


const url =
new URL(req.url);


const path =
url.pathname;



try {


// ======================
// SITEMAP
// ======================


if(
path === "/sitemap.xml"
){

return new Response(

await sitemap(env),

{
headers:{
"Content-Type":
"application/xml;charset=UTF-8",

"Cache-Control":
"public,max-age=3600"
}
}

);

}



// ======================
// ROBOTS
// ======================


if(
path === "/robots.txt"
){

return new Response(

robots(),

{
headers:{
"Content-Type":
"text/plain;charset=UTF-8"
}
}

);

}



// ======================
// STATIC
// ======================


if(
path === "/logo.svg" ||
path === "/favicon.svg"
){


const file =
await env.PAGES.get(
path.slice(1)
);



if(!file)

return new Response(
"not found",
{
status:404
}
);



return new Response(

await file.arrayBuffer(),

{
headers:{
"Content-Type":
"image/svg+xml",

"Cache-Control":
"public,max-age=86400"
}
}

);


}



// ======================
// CSS
// ======================


if(
path.startsWith("/styles/")
){


const file =
await env.PAGES.get(
path.slice(1)
);



if(!file)

return new Response(
"not found",
{
status:404
}
);



return new Response(

await file.arrayBuffer(),

{
headers:{
"Content-Type":
"text/css",

"Cache-Control":
"public,max-age=86400"
}
}

);


}



// ======================
// API LIST
// ======================


if(
path === "/_list"
){

return Response.json(
await list(env)
);

}



// ======================
// API GET
// ======================


if(
path.startsWith("/_get/")
){


const slug =
decodeSlug(
path.split("/").pop()
);



const md =
await getFile(
env,
slug
);



if(!md)

return Response.json(

{
error:"not found"
},

{
status:404
}

);



return Response.json(
parse(md)
);


}



// ======================
// SAVE
// ======================


if(
path === "/_save"
){


const body =
await req.json();



const content =
body.content || "";



const page =
parse(content);



let slug =
body.slug ||
page.slug ||
page.title;



if(!slug){

return new Response(
"slug missing",
{
status:400
}
);

}



slug =
slug

.toLowerCase()

.trim()

.replace(
/[^a-z0-9а-яё\s-]/gi,
""
)

.replace(/\s+/g,"-")

.replace(/-+/g,"-")

.replace(/^-|-$/g,"");



if(!slug){

return new Response(
"slug missing",
{
status:400
}
);

}



const html =
articleTemplate({

...page,

slug

});



await savePage(

env,

slug,

content,

html

);



await rebuildIndex(env);



return Response.json({

ok:true,

slug

});


}



// ======================
// HOME
// ======================


if(
path === "/"
){


let index =
await getIndex(env);



if(!index){

await rebuildIndex(env);

index =
await getIndex(env);

}



return new Response(

index,

{

headers:{

"Content-Type":
"text/html;charset=UTF-8",

"Cache-Control":
"public,max-age=3600"

}

}

);


}



// ======================
// NEW
// ======================


if(
path === "/new"
){


return renderPage(

editorTemplate({

content:
`---
title:
slug:
---

Write text here...
`

}),


`
<button onclick="save()">
Save
</button>
`,


buildMeta({

title:"New article"

})

);


}



// ======================
// EDIT
// ======================


if(
path.startsWith("/edit/")
){


const slug =
decodeSlug(
path.slice(6)
);



const md =
await getFile(
env,
slug
);



if(md){


const page =
parse(md);



return renderPage(

editorTemplate({

...page,

// сохраняем оригинальный markdown
content:md

}),


`
<button onclick="save()">
Save
</button>
`,


buildMeta({

title:
page.title || slug,

description:
page.description,

image:
page.image,

slug

})

);


}



const title =
titleFromSlug(slug);



return renderPage(

editorTemplate({

content:
`---
title: ${title}
slug: ${slug}
---

Write text here...
`

}),


`
<button onclick="save()">
Save
</button>
`,


buildMeta({

title,

slug

})

);


}



// ======================
// ARTICLE
// ======================


if(
path.startsWith("/")
&&
!path.startsWith("/_")
){


const slug =
decodeSlug(
path.slice(1)
);



const md =
await getFile(
env,
slug
);



if(!md){


const title =
titleFromSlug(slug);



return renderPage(

editorTemplate({

content:
`---
title: ${title}
slug: ${slug}
---

Write text here...
`

}),


`
<button onclick="save()">
Save
</button>
`,


buildMeta({

title,

slug

})

);


}



const page =
parse(md);



const html =
articleTemplate({

...page,

slug

});



return renderPage(

html,


`
<a href="/edit/${slug}">
Edit
</a>
`,


buildMeta({

title:
page.title || slug,

description:
page.description,

image:
page.image,

slug

})

);


}



return new Response(
"404",
{
status:404
}
);



}

catch(e){


return new Response(

e.stack ||
e.message,

{

status:500,

headers:{
"Content-Type":
"text/plain;charset=utf-8"
}

}

);


}


}

};



function titleFromSlug(slug){

return slug

.replace(/-/g," ")

.replace(/\b\w/g,c =>
c.toUpperCase()
);

}



function decodeSlug(slug = ""){

try {

return decodeURIComponent(slug);

}
catch {

return slug;

}

}
