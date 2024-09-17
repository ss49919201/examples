type Type<T> = {
  propA: T;
  propB: boolean;
};

// T にユニオン型を指定すると、それぞれの型に対して型変数が適用される
// type UnionType = {
//     propA: string | number;
//     propB: boolean;
// }
type UnionType = Type<string | number>;
