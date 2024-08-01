import { setTimeout } from "timers/promises";

const test = async () => {
  return await setTimeout(100, "result");
};

test().then(
  (result) => {
    console.log(result);
  },
  (error) => {
    console.error(error);
  }
); // result
