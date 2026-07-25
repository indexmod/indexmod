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
`

);



await env.PAGES.put(

"index.html",

html

);


}
