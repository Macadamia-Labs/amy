// src/app/api/inngest/route.ts
import { inngest } from '@/lib/inngest/client'
import { deepSearchInngest as deepSearch } from '@/lib/inngest/deep-search'
import { processFile } from '@/lib/inngest/process-file'
import { serve } from 'inngest/next'

// Set timeout to 50 minutes (3000 seconds)
export const maxDuration = 3000

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processFile, deepSearch]
})
