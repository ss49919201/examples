function Constructor(v: string) {
  return v;
}

console.log(Constructor("Hello, World!")); // Hello, World!
// console.log(new Constructor("Hello, World!")); // 戻り値がvoidではない関数のためエラー

function Constructor2(v: string) {}

console.log(Constructor2("Hello, World!")); // Hello, World!
console.log(new Constructor2("Hello, World!")); // 戻り値がvoidではない関数のためエラー

const Constructor3 = (v: string) => {};

console.log(Constructor3("Hello, World!")); // Hello, World!
console.log(new Constructor3("Hello, World!")); // アロー関数のため実行時エラー
