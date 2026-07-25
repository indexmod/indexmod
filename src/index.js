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
// STATIC
// ======================


if(
path === "/logo.svg" ||
path === "/favicon.svg"
) {


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
) {


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
// LIST API
// ======================


if(
path === "/_list"
) {


return Response.json(
await list(env)
);


}



// ======================
// GET API
// ======================


if(
path.startsWith("/_get/")
) {


const slug =
path.split("/").pop();



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
) {


const body =
await req.json();



const slug =
body.slug;



const content =
body.content;



const page =
parse(content);



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



return new Response(
"ok"
);


}



// ======================
// HOME CACHE
// ======================


if(
path === "/"
) {


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
) {


return renderPage(

editorTemplate({

slug:"",

title:"",

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
) {


const slug =
path.slice(6);



const md =
await getFile(
env,
slug
);



const page =
md
?
{
...parse(md),
slug
}
:
{

slug,

title:titleFromSlug(slug),

content:
`---
title: ${titleFromSlug(slug)}
slug: ${slug}
---

Write text here...
`

};



return renderPage(

editorTemplate(page),

`
<button onclick="save()">
Save
</button>
`,

buildMeta({

title:
page.title,

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
) {


const slug =
path.slice(1);



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

slug,

title,

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
page.content,


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
