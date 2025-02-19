"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MessagesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messages: any[];
}

export function MessagesDialog({ open, onOpenChange, messages }: MessagesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Messages</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh]">
          <div className="space-y-4 p-4">
            {messages.map((message, i) => (
              <div key={i} className="rounded-lg bg-muted p-4">
                <pre className="whitespace-pre-wrap text-sm">
                  {JSON.stringify(message, null, 4)}
                </pre>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 