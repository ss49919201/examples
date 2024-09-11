import { stdin, stdout } from "node:process";
import * as readline from "node:readline";

const readlineInterface = readline.createInterface({
  input: stdin,
  output: stdout,
});

readlineInterface.question("処理を実行しますか？ (y/n): ", (answer) => {
  if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
    console.log("処理を実行します");
  } else {
    console.log("処理をキャンセルしました");
  }
  readlineInterface.close();
});
