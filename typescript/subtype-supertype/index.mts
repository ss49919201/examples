{
  type Super = {
    id: string;
  };

  type Sub = Super & { age: number };

  // 関数の戻り値の型は共変
  // 共変=>その型、もしくはサブタイプを代入できる
  const f: () => Super = () => ({ id: "id", age: 1 });

  // 関数の引数の型は反変
  // 反変=>その型、もしくはスーパタイプを代入できる
  const f2: (s: Sub) => void = (s: Super) => {};
  // 型エラー
  // const f3: (s: Super) => void = (s: Sub) => {};
}
