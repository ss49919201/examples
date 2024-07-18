// 型の条件分岐
// TがUに代入できればX、そうでなければY
// T extends U ? X : Y
type IsNumber<T> = T extends number ? true : false;
type A = IsNumber<3>; // true
type B = IsNumber<"3">; // false
