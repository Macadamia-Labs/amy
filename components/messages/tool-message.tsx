'use client'
import { AskForConfirmationTool } from '@/components/chat/tools/ask-for-confirmation-tool'
import { BaseToolResult } from '@/components/chat/tools/base-tool-result'
import { LoadingTool } from '@/components/chat/tools/loading-tool'
import { Message } from 'ai'
import { toast } from 'sonner'
import { MemoizedReactMarkdown } from '../ui/markdown'

interface ToolMessageProps {
  chatId: string
  toolInvocation: {
    state: string
    toolCallId: string
    toolName: string
    args?: Record<string, any>
    result?: Record<string, any>
  }
  append: (message: Message) => Promise<string | null | undefined>
  addToolResult: ({
    toolCallId,
    result
  }: {
    toolCallId: string
    result: any
  }) => void
}

export function ToolMessage({
  toolInvocation,
  addToolResult
}: ToolMessageProps) {
  try {
    // Convert the raw invocation object into either a "tool-call" or "tool-result"
    const tool =
      toolInvocation.state === 'result'
        ? {
            type: 'tool-result' as const,
            toolName: toolInvocation.toolName,
            toolCallId: toolInvocation.toolCallId,
            result: toolInvocation.result || {},
            args: toolInvocation.args || {}
          }
        : {
            type: 'tool-call' as const,
            toolName: toolInvocation.toolName,
            toolCallId: toolInvocation.toolCallId,
            args: toolInvocation.args || {}
          }

    return <div>{renderTool(tool, addToolResult)}</div>
  } catch (error) {
    toast.error('Error in ToolMessage', {
      description: error instanceof Error ? error.message : 'Unknown error'
    })
    console.error('Error in ToolMessage', error)
    return <div className="text-red-500 p-2">Failed to render tool message</div>
  }
}

function renderTool(
  tool: any,
  addToolResult: ({
    toolCallId,
    result
  }: {
    toolCallId: string
    result: any
  }) => void
) {
  if (!tool) {
    return <LoadingTool tool={tool} addToolResult={addToolResult} />
  }

  if (tool.type === 'tool-call') {
    switch (tool.toolName) {
      case 'askForConfirmation':
        return (
          <AskForConfirmationTool tool={tool} addToolResult={addToolResult} />
        )
      default:
        return <LoadingTool tool={tool} addToolResult={addToolResult} />
    }
  }

  if (tool.type === 'tool-result') {
    switch (tool.toolName) {
      case 'getCurrentSelection':
        return (
          <BaseToolResult
            tool={tool}
            title="Selection Retrieved"
            loadingTitle="Retrieving Selection"
            successTitle="Selection Retrieved"
            failTitle="Failed to Retrieve Selection"
            isSuccess={tool.result?.success}
            showDialog={true}
          >
            <p>{JSON.stringify(tool.result)}</p>
          </BaseToolResult>
        )
      case 'generateReport':
        return (
          <div className="w-full h-full rounded-2xl border p-6 bg-sidebar">
            <MemoizedReactMarkdown>
              {tool.result?.generated_report || ''}
            </MemoizedReactMarkdown>
          </div>
        )
      default:
        return null
    }
  }

  return <p>Unknown tool: {JSON.stringify(tool)}</p>
}
