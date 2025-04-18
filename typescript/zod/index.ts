import z from "zod";

const User = z.object({
  id: z.number().positive().min(1).int(),
  name: z.string().min(1),
  age: z.number().positive().int(),
  blob: z.custom<Blob>(),
});

const parse = <T>(schema: z.ZodType<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    throw new Error("Invalid data");
  }
};

const parsed = parse(User, {
  id: 1,
  name: "John",
  age: 30,
  extra: "extra",
});
console.log(parsed); // { id: 1, name: 'John', age: 30 }

const parsed2 = parse(User, {
  id: 0,
  name: "John",
  age: 30,
  extra: "extra",
}); // Error: Invalid data

const t1 = z.object({
  type: z.literal("t1"),
  id: z.string(),
  nestKey: z.string(),
});

const t2 = z.object({
  type: z.literal("t2"),
  id: z.string(),
  nestKey2: z.string(),
});

const oneOrTwo = z.union([t1, t2]);

type Obj = {
  key1: z.infer<typeof t1>[];
  key2: z.infer<typeof t2>[];
};

function jsonArrayToObj(array: string[]): Obj {
  const obj: Obj = {
    key1: [],
    key2: [],
  };

  for (const elem of array) {
    const body = {
      ...JSON.parse(elem),
      id: "1",
    };

    const parsed = oneOrTwo.parse(body);
    if (parsed.type === "t1") {
      obj.key1.push(parsed);
    } else if (parsed.type === "t2") {
      obj.key2.push(parsed);
    } else {
      throw new Error("Invalid type");
    }
  }

  return obj;
}

function jsonArrayToTupple<T extends string[]>(
  array: T
): { [K in keyof T]: z.infer<typeof oneOrTwo>[] } {
  const result: { [K in keyof T]: z.infer<typeof oneOrTwo>[] } = {} as any;

  for (let i = 0; i < array.length; i++) {
    result[i] = [];
  }

  for (const elem of array) {
    const body = {
      ...JSON.parse(elem),
      id: "1",
    };

    const parsed = oneOrTwo.parse(body);
    if (parsed.type === "t1") {
      result[0].push(parsed);
    } else if (parsed.type === "t2") {
      result[1].push(parsed);
    } else {
      throw new Error("Invalid type");
    }
  }

  return result;
}

// オブジェクトを使用するアプローチ
function jsonArrayToObject(array: string[]): {
  [K in string]: z.infer<typeof oneOrTwo>[];
} {
  const result: { [K in string]: z.infer<typeof oneOrTwo>[] } = {};

  for (const key of array) {
    result[key] = [];
  }

  for (const elem of array) {
    const body = {
      ...JSON.parse(elem),
      id: "1",
    };

    const parsed = oneOrTwo.parse(body);
    if (parsed.type === "t1") {
      result["t1"].push(parsed);
    } else if (parsed.type === "t2") {
      result["t2"].push(parsed);
    } else {
      throw new Error("Invalid type");
    }
  }

  return result;
}

// 固定長のタプル型を使用するアプローチ
function jsonArrayToFixedTuple(
  array: string[]
): [z.infer<typeof t1>[], z.infer<typeof t2>[]] {
  const t1Array: z.infer<typeof t1>[] = [];
  const t2Array: z.infer<typeof t2>[] = [];

  for (const elem of array) {
    const body = {
      ...JSON.parse(elem),
      id: "1",
    };

    const parsed = oneOrTwo.parse(body);
    if (parsed.type === "t1") {
      t1Array.push(parsed);
    } else if (parsed.type === "t2") {
      t2Array.push(parsed);
    } else {
      throw new Error("Invalid type");
    }
  }

  return [t1Array, t2Array];
}
