import indexTemplate from "./templates/index.js";
import { getIndexPages, list, putIndex, putIndexPages } from "./storage.js";
import layout from "./templates/layout.js";

export async function rebuildIndex(env) {
  const pages = await list(env);
  await putIndexPages(env, pages);
  return writeIndex(env, pages);
}

export async function updateIndexPage(env, page, previousSlug = "") {
  let pages = await getIndexPages(env);

  if (!pages) {
    pages = await list(env);
  }

  const oldSlug = previousSlug || page.slug;
  pages = pages.filter((item) => item.slug !== oldSlug);
  pages.push(page);
  pages.sort((a, b) => a.title.localeCompare(b.title));

  await putIndexPages(env, pages);
  return writeIndex(env, pages);
}

export async function removeIndexPage(env, slug) {
  let pages = await getIndexPages(env);

  if (!pages) {
    pages = await list(env);
  }

  pages = pages.filter((page) => page.slug !== slug);
  await putIndexPages(env, pages);
  return writeIndex(env, pages);
}

async function writeIndex(env, pages) {
  const content = indexTemplate(pages);
  const html = layout(
    content,
    `
<a href="/new">
New
</a>
`,
    {
      title: "Indexmod",
      description: "Indexmod — fashion and art encyclopedia"
    }
  );

  await putIndex(env, html);
  return html;
}
