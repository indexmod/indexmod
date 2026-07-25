import {
  getFile,
  getHtml,
  getIndex,
  savePage,
  list
} from "./storage.js";


import { parse } from "./markdown.js";

import { renderPage } from "./render.js";

import { rebuildIndex } from "./build.js";


import indexTemplate from "./templates/index.js";
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


const name =
path.slice(1);



const file =
await env.PAGES.get(name);



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
"image/svg+xml"
}
}

);


}



// ======================
// CSS FROM R2
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
"text/css"
}
}

);


}



// ======================
// API LIST
// ======================


if(
path === "/_list"
) {


return Response.json(

await list(env)

);


}



// ======================
// API GET
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
// HOME
// ======================


if(
path === "/"
) {


const index =
await getIndex(env);



if(index) {


return new Response(

index,

{

headers:{
"Content-Type":
"text/html;charset=UTF-8",

"Cache-Control":
"public, max-age=3600"

}

}

);

}



// первый запуск
// если index.html еще нет


await rebuildIndex(env);



const fresh =
await getIndex(env);



return new Response(

fresh,

{

headers:{
"Content-Type":
"text/html;charset=UTF-8"
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
content:""

}),

`
<button onclick="save()">
Save
</button>
`

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



const page = {

slug,

title:
parse(md || "").title,

content:
md || ""

};



return renderPage(

editorTemplate(page),

`
<button onclick="save()">
Save
</button>
`

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



const html =
await getHtml(
env,
slug
);



if(html) {


return renderPage(

html,

`
<a href="/edit/${slug}">
Edit
</a>
`

);


}



const md =
await getFile(
env,
slug
);



if(!md)

return new Response(
"404",
{
status:404
}
);



const page =
parse(md);



return renderPage(

articleTemplate({

...page,

slug

}),

`
<a href="/edit/${slug}">
Edit
</a>
`

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

e.stack || e.message,

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
