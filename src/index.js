import {
  getFile,
  getHtml,
  savePage,
  list
} from "./storage.js";


import { parse } from "./markdown.js";
import { renderPage } from "./render.js";


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


if(path === "/logo.svg") {


const file =
await env.PAGES.get(
"logo.svg"
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
// API LIST
// ======================


if(path === "/_list") {


return Response.json(
await list(env)
);


}




// ======================
// API GET
// ======================


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




// ======================
// SAVE
// ======================


if(path === "/_save") {


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



return new Response(
"ok"
);


}





// ======================
// HOME
// ======================


if(path === "/") {


const pages =
await list(env);



return renderPage(

indexTemplate(pages),

""

);


}





// ======================
// NEW
// ======================


if(path === "/new") {


return renderPage(

editorTemplate({

slug:"",

title:"",

content:""

}),

""

);


}




// ======================
// EDIT
// ======================


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

{
...parse(md),
slug
}

:

{
slug,
title:"",
content:""
};



return renderPage(

editorTemplate(page),

""

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



if(!md) {


return new Response(
"404",
{
status:404
}
);

}



const page =
parse(md);



return renderPage(

articleTemplate({

...page,

slug

}),

""

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
