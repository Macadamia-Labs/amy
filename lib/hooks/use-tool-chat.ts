"use client";

import { ChatRequestOptions, CoreMessage } from "ai";
import { CreateMessage, Message, useChat } from "ai/react";
import { toast } from "sonner";
import { useAuth } from "../providers/auth-provider";
import { App } from "../types/apps";

interface ToolInvocation {
  state: "result";
  toolCallId: string;
  toolName: string;
  args: Record<string, any>;
  result: any;
}

interface UseToolChatProps {
  id?: string;
  app?: App;
  initialMessages?: CoreMessage[];
}

export function useToolChat({ id, app, initialMessages }: UseToolChatProps) {

  const { session } = useAuth();
  const token = session?.access_token;

  const {
    data,
    messages,
    isLoading,
    append: originalAppend,
    handleSubmit: originalHandleSubmit,
    setData,
    ...chatHelpers
  } = useChat({
    api: process.env.NEXT_PUBLIC_CHAT_API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    initialMessages: (initialMessages as Message[]) || [],
    id,
    body: {
      id,
      app,
    },
    onResponse(response) {
      if (response.status === 401) {
        toast.error(response.statusText);
      }
    },
    onFinish(message) {
      console.log("onFinish", message);
    },
    async onToolCall(params: { toolCall: any }) {
      const { toolCall } = params;
      console.log("Tool call received:", toolCall);
    },
    experimental_throttle: 50,
  });

  const toolInvocations = messages
    .filter(
      (msg) =>
        Array.isArray(msg.toolInvocations) && msg.toolInvocations.length > 0
    )
    .flatMap((msg) => (msg.toolInvocations || []) as ToolInvocation[]);

  async function appendWithMetadata(
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) {

    return originalAppend(message, {
      ...chatRequestOptions,
      body: {
        ...chatRequestOptions?.body,
        linkedFiles: linkedFiles,
        activeFile: activeTabFile,
        executionMode,
      },
    });
  }


  async function submitWithMetadata(
    event?: { preventDefault?: () => void },
    chatRequestOptions?: ChatRequestOptions
  ) {
    if (event?.preventDefault) {
      event.preventDefault();
    }

    return originalHandleSubmit(event, {
      ...chatRequestOptions,
      body: {
        ...chatRequestOptions?.body,
        activeFile: activeTabFile,
        linkedFiles: linkedFiles,
        executionMode,
      },
    });
  }

  return {
    data,
    messages,
    isLoading: isLoading || isProcessing,
    toolInvocations,
    ...chatHelpers,
    append: appendWithMetadata,
    handleSubmit: submitWithMetadata,
  };
}
