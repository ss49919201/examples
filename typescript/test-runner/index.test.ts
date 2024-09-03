import assert from "node:assert/strict";
import { test } from "node:test";

test("テストが成功する", async () => {
  assert.strictEqual(1, 1);
});

const promise = new Promise((resolve) => {
  resolve("ok");
});
test("await を使ったテストが成功する", async () => {
  assert.strictEqual(await promise, "ok");
});

test("テストが失敗する", async () => {
  assert.strictEqual(1, 2);
});

const promise2 = new Promise((_, reject) => {
  reject(new Error("ng"));
});
test("await を使ったテストが失敗する", async () => {
  await promise2;
});

test("falty な値を渡すとテストが成功する", (t, done) => {
  done(false);
});

test("truty な値を渡すとテストが失敗する", (t, done) => {
  done(true);
});
