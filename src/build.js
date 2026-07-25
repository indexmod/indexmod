import indexTemplate from "./templates/index.js";

import { list } from "./storage.js";

import layout from "./templates/layout.js";



export async function rebuildIndex(env) {


const pages =
await list(env);



const content =
indexTemplate(pages);



const html =
layout(

content,

`
<a href="/new">
New
</a>
`,

{

title:
"Indexmod",

description:
"Indexmod — fashion and art encyclopedia"

}

);



await env.PAGES.put(

"index.html",

html,

{

httpMetadata:{

contentType:
"text/html;charset=UTF-8"

}

}

);



return html;


}
