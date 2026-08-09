import { spawnSync } from "node:child_process";
import { readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cachePath = path.join(root, "node_modules/.astro/incremental-build.json");

function build() {
  const result = spawnSync(
    process.execPath,
    ["node_modules/astro/bin/astro.mjs", "build"],
    { cwd: root, encoding: "utf8" },
  );
  if (result.status !== 0) {
    throw new Error(`${result.stdout}\n${result.stderr}`);
  }
  return result.stdout + result.stderr;
}

function dependencyHash() {
  const cache = JSON.parse(readFileSync(cachePath, "utf8"));
  return cache.routes["src/pages/[slug].astro"].dependencyHash;
}

rmSync(path.join(root, "dist"), { recursive: true, force: true });
rmSync(path.join(root, "node_modules/.astro"), {
  recursive: true,
  force: true,
});

build();
const firstHash = dependencyHash();
const secondOutput = build();
const secondHash = dependencyHash();
const secondBuildRestored = /\((?:cached|restored)\)/i.test(secondOutput);

const result = {
  firstHash,
  secondHash,
  hashesMatch: firstHash === secondHash,
  secondBuildRestored,
};

console.log(JSON.stringify(result, null, 2));

if (result.hashesMatch || result.secondBuildRestored) {
  throw new Error("The dependency-hash instability did not reproduce");
}
