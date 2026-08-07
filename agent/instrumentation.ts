import { LangfuseSpanProcessor, isDefaultExportSpan } from "@langfuse/otel";
import { registerOTel } from "@vercel/otel";
import { defineInstrumentation } from "eve/instrumentation";

export default defineInstrumentation({
  setup: ({ agentName }) =>
    registerOTel({
      serviceName: agentName,
      spanProcessors: [
        new LangfuseSpanProcessor({
          shouldExportSpan: ({ otelSpan }) =>
            isDefaultExportSpan(otelSpan) ||
            ["gen_ai", "eve"].includes(otelSpan.instrumentationScope.name),
        }),
      ],
    }),
  // User submissions, model output, and tool payloads must not leave the runtime.
  recordInputs: false,
  recordOutputs: false,
});
