import test from "node:test";
import assert from "node:assert/strict";

import { buildMeta, og, structuredData } from "../src/meta.js";
import { robots } from "../src/robots.js";
import indexTemplate from "../src/templates/index.js";

test("buildMeta creates canonical article metadata", () => {
  const meta = buildMeta({
    title: "Test Article",
    slug: "Test Article",
    content: "A concise article description with useful context.",
    image: "/logo.svg",
    created: "2026-01-02",
    updated: "2026-02-03",
    language: "ru"
  });

  assert.equal(meta.url, "https://indexmod.press/test-article");
  assert.equal(meta.type, "article");
  assert.equal(meta.image, "https://indexmod.press/logo.svg");
  assert.equal(meta.language, "ru");
  assert.match(meta.robots, /max-image-preview:large/);
});

test("draft metadata is noindex", () => {
  const meta = buildMeta({ title: "Draft", slug: "draft", draft: true });
  assert.equal(meta.robots, "noindex,follow,noarchive");
});

test("Open Graph and JSON-LD include canonical data", () => {
  const meta = buildMeta({ title: "Article", slug: "article", image: "/logo.svg" });
  const openGraph = og(meta);
  const jsonLd = structuredData(meta);

  assert.match(openGraph, /og:url/);
  assert.match(openGraph, /summary_large_image/);
  assert.match(jsonLd, /"@type":"Article"/);
  assert.match(jsonLd, /https:\/\/indexmod\.press\/article/);
});

test("robots keeps public editors crawlable but blocks private APIs", () => {
  const body = robots();
  assert.match(body, /Allow: \/new/);
  assert.match(body, /Allow: \/edit\//);
  assert.match(body, /Disallow: \/_save/);
  assert.match(body, /Sitemap: https:\/\/indexmod\.press\/sitemap\.xml/);
});

test("homepage removes duplicate slugs and includes editorial sections", () => {
  const html = indexTemplate([
    { slug: "alpha", title: "Alpha" },
    { slug: "alpha", title: "Alpha duplicate" },
    { slug: "beta", title: "Beta" },
    { slug: "_private", title: "Private" }
  ]);

  assert.equal((html.match(/href="\/alpha"/g) || []).length, 1);
  assert.match(html, /About Indexmod/);
  assert.match(html, /Editorial policy/);
  assert.doesNotMatch(html, /Private/);
});
