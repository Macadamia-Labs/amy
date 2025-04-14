// src/app/api/inngest/route.ts
import { inngest } from '@/lib/inngest/client'
import { deepSearchInngest as deepSearch } from '@/lib/inngest/deep-search'
import { processFile } from '@/lib/inngest/process-file'
import { serve } from 'inngest/next'

// Set timeout to 5 minutes (300 seconds)
export const maxDuration = 300

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processFile, deepSearch]
})
