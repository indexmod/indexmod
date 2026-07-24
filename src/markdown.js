// ===============================
// MARKDOWN PARSER
// ===============================

export function parse(md = "") {

  const m = md.match(
    /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
  );


  if (!m) {

    return {
      title: "",
      slug: "",
      content: md
    };

  }


  const fm = {};


  m[1]
    .split("\n")
    .forEach(line => {

      const i = line.indexOf(":");

      if (i === -1) return;


      const key =
        line.slice(0, i).trim();


      const value =
        line.slice(i + 1).trim();


      fm[key] = value;

    });


  return {

    title: fm.title || "",

    slug: fm.slug || "",

    content: m[2]

  };

}
