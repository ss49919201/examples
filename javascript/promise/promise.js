// ref. https://jsprimer.net/basic/async/

// JavaScript には非同期処理を扱うためのオブジェクトとして Promise というビルトインオブジェクトが存在する。

// コードの評価の仕方には同期処理と非同期処理の二種類がある。同期処理はコードを順番に一つずつ処理する。
// ブラウザの JavaScript はメインスレッドで動作するため、長い同期処理がありメインスレッドが JavaScript に占有されると描画も止まってしまう。

// 非同期処理はコードを順番に処理するが、処理が終わるのを待たずに次の処理を実行する。
// JavaScript では非同期処理もメインスレッドで実行される。
const block10sec = () => {
  const start = new Date().valueOf();
  let delay = 0;
  while (delay <= 10000) {
    delay = new Date().valueOf() - start.valueOf();
  }
};
setTimeout(() => console.log("timeout"), 1000);
block10sec();
console.log("Done");

const { rejects } = require("node:assert");
// JavaScript では非同期処理は、処理を一定の単位で切り替えながら実行するので、重い同期処理があると非同期処理にも影響する
// ブラウザでは Web Worker API、Node.js では Worker Threds を使うことで、メインスレッドとは異なるスレッドで並列処理ができる。
const { Worker } = require("node:worker_threads");
new Worker("./worker.js");

// 非同期処理で発生した例外は、通常では非同期処理の外で検知できないので何かしらの方法で外に伝える必要がある。
// 非同期処理の状態や結果を管理する方法として、Promise、Async Function の二通りの方法がある。(=Promise、Async Function は非同期処理の状態や結果を同期処理で扱うための方法)

// Promise は非同期処理の結果を表現するオブジェクトです。
// オブジェクトには、処理が成功/失敗した場合に実行するコールバック関数を登録できます。
// Promise はコンストラクタを呼び出して作成する。
// コンストラクタ引数には関数を渡す。この関数を executor と呼ぶ。
// executor は、resolve、reject という引数を受け取る。executor の中では非同期で実行したい処理を呼び出し、成功すれば resolve、失敗すれば reject を呼び出すよう実装する。
// 作成した Promise インスタンスの then メソッドには resolve が呼び出された場合の関数を登録する。catch メソッドには reject が呼び出された場合の関数を登録する。
const asyncFn = new Promise((resolve, reject) => {
  // 非同期処理
  // 成功
  resolve(42);
  // 失敗
  reject(new Error("reject"));
});
const promise = asyncFn();
promise.then(
  (v) => console.log("success " + v),
  (err) => console.log("failed " + err)
);

// 下記は promise.then(undefined, (err) => console.log("failed " + err)); と同様。
promise.catch((err) => console.log("failed " + err));

// executor で発生した例外は自動的にキャッチされ、resolve が呼び出される。
new Promise((resolve) => {
  throw new Error("error");
  resolve(42);
}).catch((err) => console.log(err));

// Promise インスタンスは初期化時に pending になり、resolve されると fulfilled、reject されると rejected になる。
// fulfilled または、rejected の状態を settled という。一度 settled になると、それ以降は変化しない。
new Promise((resolve) => {
  resolve(42);
  throw new Error("error");
}).catch((err) => console.log(err)); // catch は呼ばれない

// Promise.resolve() で fulfilled 状態の Promise インスタンスを同期的に作成できる。
// 登録したコールバックは非同期で実行される。
// new Promise((resolve) => resolve()) のシンタックスシュガー。
// 同様な形式の Promise.rejected() も存在する。
const resolved = Promise.resolve(42);
resolved.then((v) => console.log(v));
console.log(resolved); // 先に呼ばれる

// Promise インスタンスは then、catch をメソッドチェーンできる。
// then、catch は新たな Promise を返す。
// fulfilled の Promise が返る場合は、then に登録したコールバックが続けて呼び出され、catch は呼ばれない。
// rejected の Promise が返る場合は、最も近い catch に登録したコールバックが続けて呼び出され、then は呼ばれない。
Promise.resolve(42)
  .then((v) => console.log(v)) // then は Promise を返すので続けて、catch を呼べる
  .catch((err) => console.log(err));

// 登録したコールバックで例外が発生すると、rejected の Promise が返る。
Promise.resolve(42)
  .then(() => {
    throw new Error("error");
  })
  .catch((err) => console.log(err.message));

// コールバックで return した値は、次のコールバックの引数になる。
Promise.resolve(42)
  .then((v) => {
    console.log(v);
    return "hello";
  })
  .then((v) => {
    console.log(v);
    throw "";
  })
  .catch(() => {
    return "foo";
  })
  .then((v) => {
    console.log(v);
    return "bar";
  });

// コールバックで Promise インスタンスを return できる。
// Promise を return した場合は、そのインスタンスがコールバックの戻り値となる。
Promise.resolve(42)
  .then(() => Promise.resolve(43))
  .then((v) => {
    console.log(v);
    throw "error";
  })
  .catch((v) => {
    console.log(v);
    return Promise.reject(v + "2");
  })
  .catch((v) => {
    console.log(v);
  });

// finaly メソッドには結果に関わらず最後に呼び出すコールバックを登録できる。
Promise.resolve(42)
  .finally(() => console.log("final"))
  .then(() => console.log("then"))
  .catch(() => console.log("catch"))
  .finally(() => console.log("final"));

Promise.reject(42)
  .finally(() => console.log("final"))
  .then(() => console.log("then"))
  .catch(() => console.log("catch"))
  .finally(() => console.log("final"));

// Promise.all で複数の Promise をまとめることができる。
// 全て成功した場合は結果の配列が返る。引数の配列と結果の配列の順番は同じになる。
Promise.all([
  Promise.resolve(43),
  Promise.resolve(44),
  Promise.resolve(45),
]).then((v) => console.log(v));

// 一つでも失敗した場合は rejectd の Promise が返る。
Promise.all([
  Promise.resolve(43),
  Promise.reject(44),
  Promise.resolve(45),
]).then(
  (v) => console.log(v),
  (v) => console.log(v)
);

// 一つでも失敗した場合は rejectd の Promise が返る。
// pending 状態の Promise があっても、 settled になる前に失敗時のコールバックが呼び出される。
Promise.all([
  new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("resolve 42");
      resolve(42);
    }, 500);
  }),
  new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("reject 43");
      reject(43);
    }, 1000);
  }),
  new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("resolve 44");
      resolve(44);
    }, 2000);
  }),
]).then(
  (v) => console.log(v),
  (v) => console.log(v)
);

// Promise.race は最初に settled になった Promise と同じ状態の新しい Promise を返す。
// 2番目以降の Promise も resolve/reject されるが、戻り値の Promise の状態は変化しない。
Promise.race([
  new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("resolve 42");
      resolve(42);
    }, 500);
  }),
  new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("reject 43");
      reject(43);
    }, 1000);
  }),
  new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("resolve 44");
      resolve(44);
    }, 2000);
  }),
]).then(
  (v) => console.log(v),
  (v) => console.log(v)
);

// Promise.race はタイムアウトの実装に使える。
Promise.race([
  new Promise((resolve) => {
    // 時間のかかる処理
    resolve("done");
  }),
  new Promise((_, reject) => {
    // タイムアウトは5秒
    setTimeout(() => reject("timeout"), 5000);
  }),
])
  .then(console.log)
  .catch(console.error);
