import { generate } from "csv-generate";
import { Stringifier, stringify } from "csv-stringify";
import { stringify as stringifySync } from "csv-stringify/sync";
import { writeFileSync } from "fs";

const stringfier: Stringifier = stringify({
  header: true,
  columns: {
    word: "単語",
    sentenceLF: "これは\n文章です。",
    sentenceCR: "これは\r文章です。",
    sentenceCRLF: "これは\n文章です。",
  },
});

const stringfierSync = stringifySync(
  [
    {
      word: "単語",
      sentenceLF: "これは\n文章です。",
      sentenceCR: "これは\r文章です。",
      sentenceCRLF: "これは\n文章です。",
    },
  ],
  {
    header: true,
  }
);

const exportToStdout = (stringfier: Stringifier) => {
  generate({
    length: 2,
    seed: 1,
  })
    .pipe(stringfier)
    .pipe(process.stdout);
};

const exportToFile = (path: string, data: string) => {
  writeFileSync(path, data);
};

exportToStdout(stringfier);
exportToFile("./output.csv", stringfierSync);
