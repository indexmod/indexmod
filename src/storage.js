// ===============================
// R2 STORAGE
// ===============================


const mdFile = (slug) =>
  `${slug}.md`;


const htmlFile = (slug) =>
  `${slug}.html`;



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
// SAVE HTML CACHE
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
// SAVE INDEX CACHE
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
// LIST PAGES
// ===============================


export async function list(
  env
) {


const objects =
[];



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
undefined;


}
while(cursor);



const pages =
await Promise.all(

objects

.filter(
o =>
o.key.endsWith(".md")
)


.map(async o=>{


const slug =
o.key.replace(
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



return {

slug,

title:
parsed.title || slug

};


})


);



pages.sort(

(a,b)=>
a.title.localeCompare(
b.title
)

);



return pages;


}



// ===============================
// FRONTMATTER
// ===============================


export function parseFrontmatter(
md = ""
) {


const m =
md.match(
/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/
);



if(!m){


return {

title:"",

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



fm[key] = value;


});



return {


title:
fm.title || "",


slug:
fm.slug || "",


content:
m[2]


};


}
