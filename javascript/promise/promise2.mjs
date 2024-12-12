// // ref. https://jsprimer.net/basic/async/#async-function

// // Async Function は Promise を返す関数を定義する構文である。
// // return された値は Promise でラップされる。

// // 値を return した場合、fulfilled の Promise が返る。
// async function p_1() {
//   return 42;
// }
// p_1().then(console.log);

// // Promise を return した場合、そのまま Promise が返る。
// async function p_2(s) {
//   if (s === "ok") {
//     return Promise.resolve("ok");
//   } else {
//     return Promise.reject("ng");
//   }
// }
// p_2("ok").then(console.log);
// p_2("ng").catch(console.log);

// // 例外が発生すると、rejected の Promise が返る。
// async function p_3() {
//   throw new Error("error");
// }
// p_3().catch((err) => console.log(err.message));

// // Async 関数内では await 式が使える。
// // await 式は右辺の、Promise が settled になるまで待ち、状態変化後に次の行の処理を実行する。
// // 右辺の Promise が fulfilled になった場合は、resolve された値をアンラップして返す。
// async function p_4() {
//   return 42;
// }
// async function do_p_4() {
//   const p = await p_4();
//   console.log(p);
// }
// do_p_4();

// // 上記は次のコードと同じ意味になる。
// // await 式を使えばコールバックの登録をせずに非同期処理を制御できる。
// async function do_p_4_2() {
//   p_4().then(console.log);
// }
// do_p_4_2();

// // 右辺の Promise が rejected になった場合、await 式は例外を発生する。
// // Async 関数内で例外が発生した場合は、rejected の Promise が返るので、当該 await 式以降の処理は実行されずに Promise が返る。
// // try catch ブロックで包むことでハンドリングは可能。
// async function p_5() {
//   const p = await Promise.reject(new Error("ng"));
// }
// p_5().catch((err) => console.log(err.message));
// async function p_6() {
//   let p = "ok";
//   try {
//     p = await Promise.reject(new Error("ng"));
//   } catch {
//     console.log("error occurred");
//   }
//   return p;
// }
// p_6().then(console.log);

// // await 式は Async 関数外での使用はできない。これは await 式の間違った使い方を防ぐためである。
// // await 式で非同期処理を待っても、Async 関数外では処理が進む。
// // Async 関数外の処理も停止してしまうと、メインスレッドの処理が止まってしまうことにあたる。(ブラウザだと描画処理が止まる)
// async function p_7() {
//   return await new Promise((resolve) => {
//     setTimeout(() => resolve(42), 1000);
//   });
// }
// p_7().then(console.log);
// console.log("logged"); // 先に出力される

// // コールバックとして Async 関数を渡すと予期しない挙動になる。
// // forEach のコールバックに Async 関数を渡すと、Async 関数自体の終了は待たずに forEach の次の行に進む。
// [42, 43].forEach(async (v) => {
//   const vDash = await Promise.resolve(v);
//   console.log(vDash);
// });
// console.log("end forEach");

// 実行コンテキストを Module で実行した JavaScript では、最も外側のスコープで await 式が使える。
await new Promise((resolve) => {
  setTimeout(resolve, 1000);
});
console.log("end");
