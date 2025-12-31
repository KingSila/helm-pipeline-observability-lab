// src/server.js
require("./otel"); // must be first

const express = require("express");

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
const version = process.env.APP_VERSION || "dev";

app.get("/", (req, res) => {
  console.log("GET / hit", { version });
  res.json({ message: "helm-pipeline-observability-lab", version });
});

app.get("/healthz", (req, res) => {
  res.status(200).send("ok");
});

// Intentionally fails (to prove exceptions show up in App Insights)
app.get("/fail", (req, res) => {
  throw new Error("Intentional failure for observability testing");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`, { version });
});
