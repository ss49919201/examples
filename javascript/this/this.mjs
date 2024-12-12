// // トップレベルの this は実行コンテキストによって参照先が異なる。
// // Node.js の場合、Script だと global オブジェクト、Module だと undefined になる。
// // 実行環境のグローバルオブジェクトは globalThis で参照できる。
// console.log(this);
// console.log(globalThis);

// // 関数内での this は、アロー関数とそれ以外で異なる。

// // アロー関数以外の this は実行時に値が決定する。暗黙の引数のようなもの。
// // 基本的な参照先はベースオブジェクトとなる。メソッド呼び出しの場合はメソッドが所属するオブジェクトがベースオブジェクトとなる。
// function fn() {
//   console.log(this);
// }
// fn();
// const obj = {
//   prop: "prop",
//   fn() {
//     console.log("obj.prop =", this.prop);
//   },
//   fn_2(v) {
//     console.log("obj.prop =", this.prop, "v =", v);
//   },
// };
// obj.fn();

// // メソッドとして定義した関数が単なる関数として呼ばれた場合、ベースオブジェクトは所属していたオブジェクトとは異なる。
// // const fn = obj.fn;
// // fn();

// // call、apply メソッドを実行することで、this を明示的に指定できる。
// const fn_2 = obj.fn_2;
// fn_2.call(obj, "call");
// fn_2.apply(obj, ["apply"]);

// // bind メソッドを実行することで、this を束縛した新しい関数を作れる。
// const fn_2_binded = fn_2.bind(obj);
// fn_2_binded("bind");

// // コールバック関数の中で this を使うと予期しない挙動になる可能性がある。
// // メソッドの中のコールバック関数で this は undefined になる。
// // コールバック関数はただの関数として呼ばれるので、実行時にベースオブジェクトは存在しないためである。
// const obj2 = {
//   prop: "prop",
//   logArray(arr) {
//     arr.map(function (v) {
//       console.log(this.prop, v);
//     });
//   },
// };
// obj2.logArray([1, 2]);

// // map メソッドは第二引数に this 値を渡せる。
// const obj3 = {
//   prop: "prop",
//   logArray(arr) {
//     arr.map(function (v) {
//       console.log(this.prop, v);
//     }, this);
//   },
// };
// obj3.logArray([1, 2]);

// アロー関数は外側の this を探す。
const obj4 = {
  prop: "prop",
  logArray(arr) {
    arr.map((v) => {
      console.log(this.prop, v); // コールバックには this がないので、logArray の this を参照する。
    });
  },
};
obj4.logArray([3, 4]);
const logArray = obj4.logArray;
logArray.call({ prop: "temp-prop" }, [3, 4]);

// アロー関数の this がどの値を参照するかは定義時に決まる。
// ただし決定した値は、動的に変化する可能性があるので、あくまでどの this を参照するかが決まるだけ。
const obj5 = {
  prop: "prop",
  logArray(arr) {
    const that = this;
    arr.map(function (v) {
      console.log(that.prop, v);
    });
  },
};
obj5.logArray([3, 4]);
const logArray2 = obj5.logArray;
logArray2.call({ prop: "temp-prop" }, [3, 4]);

// アロー関数は this を持てないので、bind、call、apply を実行しても意味がない。(=挙動が変わらない)
