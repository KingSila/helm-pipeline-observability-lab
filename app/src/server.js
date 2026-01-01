// src/server.js
require("./otel"); // MUST be first — before express/http

const express = require("express");

const app = express();
app.use(express.json());

// App Service injects PORT; fallback keeps local dev happy
const port = process.env.PORT || 3000;
const version = process.env.APP_VERSION || "dev";

// Root
app.get("/", (req, res) => {
  console.log("GET / hit", { version });
  res.json({
    service: "helm-pipeline-observability-lab",
    version,
  });
});

// Health check (App Service friendly)
app.get("/healthz", (req, res) => {
  res.status(200).send("ok");
});

// Intentionally fails (to prove exceptions show up in App Insights)
app.get("/fail", (req, res, next) => {
  next(new Error("Intentional failure for observability testing"));
});

// Express error handler — critical for App Service + telemetry
app.use((err, req, res, next) => {
  console.error("Unhandled error", err);

  res.status(500).json({
    error: "internal_error",
    message: err.message,
  });
});

// Bind explicitly (App Service is fine without 0.0.0.0, but it's safer)
app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on port ${port}`, { version });
});
