// オブジェクト型からプロパティ名を型として抽出する
type Name = keyof { name: string }; // "name"

// 変数は渡せない
// const taro = {
//   name: "Taro",
//   age: 20,
// };
// type S = keyof taro; // 'taro' refers to a value, but is being used as a type here. Did you mean 'typeof taro'?

// オブジェクトリテラルを渡す
// オブジェクト型として扱われる(リテラル値型のプロパティを持ったオブジェクト型として扱われる)
type UserKey = keyof {
  name: "Taro";
  age: 20;
}; // "name" | "age"
