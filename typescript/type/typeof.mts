// typeof型演算子
// 変数から型を抽出
const user = { name: "Taro", age: 20 };
type User = typeof user;
/*
    type User = {
        name: string;
        age: number;
    }
*/

// type S = typeof "str"; リテラル値は渡せない
