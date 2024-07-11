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

// 複数のプロパティを持つオブジェクト型からプロパティ名を抽出すると、プロパティ名のユニオン型が得られる
type User = {
  name: string;
  age: number;
};
type UserKey2 = keyof User; // "name" | "age"
const u: UserKey2 = "name"; // OK
const u2: UserKey2 = "age"; // OK
// const u3: UserKey2 = "gender"; // NG Type '"gender"' is not assignable to type 'keyof User'.
