import { setTimeout } from "timers/promises";

{
  async function f() {
    const arr = Array.from({ length: 10 }).map((_, idx) => idx);
    for (const v of arr) {
      await setTimeout(1);
      console.log(v);
    }
  }

  async function f2() {
    const arr = Array.from({ length: 10 }).map((_, idx) => idx);
    for (const v of arr) {
      await setTimeout(1);
      console.log(v + 10);
    }
  }

  Promise.all([f(), f2()]).then(() => console.log("done"));
}
