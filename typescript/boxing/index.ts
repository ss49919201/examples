// プリミティブ型はメソッドを持っていない。
// JS では内部的にラッパーオブジェクトに変換している。(自動ボックス化)
const str = "文字列";
console.log(str.length); // 3

// undefined, null はラッパーオブジェクトに変換されない。
// const n = null;
// console.log(n.length); // Error
// const u = undefined;
// console.log(u.length); // Error
