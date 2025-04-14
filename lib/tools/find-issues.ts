import { tool } from 'ai'
import { z } from 'zod'
const issueSchema = z.object({
  issues: z
    .array(
      z.object({
        resource_id: z.string().describe('Resource ID of the issue'),
        implementation_steps: z
          .array(z.string())
          .describe('Implementation steps for the issue'),
        user_id: z.string().describe('User ID associated with the issue'),
        severity: z.string().describe('Severity level of the issue'),
        category: z.string().describe('Category of the issue'),
        impact: z.string().describe('Impact of the issue'),
        overall_assessment: z
          .string()
          .describe('Overall assessment of the issue'),
        issue: z.string().describe('Description of the issue'),
        resolution: z.string().describe('Resolution of the issue'),
        estimated_impact: z.string().describe('Estimated impact of the issue')
      })
    )
    .describe('Array of issue objects to format')
})

export const formatAndSaveIssuesTool = tool({
  description:
    'Formats the issues into a structured format compatible with the Supabase issues table.',
  parameters: issueSchema,
  execute: async ({ issues }) => {
    console.log('Formatting issues:', issues)

    return issues
  }
})
