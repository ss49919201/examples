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

  fn3: function (arr: string[]) {
    // return arr.filter(function (elm) {
    //   return elm === this.s; // コールバックが呼ばれるときはベースオブジェクトがないので this は undefined
    // });

    // const tmpThis = this;
    // return arr.filter(function (elm) {
    //   return elm === tmpThis.s;
    // });

    return arr.filter(function (elm) {
      return elm === this.s;
    }, this);
  },
};

object.fn();
object.fn2();

// 関数宣言
function fn3() {
  console.log(this); // undefined
}

// 関数式
const fn4 = function () {
  console.log(this); // undefined
};

fn3();
fn4();

console.log(object.fn3(["string", "string1"]));
