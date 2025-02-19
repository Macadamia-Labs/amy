import * as React from "react";
import { type UseChatHelpers } from "ai/react";

import { Button } from "@/components/ui/button";
import { PromptForm } from "@/components/chat/prompt-form";
import { StopCircleIcon } from "lucide-react";

export interface ChatPanelProps
  extends Pick<
    UseChatHelpers,
    | "append"
    | "isLoading"
    | "reload"
    | "messages"
    | "stop"
    | "input"
    | "setInput"
  > {
  id?: string;
  title?: string;
}

export function ChatPanel({
  id,
  isLoading,
  stop,
  append,
  input,
  setInput,
}: ChatPanelProps) {
  return (
    <div className="w-full animate-in duration-300 ease-in-out relative">
      <div className="flex items-center justify-center h-12 gap-2 bg-transparent">
        {isLoading && (
          <Button
            variant="outline"
            onClick={() => stop()}
            className="bg-background"
          >
            <StopCircleIcon className="mr-2 h-4 w-4" />
            {/* {m.stopGenerating()} */}
            Stop generating
          </Button>
        )}
      </div>
      {/* </div> */}
      <div className="border-none bg-transparent">
        <PromptForm
          onSubmit={async (value) => {
            await append({
              id,
              content: value,
              role: "user",
            });
          }}
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          chatId={id}
        />
      </div>
    </div>
  );
}
