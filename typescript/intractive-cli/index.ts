import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";

const readlineInterface = createInterface({
  input: stdin,
  output: stdout,
});

const main = async () => {
  readlineInterface.question("処理を実行しますか？ (y/n): ").then((answer) => {
    if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
      console.log("処理を実行します");
    } else {
      console.log("処理をキャンセルしました");
    }
    readlineInterface.close();
  });
};

main();
