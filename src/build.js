import indexTemplate from "./templates/index.js";
import { getIndexPages, list, putIndex, putIndexPages } from "./storage.js";
import layout from "./templates/layout.js";

export async function rebuildIndex(env) {
  const pages = ensureBuiltInPages(
    await getIndexPages(env) ||
    await list(env)
  );
  await putIndexPages(env, pages);
  return writeIndex(env, pages);
}

function ensureBuiltInPages(pages = []) {
  const nextPages = pages.filter(
    page => page && page.slug !== "legal"
  );

  nextPages.push({
    slug: "legal",
    title: "Legal",
    updatedAt: Date.parse("2026-09-04T00:00:00.000Z")
  });

  nextPages.sort((a, b) => a.title.localeCompare(b.title));

  return nextPages;
}

export async function updateIndexPage(env, page, previousSlug = "") {
  let pages = await getIndexPages(env);

  if (!pages) {
    pages = await list(env);
  }

  const oldSlug = previousSlug || page.slug;
  pages = pages.filter((item) => item.slug !== oldSlug);
  const storedPage = await env.PAGES.head(`${page.slug}.md`);
  pages.push({
    ...page,
    updatedAt: storedPage?.uploaded
      ? new Date(storedPage.uploaded).getTime()
      : Date.now()
  });
  pages.sort((a, b) => a.title.localeCompare(b.title));

  await putIndexPages(env, pages);
  return writeIndex(env, pages);
}

export async function removeIndexPage(env, slug) {
  return removeIndexPages(env, [slug]);
}

export async function removeIndexPages(env, slugs) {
  let pages = await getIndexPages(env);

  if (!pages) {
    pages = await list(env);
  }

  const removedSlugs = new Set(slugs);
  pages = pages.filter((page) => !removedSlugs.has(page.slug));
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
