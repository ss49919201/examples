const {
  resourceFromAttributes,
  processDetector,
  hostDetector,
} = require("@opentelemetry/resources");
const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-proto");
const {
  AwsInstrumentation,
} = require("@opentelemetry/instrumentation-aws-sdk");
const { ConsoleSpanExporter } = require("@opentelemetry/sdk-trace-node");
const { NodeSDK } = require("@opentelemetry/sdk-node");
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");
const { ATTR_SERVICE_NAME } = require("@opentelemetry/semantic-conventions");

// const exporter = new OTLPTraceExporter({
//   maxQueueSize: 1000,
//   url: "https://otlp-vaxila.mackerelio.com/v1/traces",
//   headers: {
//     Accept: "*/*",
//     "Mackerel-Api-Key": process.env.MACKEREL_API_KEY,
//   },
// });

// デバッグ時にはConsoleSpanExporterが便利
const exporter = new ConsoleSpanExporter();

const sdk = new NodeSDK({
  traceExporter: exporter,
  instrumentations: [
    new AwsInstrumentation(),
    getNodeAutoInstrumentations({
      "@opentelemetry/instrumentation-fs": {
        enabled: false,
      },
    }),
  ],
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: "acme_service",
  }),
  resourceDetectors: [processDetector, hostDetector],
});

sdk.start();
