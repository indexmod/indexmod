// ===============================
// R2 STORAGE
// ===============================


const mdFile = (slug) =>
  slug + ".md";


const htmlFile = (slug) =>
  slug + ".html";



// ===============================
// GET MARKDOWN
// ===============================

export async function getFile(env, slug) {

  const obj =
    await env.PAGES.get(
      mdFile(slug)
    );


  return obj
    ? await obj.text()
    : null;

}



// ===============================
// GET HTML
// ===============================

export async function getHtml(env, slug) {

  const obj =
    await env.PAGES.get(
      htmlFile(slug)
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
// SAVE HTML ALIAS
// ===============================

export async function saveHtml(
  env,
  slug,
  html
) {

  await putHtml(
    env,
    slug,
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



  if (html) {

    await putHtml(
      env,
      slug,
      html
    );

  }


}



// ===============================
// LIST FILES
// ===============================

export async function list(env) {


  const res =
    await env.PAGES.list();



  const pages =
    await Promise.all(

      res.objects

        .filter(
          o => o.key.endsWith(".md")
        )


        .map(async o => {


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

    (a,b) =>
      a.title.localeCompare(
        b.title
      )

  );



  return pages;

}



// ===============================
// FRONTMATTER
// ===============================

function parseFrontmatter(
  md = ""
) {


  const m =
    md.match(
      /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
    );



  if (!m) {

    return {

      title:"",
      content:md

    };

  }



  const fm = {};



  m[1]

    .split("\n")

    .forEach(line => {


      const i =
        line.indexOf(":");



      if (i === -1)
        return;



      fm[
        line.slice(0,i).trim()
      ] =
        line.slice(i+1).trim();


    });



  return {

    title:
      fm.title || "",

    content:
      m[2]

  };

}
