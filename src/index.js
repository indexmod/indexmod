import {
  getFile,
  getHtml,
  savePage,
  saveHtml,
  list
} from "./storage.js";


import { parse } from "./markdown.js";

import { renderPage } from "./render.js";


import indexTemplate from "./templates/index.js";
import articleTemplate from "./templates/article.js";
import editorTemplate from "./templates/editor.js";


import layout from "./templates/layout.js";



export default {


async fetch(req, env) {


const url =
new URL(req.url);


const path =
url.pathname;



try {



/*
======================
STATIC
======================
*/


if(path === "/logo.svg") {


const file =
await env.PAGES.get(
"logo.svg"
);


if(!file)
return new Response(
"not found",
{status:404}
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



if(path === "/favicon.svg") {


const file =
await env.PAGES.get(
"favicon.svg"
);


if(!file)
return new Response(
"not found",
{status:404}
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





/*
======================
API LIST
======================
*/


if(path === "/_list") {


return Response.json(
await list(env)
);


}





/*
======================
API GET
======================
*/


if(path.startsWith("/_get/")) {


const slug =
path.split("/").pop();



const md =
await getFile(
env,
slug
);



if(!md) {

return Response.json(
{
error:"not found"
},
{
status:404
}
);

}



return Response.json(
parse(md)
);


}







/*
======================
SAVE + PUBLISH
======================
*/


if(path === "/_save") {


const body =
await req.json();



const slug =
body.slug;



const md =
body.content;



// 1. save markdown

await savePage(
env,
slug,
md
);



// 2. generate article html

const page =
parse(md);



const article =
layout(

articleTemplate({
...page,
slug
}),

`<a href="/edit/${slug}">Edit</a>`

);



await saveHtml(
env,
slug,
article
);




// 3. regenerate index

const pages =
await list(env);



const index =
layout(

indexTemplate(
pages
)

);



await saveHtml(
env,
"index",
index
);



return new Response(
"published"
);



}







/*
======================
HOME
======================
*/


if(path === "/") {


const html =
await getHtml(
env,
"index"
);



if(html) {


return new Response(
html,
{
headers:{
"Content-Type":
"text/html;charset=UTF-8"
}
}
);


}



// fallback

const pages =
await list(env);



return renderPage(

indexTemplate(
pages
)

);



}









/*
======================
NEW
======================
*/


if(path === "/new") {


return renderPage(

editorTemplate({
slug:"",
content:""
})

);


}







/*
======================
EDITOR
======================
*/


if(path.startsWith("/edit/")) {


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
parse(md)
:
{
slug,
title:"",
content:""
};



return renderPage(

editorTemplate(
page
)

);


}







/*
======================
ARTICLE
======================
*/


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


return new Response(
html,
{
headers:{
"Content-Type":
"text/html;charset=UTF-8"
}
}
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

e.message,

{
status:500
}

);


}


}


};
