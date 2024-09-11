import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";

const readlineInterface = createInterface({
  input: stdin,
  output: stdout,
});

const main = async () => {
  while (true) {
    const input = await readlineInterface.question("数値を入力してください: ");
    if (input === "exit") {
      break;
    }
    for (const value of input.split(",")) {
      console.log(`入力された値は${value}です`);
    }
  }
};

main();
