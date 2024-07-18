// プリミティブなデータ型の一つ
// Symbolキーワードで宣言
// 宣言箇所が異なれば異なる値となる
const s = Symbol();
const s2 = Symbol();
console.log(s == Symbol(), s === Symbol()); // false false
// console.log(s == s2, s === s2); // This comparison appears to be unintentional because the types 'typeof s' and 'typeof s2' have no overlap.

// オブジェクトやクラスのキーにできる
const obj = {
  [s]: "value",
};
console.log(obj[s]); // value
console.log(obj); // { [Symbol()]: "value" }
console.log(JSON.stringify(obj)); // {}
class Class {
  [s] = "value";
}
console.log(new Class()[s]); // value
console.log(new Class()); // Class { [Symbol()]: "value" }
console.log(JSON.stringify(new Class())); // {}

// ユニークなシンボルを生成することもできる
const us: unique symbol = Symbol(); // letで宣言できない
const us2: typeof us = us;
let us3: symbol = us;

// 同じシグネチャでも型が異なれば受け取れないようにできる
const studentSymbol: unique symbol = Symbol("student");
type Student = {
  name: string;
  age: number;
  [studentSymbol]: "student";
};

const teacherSymbol: unique symbol = Symbol("teacher");
type Teacher = {
  name: string;
  age: number;
  [teacherSymbol]: "teacher";
};

const student: Student = {
  name: "Taro",
  age: 20,
  [studentSymbol]: "student",
};

const teacher: Teacher = {
  name: "Yamada",
  age: 30,
  [teacherSymbol]: "teacher",
};

// const student2: Student = teacher;
