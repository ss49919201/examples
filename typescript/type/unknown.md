unknown 型はどんな型の値も代入可能な型です。

型アサートもしくは型ガードによる絞り込みを行わない限り、他の型の値として扱うことはできません。
プロパティアクセスやメソッド呼び出しもできません。

```ts
let value: unknown;
value = 1;

let num: number;
num = value; // ng
num = value as number; // ok

let value2: unknown;
value2 = 2;
value2.toFixed(); // ng

if (typeof value2 === "number") {
  num = value2; // ok
}
```
