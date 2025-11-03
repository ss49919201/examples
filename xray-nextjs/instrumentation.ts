import { defaultTextMapGetter } from "@opentelemetry/api";
import { AwsInstrumentation } from "@opentelemetry/instrumentation-aws-sdk";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { AWSXRayPropagator } from "@opentelemetry/propagator-aws-xray";
import { OTLPHttpJsonTraceExporter, registerOTel } from "@vercel/otel";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { AWSXRayIdGenerator } from "@opentelemetry/id-generator-aws-xray";
import { UndiciInstrumentation } from "@opentelemetry/instrumentation-undici";

const _traceExporter = new OTLPHttpJsonTraceExporter();
const _spanProssesor = new BatchSpanProcessor(_traceExporter);

export function register() {
  registerOTel({
    serviceName: "xray-nextjs",
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
