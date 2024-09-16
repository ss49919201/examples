const f1 = (n: number, s = "hello") => {};

const f2 = (n: number, ...ns: number[]) => {};

const object = {
  s: "string",

  // this は定義時に決まる
  fn: () => {
    console.log(this); // {}
    console.log(this.s); // undefined
  },

  fn2() {
    console.log(this); // { s: 'string', fn: [Function: fn], fn2: [Function: fn2] }
    console.log(this.s); // string
  },
};

object.fn();
object.fn2();
