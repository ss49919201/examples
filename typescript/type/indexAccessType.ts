// インデックスアクセス型は、配列の要素の型を参照するために使われる
// インデックスアクセス型は、オブジェクトのプロパティの型を参照するために使われる
type Person = {
  name: string;
  age: number;
};

// 型に対してブラケットを使ってアクセスすることで、その型を取得できる
type Name = Person["name"]; // string
type Age = Person["age"]; // number
type NameOrAge = Person["name" | "age"]; // string | number

type Arr = Array<Person>;
type ArrElement = Arr[number]; // Person

// keyof型演算子を使うとオブジェクトの全プロパティの型をユニオンで取得できる
type PersonProps = Person[keyof Person]; // string | number

// typeof型演算子を使うと配列の変数から型を取得できる
const arr = ["a", undefined, null] as const;
type AorUndefinedOrNull = (typeof arr)[number];

// タプル型の要素の型を取得する際はブラケット記法にインデックスの整数を指定する
type Tuple = [string, number, boolean];
type TupleElement = Tuple[0]; // string
// type TupleElement = Tuple[3]; // Tuple type 'Tuple' of length '3' has no element at index '3'.
// type TupleElement = Tuple[-1]; // A tuple type cannot be indexed with a negative value.

// typeof型演算子を使うとタプル型の値から型をユニオンで取得できる
const tuple = ["a", 1, true] as const;
type TupleType = (typeof tuple)[number]; // "a" | 1 | true
type TupleType2 = typeof tuple; // readonly ["a", 1, true]
