"use client";

import React from "react";
import { getFileIcon } from "@/lib/utils/file-icons";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFiles } from "@/lib/providers/files-provider";

interface LinkedFileChipProps {
  fileName: string;
  fileId: string;
  chatId: string;
  className?: string;
  onRemove?: () => void;
}

export function LinkedFileChip({
  fileName,
  fileId,
  chatId,
  className,
  onRemove,
}: LinkedFileChipProps) {
  const { unlinkFileFromChat } = useFiles();

  const handleUnlink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await unlinkFileFromChat(chatId, fileId);
      onRemove?.(); // Call onRemove callback if provided
    } catch (error) {
      console.error("Error unlinking file:", error);
    }
  };

  return (
    <div
      className={`bg-neutral-700 text-white text-xs px-1.5 py-0 rounded font-mono inline-flex items-center gap-2 h-5 w-fit ${className}`}
    >
      {getFileIcon(fileName, { className: "h-3 w-3" })}
      <span>{fileName}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-4 w-4 p-0 opacity-60 hover:opacity-100 hover:bg-secondary-foreground/20"
        onClick={handleUnlink}
      >
        <X className="h-3 w-3" />
        <span className="sr-only">Unlink file</span>
      </Button>
    </div>
  );
}
