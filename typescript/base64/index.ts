import { readFileSync } from "fs";

console.log(Buffer.from("hoge").toString("base64"));

const f = readFileSync("./hoge.csv");
console.log(Buffer.from(f).toString("base64"));
