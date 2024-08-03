import { serve } from "@hono/node-server";
import { Hono } from "hono";

class Customer {
  constructor(public name: string, public age: number) {}

  incrementAge(n: number = 1) {
    this.age += n;
  }
}

type CustomerObject = {
  name: string;
  age: number;
};

const findCustomers = (): CustomerObject[] => {
  const customers = [new Customer("John", 30), new Customer("Jane", 25)];
  return customers.map(classToObjct);
};

const classToObjct = (c: Customer): CustomerObject => {
  return { name: c.name, age: c.age };
};

const app = new Hono();

app.get("/customers", (c) => {
  const result = findCustomers();

  console.log({
    path: "/customers",
    result,
  });

  return c.json(result);
});

serve({
  fetch: app.fetch,
  port: 3000,
});
