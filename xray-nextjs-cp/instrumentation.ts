import { AwsInstrumentation } from "@opentelemetry/instrumentation-aws-sdk";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { UndiciInstrumentation } from "@opentelemetry/instrumentation-undici";
import { AWSXRayPropagator } from "@opentelemetry/propagator-aws-xray";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { OTLPHttpJsonTraceExporter, registerOTel } from "@vercel/otel";

const _traceExporter = new OTLPHttpJsonTraceExporter();
const _spanProssesor = new BatchSpanProcessor(_traceExporter);

export function register() {
  registerOTel({
    serviceName: "xray-nextjs-cp",
    spanProcessors: [_spanProssesor],
    traceExporter: _traceExporter,
    propagators: [new AWSXRayPropagator()],
    instrumentations: [
      new UndiciInstrumentation(),
      new HttpInstrumentation(),
      new AwsInstrumentation(),
    ],
  });
}
