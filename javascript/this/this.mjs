// トップレベルの this は実行コンテキストによって参照先が異なる。
// Node.js の場合、Script だと global オブジェクト、Module だと undefined になる。
// 実行環境のグローバルオブジェクトは globalThis で参照できる。
console.log(this);
console.log(globalThis);

// // 関数内での this は、アロー関数とそれ以外で異なる。

// アロー関数以外の this は実行時に値が決定する。暗黙の引数のようなもの。
// 基本的な参照先はベースオブジェクトとなる。メソッド呼び出しの場合はメソッドが所属するオブジェクトがベースオブジェクトとなる。
function fn() {
  console.log(this);
}
fn();
const obj = {
  prop: "prop",
  fn() {
    console.log("obj.prop =", this.prop);
  },
  fn_2(v) {
    console.log("obj.prop =", this.prop, "v =", v);
  },
};
obj.fn();

// メソッドとして定義した関数が単なる関数として呼ばれた場合、ベースオブジェクトは所属していたオブジェクトとは異なる。
// const fn = obj.fn;
// fn();

// call、apply メソッドを実行することで、this を明示的に指定できる。
const fn_2 = obj.fn_2;
fn_2.call(obj, "call");
fn_2.apply(obj, ["apply"]);

// bind メソッドを実行することで、this を束縛した新しい関数を作れる。
const fn_2_binded = fn_2.bind(obj);
fn_2_binded("bind");
