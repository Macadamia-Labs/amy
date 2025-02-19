import { ChatRequestOptions } from "ai";
import { Message } from "ai";
import { App } from "@/lib/types/apps";
import { Messages } from "@/components/messages/messages";

export interface ChatList {
  messages: Message[];
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[])
  ) => void;
  append: (
    message: Message,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  isLoading: boolean;
  app?: App;
  chatId: string;
  addToolResult: ({ toolCallId, result }: { toolCallId: string; result: any }) => void;
}


export function ChatList({
  messages,
  setMessages,
  append,
  isLoading,
  chatId,
  addToolResult,
}: ChatList) {
  if (!messages.length) {
    return null;

  }

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <Messages
        chatId={chatId}
        isLoading={isLoading}
        messages={messages}
        setMessages={setMessages}
        append={append}
        addToolResult={addToolResult}
        isReadonly={false}
      />
    </div>

  );
}
