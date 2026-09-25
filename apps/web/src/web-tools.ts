import { useEffect } from "react";
import { useApp } from "./state";
interface ToolContext {
  registerTool(
    tool: {
      name: string;
      description: string;
      inputSchema: object;
      annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
      execute: (input: unknown) => unknown;
    },
    options: { signal: AbortSignal },
  ): void | Promise<void>;
}
export function useWebTools() {
  useEffect(() => {
    const context = (document as Document & { modelContext?: ToolContext })
      .modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const common = {
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
    };
    Promise.resolve(
      context.registerTool(
        {
          ...common,
          name: "wanees_read_visit_progress",
          description:
            "Read public sample visit progress only. No caregiver or child records are exposed.",
          execute: () => ({
            step: useApp.getState().step + 1,
            total: 6,
            pathway: "routine-xray",
            demonstration: true,
          }),
        },
        { signal: lifecycle.signal },
      ),
    ).catch(() => {});
    Promise.resolve(
      context.registerTool(
        {
          name: "wanees_set_visit_step",
          description:
            "Set the public sample X-ray story step. This updates visit progress but does not save private records or change pages.",
          inputSchema: {
            type: "object",
            properties: { step: { type: "integer", minimum: 1, maximum: 6 } },
            required: ["step"],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false, untrustedContentHint: false },
          execute: (input) => {
            const value = input as { step?: unknown };
            if (
              !value ||
              Object.keys(value).length !== 1 ||
              typeof value.step !== "number" ||
              !Number.isInteger(value.step) ||
              value.step < 1 ||
              value.step > 6
            )
              throw new Error("Step must be an integer from 1 to 6");
            useApp.getState().set({ step: value.step - 1 });
            return { step: value.step, total: 6 };
          },
        },
        { signal: lifecycle.signal },
      ),
    ).catch(() => {});
    return () => lifecycle.abort();
  }, []);
}
