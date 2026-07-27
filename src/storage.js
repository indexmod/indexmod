// ===============================
// R2 STORAGE
// ===============================

import { normalizeSlug } from "./slug.js";


const mdFile = (slug) =>
  `${slug}.md`;


const htmlFile = (slug) =>
  `${slug}.html`;


const indexMetaFile =
"index.meta.json";



// ===============================
// GET MARKDOWN
// ===============================


export async function getFile(
  env,
  slug
) {

  const obj =
    await env.PAGES.get(
      mdFile(slug)
    );


  return obj
    ? await obj.text()
    : null;

}



// ===============================
// GET HTML CACHE
// ===============================


export async function getHtml(
  env,
  slug
) {

  const obj =
    await env.PAGES.get(
      htmlFile(slug)
    );


  return obj
    ? await obj.text()
    : null;

}



// ===============================
// GET INDEX CACHE
// ===============================


export async function getIndex(
  env
) {

  const obj =
    await env.PAGES.get(
      "index.html"
    );


  return obj
    ? await obj.text()
    : null;

}



// ===============================
// GET INDEX META
// ===============================


export async function getIndexMeta(
  env
) {


const obj =
await env.PAGES.get(
  indexMetaFile
);


if(!obj)
return null;


try {


return JSON.parse(
await obj.text()
);


}
catch {


return null;


}


}



// ===============================
// SAVE MARKDOWN
// ===============================


export async function putFile(
  env,
  slug,
  content
) {


await env.PAGES.put(

mdFile(slug),

content

);


}



// ===============================
// SAVE HTML
// ===============================


export async function putHtml(
  env,
  slug,
  html
) {


await env.PAGES.put(

htmlFile(slug),

html

);


}



// ===============================
// SAVE INDEX
// ===============================


export async function putIndex(
  env,
  html
) {


await env.PAGES.put(

"index.html",

html

);


}



// ===============================
// SAVE INDEX META
// ===============================


export async function putIndexMeta(
  env,
  meta
) {


await env.PAGES.put(

indexMetaFile,

JSON.stringify(meta),

{

httpMetadata:{

contentType:
"application/json;charset=UTF-8"

}

}

);


}



// ===============================
// SAVE PAGE
// ===============================


export async function savePage(
  env,
  slug,
  content,
  html = null
) {


await putFile(

env,

slug,

content

);



if(html){


await putHtml(

env,

slug,

html

);


}


}



// ===============================
// DELETE PAGE
// ===============================


export async function deletePage(
  env,
  slug
) {

await Promise.all([

env.PAGES.delete(
mdFile(slug)
),

env.PAGES.delete(
htmlFile(slug)
)

]);

}



// ===============================
// LIST PAGES
// ===============================


export async function list(
  env
) {


const keys =
await listMarkdownKeys(env);



const pages =
await Promise.all(

keys.map(async key=>{


const slug =
key.replace(
".md",
""
);



const md =
await getFile(
env,
slug
);



const parsed =
parseFrontmatter(md);



const permalink =
normalizeSlug(
parsed.slug || slug
);



return {

slug:
permalink || slug,

title:
parsed.title || slug

};


})

);



const uniquePages =
[
...new Map(
pages.map(page => [
page.slug,
page
])
)
.values()
];



uniquePages.sort(

(a,b)=>

a.title.localeCompare(
b.title
)

);



return uniquePages;


}



// ===============================
// LIST SEO PAGES
// ===============================


export async function listSeoPages(
env
) {


const objects =
await listMarkdownObjects(env);


const pages =
await Promise.all(

objects.map(async object=>{


const storageSlug =
object.key.replace(
".md",
""
);


const md =
await getFile(
env,
storageSlug
);


const parsed =
parseFrontmatter(md);


const slug =
normalizeSlug(
parsed.slug || storageSlug
);


return {

slug,

title:
parsed.title || storageSlug,

lastmod:
formatDate(object.uploaded)

};


})

);


const uniquePages =
new Map();


pages.forEach(page=>{


if(!page.slug)
return;


const current =
uniquePages.get(page.slug);


if(
!current ||
(
page.lastmod &&
page.lastmod > current.lastmod
)
){

uniquePages.set(
page.slug,
page
);

}


});


return [...uniquePages.values()]

.sort(
(a,b)=>
a.slug.localeCompare(b.slug)
);


}



// ===============================
// FIND PAGE BY PERMALINK
// ===============================


export async function findPageByPermalink(
env,
permalink
) {


const target =
normalizeSlug(permalink);


if(!target)
return null;


const keys =
await listMarkdownKeys(env);


for(const key of keys){


const storageSlug =
key.replace(
".md",
""
);


const md =
await getFile(
env,
storageSlug
);


const parsed =
parseFrontmatter(md);


const frontmatterSlug =
normalizeSlug(
parsed.slug || ""
);


if(frontmatterSlug === target){

return {

storageSlug,

slug:
target,

content:
md

};

}


}


return null;


}



// ===============================
// LIST MARKDOWN KEYS
// ===============================


export async function listMarkdownKeys(
env
) {


const objects =
await listMarkdownObjects(env);



return objects

.map(
o =>
o.key
)


.sort();


}



async function listMarkdownObjects(
env
) {


const objects = [];

let cursor;



do {


const res =
await env.PAGES.list(

cursor
?
{
cursor
}
:
undefined

);



objects.push(
...res.objects
);



cursor =
res.truncated
?
res.cursor
:
null;


}
while(cursor);



return objects

.filter(

object =>
object.key.endsWith(".md")

)


.filter(

object =>

![

"index.html.md",

"sitemap.xml.md",

"robots.txt.md"

]
.includes(object.key)

)


}



// ===============================
// INDEX SIGNATURE
// ===============================


export function indexSignature(
keys=[]
) {


return keys

.slice()

.sort()

.join("\n");


}



function formatDate(value){


if(!value)
return "";


const date =
new Date(value);


if(Number.isNaN(date.getTime()))
return "";


return date
.toISOString()
.slice(0,10);


}



// ===============================
// FRONTMATTER
// ===============================


export function parseFrontmatter(
md=""
) {


const m =
md.match(

/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/

);



if(!m){


return {

title:"",

slug:"",

content:md

};


}



const fm = {};



m[1]

.split(/\r?\n/)

.forEach(line=>{


const i =
line.indexOf(":");



if(i === -1)
return;



const key =
line
.slice(0,i)
.trim();



const value =
line
.slice(i+1)
.trim();



fm[key]=value;


});



return {

title:
fm.title || "",


slug:
fm.slug || "",


description:
fm.description || "",


image:
fm.image || "",


content:
m[2]

};


}
