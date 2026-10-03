import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");

execFileSync(process.execPath, [resolve(root, "scripts/build-static.mjs")], {
  cwd: root,
  stdio: "ignore",
});

test("build publishes the public site", () => {
  for (const file of ["index.html", "terms.html", "privacy.html", "legal.css", "b9.png"]) {
    assert.ok(existsSync(resolve(dist, file)), `${file} missing from dist`);
  }
  assert.ok(existsSync(resolve(dist, "images")));
  assert.ok(existsSync(resolve(dist, "fonts")));
});

test("build never publishes internal documents", () => {
  for (const folder of ["structure", "docs", "archive"]) {
    assert.equal(existsSync(resolve(dist, folder)), false, `${folder}/ must not be public`);
  }
});

test("robots.txt keeps internal brand pages out of search", () => {
  const robots = readFileSync(resolve(dist, "robots.txt"), "utf8");
  for (const page of ["/package", "/naming", "/logos"]) {
    assert.match(robots, new RegExp(`^Disallow: ${page}$`, "m"));
  }
});

test("internal brand pages carry noindex", () => {
  for (const page of ["package.html", "naming.html", "logos.html"]) {
    const html = readFileSync(resolve(dist, page), "utf8");
    assert.match(html, /<meta name="robots" content="noindex, nofollow">/);
  }
});
