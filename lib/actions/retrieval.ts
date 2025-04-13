import { openai } from '@ai-sdk/openai'
import { embed } from 'ai'
import { createServiceRoleClient } from '../supabase/service-role'

export const createEmbedding = async (
  text: string,
  model:
    | 'text-embedding-3-small'
    | 'text-embedding-3-large' = 'text-embedding-3-small',
  dimensions: number = 1536
) => {
  const { embedding } = await embed({
    model: openai.embedding(model, { dimensions }),
    value: text
  })
  console.log('Embedding size:', embedding.length);
  // Add SQL vector format logging
  console.log("\n--- COPY SQL VECTOR BELOW ---");
  console.log(`'${JSON.stringify(embedding)}'::vector`);
  console.log("--- END SQL VECTOR ---\n");
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

export const hybridSearchCodes = async (query: string) => {
  const supabase = createServiceRoleClient()
  const embedding = await createEmbedding(query)
  const { data: documents } = await supabase.rpc('hybrid_search_with_context', {
    query_text: query,
    query_embedding: embedding,
    match_count: 9
  })
  console.log('Hybrid Search Results:', documents);
  return documents
}

