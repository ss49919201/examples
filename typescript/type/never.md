never 型は値を持たないことを表現する型です。

never 型の値はあらゆる値に代入可能です。

```typescript
const s: string = 1 as never;
const b: boolean = 1 as never;
```

never 型に代入できるのは、never 型のみです。

```typescript
let nev: never;
nev = "foo"; // ng
nev = 1; // ng
nev = "any" as any; // ng
nev = undefined; // ng
nev = "never" as never;
```

生成不可能な値の型は never 型に推論されます。

```typescript
type Never = string & boolean;
```

一見用途が無さそうですが網羅性のチェックに活用できます。
型ガードで偽になる分岐に入った場合に、値は never 型になります。

```typescript
function assertNever(v: never) {
  throw new Error(`unexpected value ${v}`);
}

function check(v: "a" | "b" | "c") {
  switch (v) {
    case "a":
      console.log("A");
      break;
    case "b":
      console.log("B");
      break;
    case "c":
      console.log("B");
      break;
    default:
      assertNever(v);
  }
}
```

```typescript
function check(v: "a" | "b" | "c") {
  switch (v) {
    case "a":
      console.log("A");
      break;
    case "b":
      console.log("B");
      break;
    case "c":
      console.log("B");
      break;
    default:
      v satisfies never;
  }
}
```

常に例外が発生する関数、無限ループを実行する関数の戻り値として定義可能です。
なお、下記の関数は return を省略しているので、明示的に never を定義しない場合は void に推論されます。

```typescript
function error(message: string): never {
  throw new Error(message);
}

function loop(): never {
  while (true) {}
}
```
