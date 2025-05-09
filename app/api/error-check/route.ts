import { NextResponse } from 'next/server'

interface ErrorCheckRequestBody {
  rules: string[]
  fileUrl: string
}

interface ErrorMessage {
  id: string
  message: string
  ruleText?: string
  // Add other relevant error details here if needed
}

// Simulate a delay to mimic real API processing time
async function simulateDelay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function POST(request: Request) {
  try {
    const body: ErrorCheckRequestBody = await request.json()
    const { rules, fileUrl } = body

    if (
      !rules ||
      !Array.isArray(rules) ||
      !fileUrl ||
      typeof fileUrl !== 'string'
    ) {
      return NextResponse.json(
        {
          message:
            'Invalid request body: rules (array of strings) and fileUrl (string) are required.'
        },
        { status: 400 }
      )
    }

    // Simulate some processing
    await simulateDelay(1500) // Simulate 1.5 seconds of processing

    const foundErrors: ErrorMessage[] = []

    // Mock error generation logic
    if (rules.length === 0) {
      // This case should ideally be caught client-side, but as a fallback:
      foundErrors.push({
        id: 'no-rules-provided',
        message: 'No rules were provided to check against.'
      })
    } else {
      rules.forEach((rule, index) => {
        // Simulate finding an error for some rules
        if (
          fileUrl.includes('Bill_of_Materials') &&
          rule.toLowerCase().includes('duplicate items')
        ) {
          foundErrors.push({
            id: `err-${index}-bom-dup`,
            message: `Potential duplicate items found in ${fileUrl} violating rule: "${rule}"`,
            ruleText: rule
          })
        }
        if (rule.toLowerCase().includes('title block') && Math.random() > 0.5) {
          foundErrors.push({
            id: `err-${index}-title-block`,
            message: `Title block incomplete in ${fileUrl}. Checked against rule: "${rule}"`,
            ruleText: rule
          })
        }
        if (index % 3 === 0 && !fileUrl.includes('ISO_Drawing_Standard')) {
          // Mock error for every 3rd rule if not the ISO standard doc
          foundErrors.push({
            id: `err-${index}-generic`,
            message: `Generic check failed for rule: "${rule}" on file ${fileUrl}.`,
            ruleText: rule
          })
        }
      })
    }

    if (foundErrors.length === 0 && rules.length > 0) {
      // If no specific errors were triggered by the mock logic but rules were present
      foundErrors.push({
        id: 'no-specific-errors',
        message: `No specific issues found for ${fileUrl} based on the provided ${rules.length} rules during this mock check.`
      })
    }

    if (rules.length > 0 && fileUrl.includes('ISO_Drawing_Standard')) {
      // Always return a specific message for the ISO standard, potentially an empty error array if it passes all checks
      return NextResponse.json({
        errors: [
          {
            id: 'iso-check',
            message: `ISO document ${fileUrl} checked. All clear!`
          }
        ]
      })
    }

    return NextResponse.json({ errors: foundErrors })
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
