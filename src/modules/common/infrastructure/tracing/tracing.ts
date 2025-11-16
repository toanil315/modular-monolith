import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { resourceFromAttributes } from '@opentelemetry/resources';

const collectorEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4317';
const serviceName = process.env.OTEL_SERVICE_NAME || 'evently-api-service';

const exporter = new OTLPTraceExporter({
  url: collectorEndpoint,
});

const spanProcessor = new BatchSpanProcessor(exporter, {
  maxQueueSize: 2048,
  scheduledDelayMillis: 5000,
  maxExportBatchSize: 512,
  exportTimeoutMillis: 30000,
});

const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: serviceName,
});

// Configure the SDK
const sdk = new NodeSDK({
  resource: resource,
  spanProcessor: spanProcessor,

  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-net': { enabled: false },
      '@opentelemetry/instrumentation-dns': { enabled: false },
      '@opentelemetry/instrumentation-express': { enabled: false },
      '@opentelemetry/instrumentation-pg': {
        requireParentSpan: true,
      },
    }),
  ],
});

// Graceful shutdown
process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('OpenTelemetry tracing shut down.'))
    .catch((error) => console.error('Error shutting down OpenTelemetry tracing', error))
    .finally(() => process.exit(0));
});

// Start the SDK (must be done before the NestJS app bootstrap starts)
sdk.start();

console.log('OpenTelemetry SDK initialized and started.');
