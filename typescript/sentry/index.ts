import * as Sentry from "@sentry/node";
import "@sentry/tracing";
import { setTimeout } from "node:timers/promises";

Sentry.init({
  dsn: "https://625d0fa1842963cd0b0040fb2b50a333@o4508834129641472.ingest.de.sentry.io/4508834137833552",
  tracesSampleRate: 1.0,
});

const f1 = async () => {
  return await Sentry.startSpan({ name: "f1" }, async () => {
    await setTimeout(2000);
  });
};

const f2 = async () => {
  return await Sentry.startSpan({ name: "f2" }, async () => {
    await setTimeout(2000);
  });
};

const run = async () => {
  return await Sentry.startSpan({ name: "run" }, async () => {
    await f1();
    await f2();
  });
};

run();
