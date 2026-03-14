#!/usr/bin/env node

const fs = require("fs");

function countBytes(str) {
  return Buffer.byteLength(str, "utf8");
}

function fmt(bytes) {
  if (bytes >= 1e12) return `${(bytes / 1e12).toFixed(2)} TB`;
  if (bytes >= 1e9)  return `${(bytes / 1e9).toFixed(2)} GB`;
  if (bytes >= 1e6)  return `${(bytes / 1e6).toFixed(2)} MB`;
  if (bytes >= 1e3)  return `${(bytes / 1e3).toFixed(2)} KB`;
  return `${bytes} B`;
}

function run(input) {
  JSON.parse(input); // バリデーション
  const bytes = countBytes(input);
  console.log(`${bytes.toLocaleString()} B (${fmt(bytes)})`);
}

const filePath = process.argv[2];

if (filePath) {
  const input = fs.readFileSync(filePath, "utf8");
  run(input);
} else if (!process.stdin.isTTY) {
  let input = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => (input += chunk));
  process.stdin.on("end", () => run(input));
} else {
  console.error("使い方:");
  console.error("  node index.js <file.json>");
  console.error("  echo '{...}' | node index.js");
  process.exit(1);
}
