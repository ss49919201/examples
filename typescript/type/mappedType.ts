// { [P in K]: T } の形でオブジェクトの型を定義できる
type MappedType = {
  [P in "prop1" | "prop2"]: string;
};

type Obj = {
  prop1: string;
  prop2: number;
};

type ReadOnlyObj = {
  readonly [P in keyof Obj]: Obj[P];
};

// Mapped Type と他のプロパティを組みわせるには、intersection型を使う
type MappedType2 = {
  [P in keyof Obj]: Obj[P];
  //   prop3: boolean; // A mapped type may not declare properties or methods.
} & {
  prop3: boolean;
};

// Record<K, T> は Mapped Type の一種で、{ [P in K]: T } と同じ
type RecordType = Record<"prop1" | "prop2", string>;
const record: Record<keyof Obj, string> = {
  prop1: "string",
  prop2: "string",
  // prop3: "string", // Object literal may only specify known properties, but 'prop3' does not exist in type 'Record<keyof Obj, string>'. Did you mean to write 'prop1'?
} as const;
