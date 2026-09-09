import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "dist");

const files = [
  "index.html",
  "package.html",
  "flyer.html",
  "naming.html",
  "logos.html",
  "b9.png",
];
const directories = ["images", "archive", "docs", "structure"];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

await Promise.all([
  ...files.map((file) => cp(resolve(root, file), resolve(output, file))),
  ...directories.map((directory) =>
    cp(resolve(root, directory), resolve(output, directory), { recursive: true })
  ),
]);

console.log(`Built ${files.length} files and ${directories.length} directories into dist/`);
