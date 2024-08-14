import z from "zod";

const User = z.object({
  id: z.number().positive().min(1).int(),
  name: z.string().min(1),
  age: z.number().positive().int(),
});

export type User = z.infer<typeof User>;

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
