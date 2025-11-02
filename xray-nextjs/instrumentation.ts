import { AwsInstrumentation } from "@opentelemetry/instrumentation-aws-sdk";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { registerOTel } from "@vercel/otel";

export function register() {
  registerOTel({
    serviceName: "xray-nextjs",
    instrumentations: [
      new HttpInstrumentation(),
      new AwsInstrumentation({
        suppressInternalInstrumentation: true,
      }),
    ],
  });
}
