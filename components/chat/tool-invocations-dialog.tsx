"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ToolInvocation {
  state: "result";
  toolCallId: string;
  toolName: string;
  args: Record<string, any>;
  result?: any;
}

interface ToolInvocationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  toolInvocations?: ToolInvocation[];
}

export function ToolInvocationsDialog({
  open,
  onOpenChange,
  toolInvocations = [],
}: ToolInvocationsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Tool Invocations</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh]">
          <div className="space-y-4 p-4">
            {toolInvocations.map((invocation, index) => (
              <div
                key={invocation.toolCallId || index}
                className="rounded-lg border p-4 space-y-2"
              >
                <div className="font-medium">{invocation.toolName}</div>
                <div className="text-sm text-muted-foreground">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(invocation.args, null, 2)}
                  </pre>
                </div>
                {invocation.result && (
                  <div className="mt-2 text-sm">
                    <div className="font-medium">Result:</div>
                    <pre className="whitespace-pre-wrap text-muted-foreground">
                      {typeof invocation.result === 'string' 
                        ? invocation.result 
                        : JSON.stringify(invocation.result, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
            {toolInvocations.length === 0 && (
              <div className="text-center text-muted-foreground">
                No tool invocations yet
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 