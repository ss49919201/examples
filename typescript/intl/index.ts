const segmenter = new Intl.Segmenter("ja-JP", { granularity: "word" });
const segments = segmenter.segment("datadata");
for (const seg of segments) {
  console.log(seg.isWordLike);
}
