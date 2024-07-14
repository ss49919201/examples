// オブジェクトのフィールド名を指定しない場合に使用できるのがインデックス型
// kは型変数名
// インデックス型のフィールド名の型はstring、number、symbolのみ
type IndexSignature = {
  [k: string]: string;
};

// インデックス型のオブジェクトは未定義のフィールドにアクセス、代入ができる
const indexSignature: IndexSignature = {};

indexSignature.key = "value";
indexSignature["key2"] = "value2";

console.log(indexSignature.key, indexSignature["key2"], indexSignature.key3);
// Output: value value2 undefined

// Record型でインデックス型を定義できる
type IndexSignatureByRecord = Record<string, string>;

const indexSignatureByRecord: IndexSignatureByRecord = indexSignature;
