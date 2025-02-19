import * as React from "react";
import { UseChatHelpers } from "ai/react";
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBlockKeyPropagation } from "@/lib/hooks/use-block-key-propagation";
import { SendIcon } from "@/lib/icons";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
// import { BrainToggle } from "@/components/tools/brain-toggle";
import { FilePicker } from "@/components/files/file-picker";
import { useFiles } from "@/lib/providers/files-provider";
import { Message } from "ai";
// import { LinkedFiles } from "./linked-files";

export interface PromptProps
  extends Pick<UseChatHelpers, "input" | "setInput"> {
  onSubmit: (value: string) => void;
  isLoading: boolean;
  isThinkingMode: boolean;
  onThinkingModeToggle: (enabled: boolean) => void;
  chatId?: string;
  append?: (value: Message) => Promise<string | null | undefined>;
}

export function PromptForm({
  onSubmit,
  input,
  setInput,
  isLoading,
  isThinkingMode,
  onThinkingModeToggle,
  chatId,
  append,
}: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = React.useRef<HTMLTextAreaElement | HTMLInputElement>(null);
  const pathname = usePathname();
  const isAmy = pathname.includes("/amy");
  const { linkFileToChat } = useFiles();

  useBlockKeyPropagation(true, formRef, ["Enter"]);

  const handleFileSelect = async (file: any) => {
    console.log("handleFileSelect called with fileId:", file.id);
    console.log("chatId:", chatId);
    console.log("append:", !!append);
    if (!chatId || !append) {
      console.log("Early return due to missing chatId or append");
      return;
    }
    await linkFileToChat(chatId, file.id);
    await append({
      role: "user",
      content: `<file>
        <fileId>${file.id}</fileId>
        <fileName>${file?.name}</fileName>
        <fileType>${file?.type}</fileType>
      </file>`,
      id: Date.now().toString(),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input?.trim()) {
      return;
    }
    setInput("");
    await onSubmit(input);
  };

  if (isAmy) {
    return (
      <form onSubmit={handleSubmit} ref={formRef} className="w-full px-4">
        <motion.div
          layoutId="input-bar"
          className="flex shadow-none gap-3 items-center p-2 px-2 border rounded-2xl mb-4"
        >
          <FilePicker onFileSelect={handleFileSelect} />
          <Input
            tabIndex={0}
            onKeyDown={onKeyDown}
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInput(e.target.value)
            }
            placeholder={"Send a message"}
            spellCheck={false}
            variant="ghost"
            autoFocus
          />
          <div className="flex items-center gap-2">
            {/* <VoiceRecordButton
              onSubmit={async (text) => {
                await onSubmit(text);
              }}
            /> */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  size="icon"
                  variant="outline"
                  disabled={isLoading || input === ""}
                >
                  <SendIcon />
                  <span className="sr-only">Send message</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send message</TooltipContent>
            </Tooltip>
          </div>
        </motion.div>
      </form>
    );
  } else {
    return (
      <form onSubmit={handleSubmit} ref={formRef}>
        {/* <LinkedFiles chatId={chatId} /> */}
        <motion.div
          layoutId="input-bar"
          className="relative flex items-center gap-2 w-full overflow-hidden max-h-60 grow bg-background border-t"
        >
          <FilePicker
            onFileSelect={handleFileSelect}
            variant="ghost"
            className="ml-4"
          />
          <Input
            ref={inputRef as React.LegacyRef<HTMLInputElement>}
            tabIndex={0}
            onKeyDown={onKeyDown}
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInput(e.target.value)
            }
            placeholder={"Send a message"}
            spellCheck={false}
            variant="ghost"
            className="p-4 h-16"
          />
          <div className="flex items-center gap-2 pr-4">
            {/* <BrainToggle
              isThinkingMode={isThinkingMode}
              onToggle={onThinkingModeToggle}
            /> */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  size="icon"
                  variant="outline"
                  disabled={isLoading || input === ""}
                >
                  <SendIcon />
                  <span className="sr-only">Send message</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send message</TooltipContent>
            </Tooltip>
          </div>
        </motion.div>
      </form>
    );
  }
}
