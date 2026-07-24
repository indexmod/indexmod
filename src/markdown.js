import { marked } from "marked";


export function parse(md = "") {

  const match = md.match(
    /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
  );


  let frontmatter = {};
  let content = md;


  if (match) {

    match[1]
      .split("\n")
      .forEach(line => {

        const i = line.indexOf(":");

        if (i === -1) return;


        const key =
          line.slice(0, i).trim();


        const value =
          line.slice(i + 1).trim();


        frontmatter[key] = value;

      });


    content = match[2].trim();

  }


  let html = marked.parse(
    content
  );


  // AUTO IMAGE LINKS

  html = html.replace(

    /(^|\s)(https?:\/\/[^\s]+?\.(jpg|jpeg|png|gif|webp|svg))(\s|$)/gi,

    '$1<img src="$2" style="max-width:100%;display:block;margin:20px 0;">$4'

  );


  // FOOTNOTES

  html = html.replace(

    /\[(\d+)\]/g,

    '<span class="fn">[$1]</span>'

  );


  return {

    title:
      frontmatter.title || "",


    slug:
      frontmatter.slug || "",


    ...frontmatter,


    content,


    html

  };

}
