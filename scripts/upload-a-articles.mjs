import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const bucket = process.env.R2_BUCKET || "indexmod";
const articlesDir = path.resolve("generated-articles/a");
const manifestPath = path.join(articlesDir, "manifest.json");
const publicOrigin = process.env.PUBLIC_ORIGIN || "https://indexmod.press";
const overwriteExisting = process.env.OVERWRITE_EXISTING === "true";

const uploadPriority = ["azerbaijan-fashion-week", "artcom-media", "aesf", "about-clothing"];
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8")).sort((a, b) => {
  const ai = uploadPriority.indexOf(a.slug);
  const bi = uploadPriority.indexOf(b.slug);
  return (ai === -1 ? uploadPriority.length : ai) - (bi === -1 ? uploadPriority.length : bi);
});

let uploaded = 0;
let skipped = 0;
let failed = 0;

for (const article of manifest) {
  const filePath = path.join(articlesDir, `${article.slug}.md`);
  const objectPath = `${bucket}/${article.slug}.md`;

  if (!overwriteExisting && await articleExists(article.slug)) {
    console.log(`skip existing ${article.slug}.md`);
    skipped += 1;
    continue;
  }

  const putResult = spawnSync(
    "wrangler",
    [
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
    {
      encoding: "utf8",
      env: {
        ...process.env,
        CI: "true",
        WRANGLER_SEND_METRICS: "false"
      },
      maxBuffer: 1024 * 1024 * 10,
      timeout: 120000
    }
  );

  if (putResult.status === 0) {
    console.log(`uploaded ${article.slug}.md`);
    uploaded += 1;
    continue;
  }

  failed += 1;
  console.error(`failed ${article.slug}.md`);
  if (putResult.error) {
    console.error(putResult.error.message);
  }
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
