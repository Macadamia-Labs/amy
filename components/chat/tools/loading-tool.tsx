"use client";

import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { getToolLoadingMessage } from "@/lib/tools";
import { ExtendedToolCallPart } from "@/types/tool-types";
import { Message } from "ai";
import { generateUUID } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface LoadingToolProps {
  tool: ExtendedToolCallPart;
  addToolResult: ({ toolCallId, result }: { toolCallId: string; result: any }) => void;
}

export function LoadingTool({ tool, addToolResult }: LoadingToolProps) {
  const handleCancel = () => {
    console.log("User cancelled operation");
    addToolResult({
      toolCallId: tool.toolCallId,
      result: {
        error: "User cancelled operation"
      }
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <ContextMenu>
          <ContextMenuTrigger>
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-lg mx-2 bg-muted p-2 pr-4 text-sm flex gap-2  w-fit items-center"
            >
              <div className="h-8 w-8 flex items-center justify-center">
                <Loader2 className="size-4 animate-spin" />
              </div>
              {tool.args.loading_message || getToolLoadingMessage(tool.toolName)}
            </motion.div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuLabel>Tool Details</ContextMenuLabel>
            <ContextMenuSeparator />
            <ContextMenuItem disabled>
              Tool: {tool.toolName}
            </ContextMenuItem>
            <ContextMenuItem disabled className="w-full max-w-xl">
              Args: {JSON.stringify(tool.args)}
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={handleCancel} className="text-red-500 focus:text-red-500 focus:bg-red-50">
              Cancel Operation
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </motion.div>
    </AnimatePresence>
  );
}
