import {
  getFile,
  getIndex,
  getAdminPrompt,
  findPageByPermalink,
  deletePage,
  listStoredPages,
  putAdminPrompt,
  savePage,
  list
} from "./storage.js";


import { parse } from "./markdown.js";
import { renderPage } from "./render.js";
import {
  rebuildIndex,
  removeIndexPage,
  updateIndexPage
} from "./build.js";
import { normalizeSlug } from "./slug.js";

import { buildMeta } from "./meta.js";

import { sitemap } from "./sitemap.js";
import { robots } from "./robots.js";


import articleTemplate from "./templates/article.js";
import adminPanelTemplate from "./templates/admin-panel.js";
import adminPromptTemplate from "./templates/admin-prompt.js";
import editorTemplate from "./templates/editor.js";
import { promptForAdmin, promptForEditor } from "./prompt.js";



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
// ADMIN PROMPT API
// ======================


if(
path === "/_prompt"
){


if(req.method !== "POST"){


return new Response(
"method not allowed",
{ status:405 }
);


}


const body =
await req.json();

const prompt =
String(body.prompt || "").trim();


if(!prompt){


return new Response(
"prompt missing",
{ status:400 }
);


}


await putAdminPrompt(
env, prompt);

return Response.json({ ok:true });


}



// ======================
// ADMIN PROMPT PAGE
// ======================


if(
path === "/admin/prompt"
){


const prompt =
promptForAdmin(
await getAdminPrompt(env)
);


return renderPage(

adminPromptTemplate(prompt),


`
<button onclick="savePrompt()">
Save
</button>
`,


buildMeta({

title:"Prompt",

robots:"noindex,nofollow"

})

);


}



// ======================
// API REBUILD INDEX
// ======================


// ======================
// ADMIN PANEL
// ======================


if(
path === "/admin/panel"
){


const pages =
await listStoredPages(env);

const counts =
new Map();


pages.forEach(page => {


const key =
page.title
.toLocaleLowerCase()
.replace(/[^\p{L}\p{N}]+/gu, "");


counts.set(
key,
(counts.get(key) || 0) + 1
);


});


pages.forEach(page => {


const key =
page.title
.toLocaleLowerCase()
.replace(/[^\p{L}\p{N}]+/gu, "");

page.duplicate =
(counts.get(key) || 0) > 1;


});


return renderPage(

adminPanelTemplate(pages),

"",

buildMeta({

title:"Admin panel",

robots:"noindex,nofollow"

})

);


}



// ======================
// ADMIN PERMALINK
// ======================


if(
path === "/_admin/permalink"
){


if(req.method !== "POST"){


return new Response(
"method not allowed",
{ status:405 }
);


}


const body =
await req.json();

const storageSlug =
normalizeSlug(body.storageSlug || "");

const permalink =
normalizeSlug(body.permalink || "");


if(!storageSlug || !permalink){


return new Response(
"permalink missing",
{ status:400 }
);


}


const content =
await getFile(env, storageSlug);


if(!content){


return new Response(
"article not found",
{ status:404 }
);


}


const existing =
await findPageByPermalink(env, permalink);

const targetFile =
await getFile(env, permalink);


if(
(existing && existing.storageSlug !== storageSlug)
||
(targetFile && permalink !== storageSlug)
){


return new Response(
"permalink already exists",
{ status:409 }
);


}


const previous =
parse(content);

const nextContent =
replaceFrontmatterValue(
content,
"slug",
permalink
);

const next =
parse(nextContent);

const html =
articleTemplate({

...next,

slug:permalink

});


await savePage(
env,
permalink,
nextContent,
html
);


if(storageSlug !== permalink){


await deletePage(env, storageSlug);


}


await updateIndexPage(
env,
{
slug:permalink,
title:next.title || permalink
},

normalizeSlug(previous.slug || storageSlug)
);


return Response.json({ ok:true, permalink });


}



// ======================
// ADMIN DELETE
// ======================


