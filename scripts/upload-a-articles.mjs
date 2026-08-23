import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const bucket = process.env.R2_BUCKET || "indexmod";
const articlesDir = path.resolve("generated-articles/a");
const manifestPath = path.join(articlesDir, "manifest.json");
const publicOrigin = process.env.PUBLIC_ORIGIN || "https://indexmod.press";

const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));

let uploaded = 0;
let skipped = 0;
let failed = 0;

for (const article of manifest) {
  const filePath = path.join(articlesDir, `${article.slug}.md`);
  const objectPath = `${bucket}/${article.slug}.md`;

  if (await articleExists(article.slug)) {
    console.log(`skip existing ${article.slug}.md`);
    skipped += 1;
    continue;
  }

  const putResult = spawnSync(
    "npx",
    [
      "wrangler",
      "r2",
      "object",
      "put",
      objectPath,
      "--remote",
      "--file",
      filePath,
      "--content-type",
      "text/markdown;charset=UTF-8",
      "--force"
    ],
    { encoding: "utf8" }
  );

  if (putResult.status === 0) {
    console.log(`uploaded ${article.slug}.md`);
    uploaded += 1;
    continue;
  }

  failed += 1;
  console.error(`failed ${article.slug}.md`);
  console.error(putResult.stderr || putResult.stdout);
}

console.log(JSON.stringify({ uploaded, skipped, failed }));

if (failed) {
  process.exit(1);
}

async function articleExists(slug) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`${publicOrigin}/_get/${encodeURIComponent(slug)}`, {
      signal: controller.signal
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
