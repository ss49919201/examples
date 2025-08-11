import { serve } from "@hono/node-server";
import { html } from "hono/html";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";

const app = new Hono();
const getCounter = () => {
  let i = 0;
  return {
    incr: () => {
      return ++i;
    },
  };
};

app.get("/stream", (c) => {
  return streamSSE(c, async (stream) => {
    const counter = getCounter();
    while (true) {
      const message = `It is ${new Date().toISOString()}`;
      await stream.writeSSE({
        data: message,
        event: "time-update",
        id: counter.incr().toString(),
      });
      await stream.sleep(1000);
    }
  });
});

console.log("Listenning...✈️");

serve({
  fetch: app.fetch,
  port: 3000,
});
