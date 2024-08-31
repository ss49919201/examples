import { ResultAsync } from "neverthrow";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const sleepResult = () => {
  return ResultAsync.fromPromise(sleep(1000), () => new Error("Timeout"));
};

const main = async () => {
  await sleepResult();
  console.log("Done!");
};

main();
