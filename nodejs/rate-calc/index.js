#!/usr/bin/env node

const perSecond = parseFloat(process.argv[2]);
const bytesPerSecond = parseFloat(process.argv[3]);

if (isNaN(perSecond) || process.argv.length < 3) {
  console.error("使い方: node index.js <1秒あたりの件数> [1秒あたりのバイト数]");
  process.exit(1);
}

const SECONDS_PER_DAY = 60 * 60 * 24;

const perDay = perSecond * SECONDS_PER_DAY;
const per30Days = perDay * 30;

console.log("【件数】");
console.log(`  1秒あたり : ${perSecond.toLocaleString()} 件`);
console.log(`  1日あたり : ${perDay.toLocaleString()} 件`);
console.log(`  30日あたり: ${per30Days.toLocaleString()} 件`);

if (!isNaN(bytesPerSecond)) {
  const bytesPerDay = bytesPerSecond * SECONDS_PER_DAY;
  const bytesPer30Days = bytesPerDay * 30;

  const fmt = (bytes) => {
    if (bytes >= 1e12) return `${(bytes / 1e12).toFixed(2)} TB`;
    if (bytes >= 1e9)  return `${(bytes / 1e9).toFixed(2)} GB`;
    if (bytes >= 1e6)  return `${(bytes / 1e6).toFixed(2)} MB`;
    if (bytes >= 1e3)  return `${(bytes / 1e3).toFixed(2)} KB`;
    return `${bytes} B`;
  };

  console.log("\n【バイト数】");
  console.log(`  1秒あたり : ${fmt(bytesPerSecond)} (${bytesPerSecond.toLocaleString()} B)`);
  console.log(`  1日あたり : ${fmt(bytesPerDay)} (${bytesPerDay.toLocaleString()} B)`);
  console.log(`  30日あたり: ${fmt(bytesPer30Days)} (${bytesPer30Days.toLocaleString()} B)`);
}
