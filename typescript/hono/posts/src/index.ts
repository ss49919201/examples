import { serve } from "@hono/node-server";
import { Hono } from "hono";

const port = process.env.PORT
  ? !Number.isNaN(parseInt(process.env.PORT))
    ? parseInt(process.env.PORT)
    : 3000
  : 3000;

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/health", (c) => {
  return c.json({
    message: "ok",
    date: new Date().toISOString(),
    name: c.req.query("name"),
  });
});

app.get("/posts/:id", (c) => {
  return c.json({
    id: c.req.param("id"),
    title: "title",
    body: "body",
  });
});

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
