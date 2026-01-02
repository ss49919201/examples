import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-base";
import { registerOTel } from "@vercel/otel";

export function register() {
  registerOTel({
    serviceName: "next-app",
    ...(process.env.OTEL_TRACE_MODE === "debug"
      ? { traceExporter: new ConsoleSpanExporter() }
      : {}),
  });
}
