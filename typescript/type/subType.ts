// 抽象的
type SuperType = {
  name: string;
};
// { name: "name", gender: null } { name: "name", age: 18 } { name: "name", age: 18, gender: null } { name: "name" }

// Property 'gender' is missing in type 'SuperType' but required in type '{ name: string; gender: null; }'.ts(2741)
// 具体的
type SubType = SuperType & {
  age: number;
};
// { name: "name", age: 18 } { name: "name", age: 18, gender: null }
