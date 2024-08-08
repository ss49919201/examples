import { readFileSync, unlinkSync } from "fs";
import puppeteer from "puppeteer";

const generatePdf = async (input: string): Promise<Buffer> => {
  await writePdf({
    content: input,
    outputPath: "./output.pdf",
  });

  const buffer = pdfToBuffer("./output.pdf");
  removePdf("./output.pdf");
  return buffer;
};

const writePdf = async ({
  content,
  outputPath,
}: {
  content: string;
  outputPath: string;
}): Promise<void> => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(content);
  await page.pdf({
    path: outputPath,
  });
  await browser.close();
};

const pdfToBuffer = (pdfPath: string): Buffer => {
  return readFileSync(pdfPath);
};

const removePdf = (pdfPath: string): void => {
  unlinkSync(pdfPath);
};

const generatePdfBuffer = async ({
  content,
}: {
  content: string;
}): Promise<Buffer> => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(content);
  const arrayBuffer = await page.pdf({});
  await browser.close();
  return Buffer.from(arrayBuffer);
};

generatePdf(`
    <h1><a href="https://example.com">Example</a></h1>
`).then((buffer) => {
  console.log("Success! buffer.length is ", buffer.length);
});

generatePdfBuffer({
  content: `
    <h1><a href="https://example.com">Example</a></h1>
  `,
}).then((buffer) => {
  console.log("Success! buffer.length is ", buffer.length);
});
