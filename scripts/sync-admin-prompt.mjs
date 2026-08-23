import { spawnSync } from "node:child_process";

const bucket = process.env.R2_BUCKET || "indexmod";
const objectPath = `${bucket}/admin-prompt.txt`;

const result = spawnSync(
  "wrangler",
  [
    "r2",
    "object",
    "put",
    objectPath,
    "--remote",
    "--file",
    "prompt.md",
    "--content-type",
    "text/plain;charset=UTF-8",
    "--force"
  ],
  { encoding: "utf8" }
);

if (result.status !== 0) {
  console.error(result.stderr || result.stdout);
  process.exit(result.status || 1);
}

console.log(`Uploaded prompt.md to ${objectPath}`);
