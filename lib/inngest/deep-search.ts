import { deepSearch } from '../tools/deep-search'
import { inngest } from './client'

export const deepSearchInngest = inngest.createFunction(
  {
    name: 'Deep Search',
    id: 'deep-search',
    timeouts: {
      finish: '5m' // 5 minute execution timeout
    }
  },
  { event: 'deep-search.start' },
  async ({ event }) => {
    const { query, resource_ids } = event.data
    const result = await deepSearch(query, resource_ids)
    return { success: true, result }
  }
)
