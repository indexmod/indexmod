import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const bucket = process.env.R2_BUCKET || "indexcms-pages";

const assets = [
  ["styles/base.css", "text/css;charset=UTF-8"],
  ["styles/view.css", "text/css;charset=UTF-8"],
  ["styles/editor.css", "text/css;charset=UTF-8"],
  ["styles/index.css", "text/css;charset=UTF-8"],
  ["logo.svg", "image/svg+xml"],
  ["favicon.svg", "image/svg+xml"]
];

for (const [file, contentType] of assets) {
  if (!existsSync(file)) {
    console.error(`Missing asset: ${file}`);
    process.exit(1);
  }

  const result = spawnSync(
    "wrangler",
    [
      "r2",
      "object",
      "put",
      `${bucket}/${file}`,
      "--file",
      file,
      "--content-type",
      contentType,
      "--remote"
    ],
    {
      stdio: "inherit"
    }
  );

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
