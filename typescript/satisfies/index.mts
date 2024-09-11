// 式が型にマッチするか検査
1 satisfies 1 | 2;
// 3 satisfies 1 | 2; // Type '3' does not satisfy the expected type '1 | 2'.

// 型推論を保持できる
type Ks = "k1" | "k2";
type T = {
  [K in Ks]: unknown;
};
const v: T = { k1: 1, k2: 2 };
v.k1; // unknown
const v2 = { k1: 1, k2: 2 } satisfies T;
v2.k1; // number