if(
path === "/_admin/delete"
){


if(req.method !== "POST"){


return new Response(
"method not allowed",
{ status:405 }
);


}


const body =
await req.json();

const storageSlug =
normalizeSlug(body.storageSlug || "");

const content =
await getFile(env, storageSlug);


if(!content){


return new Response(
"article not found",
{ status:404 }
);


}


const page =
parse(content);

await deletePage(env, storageSlug);

await removeIndexPage(
env,
normalizeSlug(page.slug || storageSlug)
);

return Response.json({ ok:true });


}




if(
path === "/_rebuild"
){


if(
req.method !== "POST"
){

return new Response(
"method not allowed",
{
status:405
}
);

}



await rebuildIndex(env);



return Response.json({
ok:true
});


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
page.slug ||
body.slug ||
page.title;



const originalSlug =
normalizeSlug(
body.originalSlug || ""
);



if(!slug){

return new Response(
"slug missing",
{
status:400
}
);

}



slug =
normalizeSlug(slug);



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



if(
originalSlug &&
originalSlug !== slug
){

await deletePage(
env,
originalSlug
);

}



await updateIndexPage(

env,

{

slug,

title:
page.title || slug

},

originalSlug

);



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


const index =
await getIndex(env) ||
await rebuildIndex(env);



return new Response(

index,

{

headers:{

"Content-Type":
"text/html;charset=UTF-8",

"Cache-Control":
"public,max-age=300,s-maxage=3600,stale-while-revalidate=86400"

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
promptForEditor(
`---
title:
slug:
---

Write text here...
`,

await getAdminPrompt(env)
)

}),


`
<button onclick="save()">
Save
</button>
`,


buildMeta({

title:"New article",

robots:
"noindex,follow"

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



let storageSlug =
slug;

let content =
md;



if(!content){

const found =
await findPageByPermalink(
env,
slug
);

if(found){

storageSlug =
found.storageSlug;

content =
found.content;

}

}



if(content){


const page =
parse(content);



return renderPage(

editorTemplate({

...page,

// сохраняем оригинальный markdown
content:
promptForEditor(
content,

await getAdminPrompt(env)
),

storageSlug

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
,

robots:
"noindex,follow"

})

);


}



const title =
titleFromSlug(slug);



return renderPage(

editorTemplate({

content:
promptForEditor(
`---
title: ${title}
slug: ${slug}
---

Write text here...
`,

await getAdminPrompt(env)
)

}),


`
<button onclick="save()">
Save
</button>
`,


buildMeta({

title,

slug
,

robots:
"noindex,follow"

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



let content =
md;



if(!content){

const found =
await findPageByPermalink(
env,
slug
);

if(found){

content =
found.content;

}

}



if(!content){


const title =
titleFromSlug(slug);



return renderPage(

editorTemplate({

content:
promptForEditor(
`---
title: ${title}
slug: ${slug}
---

Write text here...
`,

await getAdminPrompt(env)
)

}),


`
<button onclick="save()">
Save
</button>
`,


buildMeta({

title,

slug
,

robots:
"noindex,follow"

}),

{
status:404
}

);


}



const page =
parse(content);



const permalink =
normalizeSlug(
page.slug || slug
) || slug;



let image =
page.image === "true"
?
""
:
page.image;



const html =
articleTemplate({

...page,

slug:
permalink

});



return renderPage(

html,


`
<a href="/edit/${permalink}">
Edit
</a>
`,


buildMeta({

title:
page.title || permalink,

description:
page.description,

image:
image,

slug:
permalink

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



function replaceFrontmatterValue(content, key, value) {


const match =
content.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);


if(!match)
return `---\n${key}: ${value}\n---\n\n${content}`;


const lines =
match[1].split(/\r?\n/);

const expression =
new RegExp(`^${key}:`);

const index =
lines.findIndex(line => expression.test(line));


if(index === -1){


lines.push(`${key}: ${value}`);


}
else {


lines[index] =
`${key}: ${value}`;


}


return (
`---\n${lines.join("\n")}\n---\n\n` +
content.slice(match[0].length)
);


}
