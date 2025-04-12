import { openai } from '@ai-sdk/openai'
import { embed } from 'ai'
import { createServiceRoleClient } from '../supabase/service-role'

export const createEmbedding = async (
  text: string,
  model:
    | 'text-embedding-3-small'
    | 'text-embedding-3-large' = 'text-embedding-3-small'
) => {
  const { embedding } = await embed({
    model: openai.embedding(model),
    value: text
  })
  return embedding
}

export const hybridSearch = async (query: string) => {
  const supabase = createServiceRoleClient()
  const embedding = await createEmbedding(query)
  const { data: documents } = await supabase.rpc('hybrid_search', {
    query_text: query,
    query_embedding: embedding,
    match_count: 3
  })
  return documents
}
