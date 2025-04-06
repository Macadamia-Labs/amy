'use client'

import { useAuth } from '@/lib/providers/auth-provider'
import { useChat } from '@ai-sdk/react'
import { ChatRequestOptions, CoreMessage } from 'ai'
import { CreateMessage, Message } from 'ai/react'
import { toast } from 'sonner'
// import { useAuth } from '../providers/auth-provider'
// import { useCooper } from '../providers/cooper-provider'
// import { useToolCallHandler } from '../tool-calls/handle-tool-calls'
// import { getCurrentSelection } from '../tools/handle-get-selection'
// import { App } from '../types/apps'
// import {
//   useMainScriptHandler,
//   useScriptDataStreamHandler
// } from './use-data-handler'

export interface ToolInvocation {
  state: 'result'
  toolCallId: string
  toolName: string
  args: Record<string, any>
  result: any
}

interface UseToolChatProps {
  id?: string
  initialMessages?: CoreMessage[]
  resourcesContext?: {
    resourceIds: string[]
    resourcesContent: string
  }
  selectedModel?: string
}

export function useToolChat({
  id,
  initialMessages,
  resourcesContext,
  selectedModel
}: UseToolChatProps) {
  // const handleToolCall = useToolCallHandler()
  // const { requirements, simulationSteps } = useCooper()

  const { session } = useAuth()
  const token = session?.access_token

  const {
    data,
    messages,
    status,
    append: originalAppend,
    handleSubmit: originalHandleSubmit,
    setData,
    ...chatHelpers
  } = useChat({
    // api: process.env.NEXT_PUBLIC_CHAT_API_URL,
    headers: {
      Authorization: `Bearer ${token}`
    },
    initialMessages: (initialMessages as Message[]) || [],
    id,
    body: {
      id,
      resourcesContext,
      model: selectedModel
    },
    onResponse(response) {
      if (response.status === 401) {
        toast.error(response.statusText)
      }
      console.log('response', response)
    },
    onFinish(message) {
      console.log('onFinish', message)
    },
    async onToolCall(params: { toolCall: any }) {
      const { toolCall } = params
      console.log('Tool call received:', toolCall)
      // return handleToolCall({
      //   toolCall,
      //   data,
      //   messages,
      //   append: originalAppend
      // })
    },
    experimental_throttle: 50,
    sendExtraMessageFields: true
  })

  async function appendWithMetadata(
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) {
    return originalAppend(message, {
      ...chatRequestOptions,
      body: {
        ...chatRequestOptions?.body,
        model: selectedModel
      }
    })
  }

  async function submitWithMetadata(
    event?: { preventDefault?: () => void },
    chatRequestOptions?: ChatRequestOptions
  ) {
    if (event?.preventDefault) {
      event.preventDefault()
    }
    return originalHandleSubmit(event, {
      ...chatRequestOptions,
      body: {
        ...chatRequestOptions?.body,
        model: selectedModel
      }
    })
  }

  const toolInvocations = messages
    .filter(
      msg =>
        Array.isArray(msg.toolInvocations) && msg.toolInvocations.length > 0
    )
    .flatMap(msg => (msg.toolInvocations || []) as ToolInvocation[])

  return {
    data,
    messages,
    status,
    ...chatHelpers,
    append: appendWithMetadata,
    handleSubmit: submitWithMetadata,
    toolInvocations
  }
}
