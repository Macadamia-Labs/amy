import { inngest } from './client'

interface ErrorCheckEvent {
  rules: string[]
  fileUrls: string[]
  userId?: string
}

interface ErrorCheckResult {
  fileUrl: string
  errors: unknown[]
  status: 'success' | 'error'
  message?: string
}

export const errorCheckInngest = inngest.createFunction(
  {
    name: 'Error Check (External API)',
    id: 'error-check',
    timeouts: {
      finish: '5m'
    }
  },
  { event: 'error-check.requested' },
  async ({ event }) => {
    const { rules, fileUrls, userId } = event.data as ErrorCheckEvent
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/v1/proyectos/qa-check-drawings`

    

    // Run all checks in parallel
    const results: ErrorCheckResult[] = await Promise.all(
      fileUrls.map(async fileUrl => {
        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              rules,
              fileUrl,
              userId
            })
          })
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            return {
              fileUrl,
              errors: [],
              status: 'error',
              message: errorData.message || 'API error'
            }
          }
          const data = await response.json()
          return {
            fileUrl,
            errors: data.errors || [],
            status: 'success'
          }
        } catch (error: any) {
          return {
            fileUrl,
            errors: [],
            status: 'error',
            message: error?.message || 'Unknown error'
          }
        }
      })
    )
    return { results }
  }
) 