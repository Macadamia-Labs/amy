"use client";

import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import { OswaldTabs } from "@/components/oswald-tabs";
import { Chat } from "@/components/chat/chat";
import { App } from "@/lib/types/apps";
import { Message, CreateMessage } from "ai/react";
import { Dispatch, SetStateAction } from "react";
import { ChatRequestOptions } from "ai";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MaximizeIcon, MinimizeIcon } from "lucide-react";
import { useOswald } from "@/lib/providers/oswald-provider";

interface ChatLayoutProps {
  id: string;
  messages: Message[];
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  isLoading: boolean;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  reload?: any;
  stop?: any;
}

export function ChatLayout({
  id,
  messages,
  append,
  isLoading,
  input,
  setInput,
  reload,
  stop,
}: ChatLayoutProps) {
  const { showTabs, setShowTabs, hasContent } = useOswald();

  return (
    <ResizablePanelGroup direction="horizontal" className="p-2 pt-0 gap-2">
      <ResizablePanel
        className="border rounded-lg min-h-0 bg-sidebar relative"
        defaultSize={50}
      >
        {/* {hasContent && ( */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-10"
          onClick={() => setShowTabs(!showTabs)}
        >
          {showTabs ? (
            <MaximizeIcon className="h-4 w-4" />
          ) : (
            <MinimizeIcon className="h-4 w-4" />
          )}
        </Button>
        {/* )} */}

        <Chat
          id={id}
          app={App.Oswald}
          header="Oswald"
          messages={messages}
          append={append}
          isLoading={isLoading}
          input={input}
          setInput={setInput}
          reload={reload}
          stop={stop}
        />
      </ResizablePanel>
      {/* {showTabs && hasContent && ( */}
      {showTabs && (
        <ResizablePanel
          className={cn(
            "border h-full rounded-lg bg-sidebar transition-all duration-300 p-4"
          )}
          defaultSize={50}
        >
          <OswaldTabs chatId={id} />
        </ResizablePanel>
      )}
    </ResizablePanelGroup>
  );
}
