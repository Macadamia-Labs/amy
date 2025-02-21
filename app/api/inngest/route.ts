// src/app/api/inngest/route.ts
import { inngest } from '@/lib/inngest/client'
import { processFile } from '@/lib/inngest/process-file'
import { serve } from 'inngest/next'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processFile]
})
