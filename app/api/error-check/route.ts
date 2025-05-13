export const maxDuration = 300

import { getSignedResourceUrl } from '@/lib/actions/resources'
import { NextResponse } from 'next/server'

interface ErrorCheckRequestBody {
  rules: string[]
  resourceIds: string[]
}

interface ErrorMessage {
  id: string
  message: string
  resourceId?: string
  ruleText?: string
}

export async function POST(request: Request) {
  try {
    const body: ErrorCheckRequestBody = await request.json()
    const { rules, resourceIds } = body

    console.log('api/error-check/route.ts')
    console.log('rules', rules)
    console.log('resourceIds', resourceIds)

    if (
      !rules ||
      !Array.isArray(rules) ||
      !resourceIds ||
      !Array.isArray(resourceIds) ||
      resourceIds.length === 0
    ) {
      return NextResponse.json(
        {
          message:
            'Invalid request body: rules (array of strings) and resourceIds (array of strings) are required.'
        },
        { status: 400 }
      )
    }

    const errorPromises = resourceIds.map(async (resourceId) => {
      let fileUrl: string | null = null
      try {
        fileUrl = await getSignedResourceUrl(resourceId)
      } catch (e) {
        return {
          id: `signed-url-error-${resourceId}`,
          message: `Failed to get signed URL for resource ${resourceId}: ${e instanceof Error ? e.message : 'Unknown error'}`,
          resourceId
        }
      }

      try {
        console.log('api/error-check/route.ts')
        console.log('process.env.QA_CHECK_API_URL', process.env.QA_CHECK_API_URL)
        console.log('process.env.MACADAMIA_API_URL', process.env.MACADAMIA_API_URL)
        console.log('fileUrl', fileUrl)
        console.log('rules', rules)
        const apiResponse = await fetch(
          process.env.QA_CHECK_API_URL || process.env.MACADAMIA_API_URL + '/v1/proyectos/qa-check-drawings',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(process.env.QA_CHECK_API_KEY ? { 'Authorization': `Bearer ${process.env.QA_CHECK_API_KEY}` } : {})
            },
            body: JSON.stringify({
              'file-url': fileUrl,
              custom_prompt: rules.join('\n')
            })
          }
        )

        if (!apiResponse.ok) {
          const errorData = await apiResponse.text()
          return {
            id: `external-api-error-${resourceId}`,
            message: `External API error for resource ${resourceId}: ${errorData}`,
            resourceId
          }
        }

        const apiResult = await apiResponse.json()
        console.log('apiResult', apiResult)
        // Handle qa_results as either a string or an array
        if (typeof apiResult.qa_results === 'string') {
          return {
            id: `qa-results-${resourceId}`,
            message: apiResult.qa_results,
            resourceId
          }
        } else if (Array.isArray(apiResult.qa_results)) {
          // Return an array of error messages, one per result
          return apiResult.qa_results.map((result: string, idx: number) => ({
            id: `qa-results-${resourceId}-${idx}`,
            message: result,
            resourceId
          }))
        } else {
          return {
            id: `external-api-success-${resourceId}`,
            message: typeof apiResult === 'string' ? apiResult : JSON.stringify(apiResult),
            resourceId
          }
        }
      } catch (e) {
        return {
          id: `external-api-fetch-error-${resourceId}`,
          message: `Failed to call external API for resource ${resourceId}: ${e instanceof Error ? e.message : 'Unknown error'}`,
          resourceId
        }
      }
    })

    const allResults = await Promise.all(errorPromises)
    // Flatten in case any result is an array (from multiple qa_results)
    const allErrors: ErrorMessage[] = allResults.flat()

    console.log('allErrors', allErrors)

    return NextResponse.json({ errors: allErrors })
  } catch (error) {
    console.error('[API_ERROR_CHECK] Error:', error)
    let errorMessage = 'Internal Server Error'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json(
      { message: 'Failed to process error check.', details: errorMessage },
      { status: 500 }
    )
  }
}
