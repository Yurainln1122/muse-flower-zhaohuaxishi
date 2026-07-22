import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the complete game entry", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>暮色拾花/);
  assert.match(html, /拾花校勘员/);
  assert.match(html, /推开园门/);
  assert.match(html, /完整一局约 15 分钟/);
  assert.doesNotMatch(html, /Your site is taking shape|SkeletonPreview/);
});

test("ships twelve original-perspective fragments and all result states", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const fragmentIds = [...page.matchAll(/^\s+id: "([^"]+)",$/gm)].map((match) => match[1]);
  assert.equal(fragmentIds.length, 12);
  assert.equal(new Set(fragmentIds).size, 12);
  assert.match(page, /拾花校勘员/);
  assert.match(page, /清醒成册/);
  assert.match(page, /偏色之册/);
  assert.match(page, /证据回流/);
  assert.match(page, /data-testid="restart-game"/);
  assert.doesNotMatch(page, /SkeletonPreview|react-loading-skeleton/);
});
