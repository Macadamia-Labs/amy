import { tool } from 'ai'
import { z } from 'zod'
const issueSchema = z.object({
  issues: z
    .array(
      z.object({
        title: z.string().describe('Title of the issue'),
        description: z.string().describe('Detailed description of the issue'),
        type: z
          .enum(['typo', 'feature', 'documentation', 'calculation'])
          .describe('Type of the issue'),
        severity: z
          .enum(['minor', 'major', 'critical'])
          .describe('Severity level of the issue')
      })
    )
    .describe('Array of issue objects to format')
})

export const formatIssuesTool = tool({
  description:
    'Based on an analysis of issues, format them into a structured format for a bug report.',
  parameters: issueSchema,
  execute: async ({ issues }) => {
    console.log('Formatting issues:', issues)
    return issues
  }
})
