import { readFileSync, unlinkSync } from "fs";
import puppeteer, { Browser } from "puppeteer";

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

const generateMultipluPdfs = async (): Promise<void> => {
  console.log("Starting...");
  const start = Date.now();
  const browser = await puppeteer.launch();
  const promises = Array.from({ length: 2 }).map(async (_, i) => {
    const page = await browser.newPage();
    await page.setContent(`
    <h1><a href="https://example.com">Example${i}</a></h1>
  `);
    const buffer = await page.pdf({
      path: `./output${i}.pdf`,
    });
    console.log("Success! buffer.length is ", buffer.length);
    return buffer;
  });
  await Promise.all(promises);
  await browser.close();
  console.log("All done in ", Date.now() - start, "ms");
};

const generateMultipluPdfsUsingParam = async (
  browser: Browser
): Promise<void> => {
  console.log("Starting...");
  const start = Date.now();
  const promises = Array.from({ length: 2 }).map(async (_, i) => {
    const page = await browser.newPage();
    await page.setContent(`
    <h1><a href="https://example.com">Example${i}</a></h1>
  `);
    const buffer = await page.pdf({
      path: `./output${i}.pdf`,
    });
    console.log("Success! buffer.length is ", buffer.length);
    return buffer;
  });
  await Promise.all(promises);
  await browser.close();
  console.log("All done in ", Date.now() - start, "ms");
};

generateMultipluPdfs().finally(() => {
  console.log("All done");
});

(async function () {
  const browser = await puppeteer.launch();
  generateMultipluPdfsUsingParam(browser).finally(async () => {
    console.log("All done");
    await browser.close();
  });
})();
