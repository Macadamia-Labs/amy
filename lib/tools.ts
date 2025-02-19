import { Message } from "ai";

export const tools = {
  generatePlan: {
    loading: "Generating plan...",
    isBackgroundTool: false,
  },
  setPlanCurrentStep: {
    loading: "Setting plan current step...",
    isBackgroundTool: true,
  },
  setPlanStepStatus: {
    loading: "Setting plan step status...",
    isBackgroundTool: true,
  },
  generateScript: {
    loading: "Thinking very deeply...",
    isBackgroundTool: false,
  },

} as const;

export function getToolLoadingMessage(toolName: string): string {
  return (
    (tools[toolName as keyof typeof tools] as { loading: string })?.loading ||
    toolName
  );
}

export function isBackgroundTool(toolName: string): boolean {
  return (
    (tools[toolName as keyof typeof tools] as { isBackgroundTool: boolean })
      ?.isBackgroundTool ?? false
  );
}

export function isMessageTool(message: Message): boolean {
  return (
    message.toolInvocations !== undefined && message.toolInvocations.length > 0
  );
}
