import { AwsInstrumentation } from "@opentelemetry/instrumentation-aws-sdk";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { AWSXRayPropagator } from "@opentelemetry/propagator-aws-xray";
import {
  hostDetector,
  processDetector,
  resourceFromAttributes,
} from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-node";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

const debugExporter = new ConsoleSpanExporter();

const sdk = new NodeSDK({
  instrumentations: [
    new AwsInstrumentation({
      // suppressInternalInstrumentation: true,
    }),
    new HttpInstrumentation(),
  ],
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: "acme_service",
  }),
  resourceDetectors: [processDetector, hostDetector],
  textMapPropagator: new AWSXRayPropagator(),
});

sdk.start();
