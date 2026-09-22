import {test} from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";
import {parse} from "../src/markdown.js";
import {buildMeta, extractDescription} from "../src/meta.js";
import {metadata, applyEditorial} from "../src/editorial.js";
import {isPlaceholder, publicLinks} from "../src/url-policy.js";
import {fixtureEnv} from "./fixtures.mjs";

const request = (url, env, options) => worker.fetch(new Request(url, options), env);

test("protocol, www, home aliases and article aliases redirect straight to final URLs", async () => {
  const env = fixtureEnv();
  for (const host of ["http://indexmod.press", "http://www.indexmod.press", "https://www.indexmod.press", "https://indexmod.press"]) {
    for (const [path, final] of [["/sample", "/sample"], ["/home", "/"], ["/index", "/"], ["/home/", "/"], ["/old-slug", "/new-slug"]]) {
      const response = await request(host+path+"?ref=test", env, {method:"HEAD"});
      const target = "https://indexmod.press"+final+"?ref=test";
      if (host+path+"?ref=test" === target) assert.equal(response.status, 200);
      else {
        assert.equal(response.status, 301, host+path);
        assert.equal(response.headers.get("Location"), target);
        assert.equal((await request(target, env)).status, 200, "no second redirect");
      }
    }
  }
});

test("noncanonical POST redirects without writing anything", async () => {
  const env = fixtureEnv();
  const before = [...env.PAGES.files];
  const response = await request("http://www.indexmod.press/_save", env, {method:"POST",body:"{}"});
  assert.equal(response.status,301);
  assert.deepEqual([...env.PAGES.files], before);
});

test("public templates have one absolute query-free canonical; public links omit editor", async () => {
  const env = fixtureEnv();
  for (const path of ["/", "/sample", "/legal", "/тема"]) {
    const response = await request("https://indexmod.press"+path+"?utm_source=test", env);
    assert.equal(response.status,200);
    const html = await response.text();
    const canonicals = [...html.matchAll(/rel="canonical" href="([^"]+)"/g)].map(m=>m[1]);
    assert.deepEqual(canonicals, ["https://indexmod.press"+encodeURI(path)]);
    assert.match(response.headers.get("Cache-Control"),/s-maxage=3600/);
    assert.doesNotMatch(html, /href="\/(?:edit\/|new(?:"|\/)|home(?:"|\/)|index(?:"|\/)|new-page(?:"|\/))/);
    if (path === "/") assert.doesNotMatch(html, /href="\/(?:empty|blank|hidden|draft|missing)/);
  }
});

test("edit pages remain crawlable but always have an HTTP noindex header", async () => {
  const env = fixtureEnv();
  for (const slug of ["index", "home", "cyprus", "kazumi-mico", "sample", "missing"]) {
    const response = await request("https://indexmod.press/edit/"+slug, env, {method:"HEAD"});
    assert.equal(response.status,200);
    assert.equal(response.headers.get("X-Robots-Tag"),"noindex");
    assert.equal(response.headers.get("Cache-Control"),"no-store");
  }
  const failing = {PAGES:{async get(){throw new Error("Storage unavailable");}}};
  assert.equal((await request("https://indexmod.press/edit/sample", failing)).headers.get("X-Robots-Tag"),"noindex");
  const robots = await (await request("https://indexmod.press/robots.txt", env)).text();
  assert.doesNotMatch(robots,/^Disallow:\s*\/(edit|empty|blank)/m);
  assert.match(robots,/Sitemap: https:\/\/indexmod.press\/sitemap.xml/);
  assert.match(robots,/Write here/);
});

test("empty topics stay editable and get noindex; removed template gets 410", async () => {
  const env = fixtureEnv();
  for (const slug of ["empty", "empty-ascii", "empty-editor", "blank", "hidden", "draft"]) {
    const response = await request("https://indexmod.press/"+slug, env);
    assert.equal(response.status,200);
    assert.equal(response.headers.get("X-Robots-Tag"),"noindex",slug);
    assert.match(await response.text(),/name="robots" content="noindex/);
  }
  assert.equal((await request("https://indexmod.press/new-page",env)).status,410);
  assert.equal((await request("https://indexmod.press/not-a-page",env)).status,404);
  assert.equal(isPlaceholder("Useful article text.\n<!-- Write here... -->"),false);
  assert.equal(isPlaceholder("# Empty\n\nWrite here…"),true);
});

test("sitemap excludes legacy, service, draft, empty and missing URLs on cold and warm catalogs", async () => {
  const env = fixtureEnv();
  for (const warmed of [false,true]) {
    if (warmed) await request("https://indexmod.press/",env);
    const xml = await (await request("https://indexmod.press/sitemap.xml",env)).text();
    const urls = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(m=>m[1]);
    assert.equal(urls.length,new Set(urls).size);
    assert(urls.includes("https://indexmod.press/sample"));
    for (const url of urls) {
      assert.match(url,/^https:\/\/indexmod.press\//);
      assert.doesNotMatch(url,/\/(?:home|index|edit|new-page|empty|hidden|blank|draft|missing|old-slug)(?:$|\/|-)/);
      assert.equal((await request(url,env)).status,200);
    }
    assert.match(xml,/<lastmod>\s*2026-09-01\s*<\/lastmod>/);
  }
});

test("saving a filled topic removes noindex and restores sitemap membership", async () => {
  const env = fixtureEnv();
  await request("https://indexmod.press/",env);
  const response = await request("https://indexmod.press/_save",env,{method:"POST",body:JSON.stringify({slug:"empty", content:"---\ntitle: Filled topic\nslug: empty\n---\n\nA substantial new article describing its subject."})});
  assert.equal(response.status,200);
  const page = await request("https://indexmod.press/empty",env);
  assert.equal(page.headers.get("X-Robots-Tag"),null);
  const xml = await (await request("https://indexmod.press/sitemap.xml",env)).text();
  assert.match(xml,/https:\/\/indexmod.press\/empty\s*</);
});

test("editorial metadata fits limits; CMS overrides win; brand FAQ is visible without FAQPage", () => {
  for (const [slug, meta] of Object.entries(metadata)) {
    assert([...meta.title+" — Indexmod"].length<=60,slug);
    assert([...meta.description].length>=140 && [...meta.description].length<=160,slug);
    const page = applyEditorial(parse("---\ntitle: Original\n---\nReal text."),slug);
    assert.equal(page.description,meta.description);
  }
  const explicit = applyEditorial(parse("---\ntitle: Original\nseo_title: CMS title\ndescription: CMS description\n---\nBody."),"karput-olga");
  assert.equal(explicit.seoTitle,"CMS title"); assert.equal(explicit.description,"CMS description");
  for (const slug of ["acne-studios","oriflame-company"]) {
    const result = applyEditorial(parse("---\ntitle: Brand\n---\nOriginal text."),slug);
    assert.match(result.html,/<h2>Questions and answers<\/h2>/);
    assert.doesNotMatch(result.html,/FAQPage|требует проверки/);
  }
  assert.doesNotMatch(extractDescription("***Updated 2026-09-01***\n\n[Person](/person) writes books.[1]"), /Updated|\[1\]|\/person/);
  assert.equal(buildMeta({slug:"sample"}).url,"https://indexmod.press/sample");
  assert.doesNotThrow(()=>publicLinks('<a href="/%ZZ">Malformed legacy link</a>'));
});
