import { AwsInstrumentation } from "@opentelemetry/instrumentation-aws-sdk";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { AWSXRayPropagator } from "@opentelemetry/propagator-aws-xray";
import { registerOTel } from "@vercel/otel";

export function register() {
  registerOTel({
    serviceName: "xray-nextjs",
    propagators: [new AWSXRayPropagator()],
    instrumentations: [
      new HttpInstrumentation(),
      new AwsInstrumentation({
        suppressInternalInstrumentation: true,
      }),
    ],
  });
}
