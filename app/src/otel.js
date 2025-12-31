// src/otel.js
const { useAzureMonitor } = require("@azure/monitor-opentelemetry");

const cs = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;

if (!cs) {
  // Local/dev-friendly behavior: run without telemetry instead of crashing.
  console.warn(
    "[otel] APPLICATIONINSIGHTS_CONNECTION_STRING not set. Azure Monitor telemetry is disabled."
  );
} else {
  // IMPORTANT: this must run BEFORE importing other libs (express, http, etc.)
  useAzureMonitor({
    azureMonitorExporterOptions: {
      connectionString: cs,
    },
    enableLiveMetrics: true,
    enableStandardMetrics: true,
    samplingRatio: 1,
  });

  console.log("[otel] Azure Monitor OpenTelemetry enabled.");
}
