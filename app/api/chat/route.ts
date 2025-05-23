import { getUserProfile } from '@/lib/actions/users'
import { createToolCallingStreamResponse } from '@/lib/streaming/create-tool-calling-stream'
import { isProviderEnabled, isToolCallSupported } from '@/lib/utils/registry'
import { cookies } from 'next/headers'

export const maxDuration = 30

// const DEFAULT_MODEL = 'openai:gpt-4o'
const DEFAULT_MODEL = 'google:gemini-2.0-flash-001'

export async function POST(req: Request) {
  try {
    const {
      messages,
      id: chatId,
      userId,
      context,
      resourcesContext,
      templateContext,
      workflow,
      workflowContext,
      body,
      model: requestModel
    } = await req.json()

    console.log('resourcesContext', resourcesContext)
    console.log('templateContext', templateContext)
    console.log('workflow', workflow)
    console.log('workflowContext', workflowContext)
    console.log('body', body)
    console.log('requestModel from body:', requestModel)

    const referer = req.headers.get('referer')
    const isSharePage = referer?.includes('/share/')

    if (isSharePage) {
      return new Response('Chat API is not available on share pages', {
        status: 403,
        statusText: 'Forbidden'
      })
    }

    const cookieStore = await cookies()
    const modelFromCookie = cookieStore.get('selected-model')?.value
    console.log('modelFromCookie:', modelFromCookie)

    let model: string
    if (requestModel && typeof requestModel === 'string') {
      model = requestModel
    } else if (modelFromCookie) {
      model = modelFromCookie
    } else {
      model = DEFAULT_MODEL
    }

    console.log('Final model selected for this request:', model)

    const provider = model.split(':')[0]
    if (!isProviderEnabled(provider)) {
      console.error(
        `Selected provider '${provider}' is not enabled for model '${model}'`
      )
      return new Response(`Selected provider is not enabled: ${provider}`, {
        status: 404,
        statusText: 'Not Found'
      })
    }

    const supportsToolCalling = isToolCallSupported(model)
    console.log(
      `Model '${model}' supports tool calling: ${supportsToolCalling}`
    )

    const userProfile = await getUserProfile(userId)

    return createToolCallingStreamResponse({
      messages,
      model,
      chatId,
      context,
      resourcesContext,
      workflow,
      userId,
      userProfile
    })
  } catch (error) {
    console.error('API route error:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred'
    return new Response(
      JSON.stringify({
        error: errorMessage,
        status: 500
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
