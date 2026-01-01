// src/otel.js
const { useAzureMonitor } = require("@azure/monitor-opentelemetry");

const cs = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;

if (!cs) {
  // Local/dev-friendly behavior: run without telemetry instead of crashing.
  console.warn(
    "[otel] APPLICATIONINSIGHTS_CONNECTION_STRING not set. Azure Monitor telemetry is disabled."
  );
} else {
  // IMPORTANT: must run BEFORE importing other libs (express, http, etc.)
  useAzureMonitor({
    azureMonitorExporterOptions: {
      connectionString: cs,
    },
    enableLiveMetrics: true,
    enableStandardMetrics: true,

    // Consider lowering in production to reduce volume/cost:
    samplingRatio: process.env.OTEL_SAMPLING_RATIO
      ? Number(process.env.OTEL_SAMPLING_RATIO)
      : 0.1,
  });

  console.log("[otel] Azure Monitor OpenTelemetry enabled.");
}
