import assert from "assert";
import { fileTypeFromBlob } from "file-type";
import { readFileSync } from "fs";

const blob = new Blob(['<?xml version="1.0" encoding="ISO-8859-1" ?>'], {
  type: "application/xml",
});

fileTypeFromBlob(blob)
  .then((fileType) => {
    assert(fileType?.ext === "xml");
    assert(fileType?.mime === "application/xml");
  })
  .catch((error) => {
    console.error(error);
  });

// PNG
const file = readFileSync("./example.jpg");
// to Blob
const blob2 = new Blob([file], { type: "image/png" });

fileTypeFromBlob(blob2)
  .then((fileType) => {
    assert(fileType?.ext === "jpg");
    assert(fileType?.mime === "image/jpeg");
  })
  .catch((error) => {
    console.error(error);
  });
