import { openai } from '@ai-sdk/openai'
import { embed } from 'ai'
import { authorizeUser } from '../supabase/authorize-user'
import { createClient } from '../supabase/server'

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

interface Document {
  resource_id: string
  [key: string]: any
}

interface Resource {
  id: string
  title: string
  description: string
  category: string
}

export const hybridSearch = async (query: string) => {
  const supabase = await createClient()
  const { user } = await authorizeUser()
  const embedding = await createEmbedding(query)
  const { data: documents } = await supabase.rpc('hybrid_search', {
    query_text: query,
    query_embedding: embedding,
    match_count: 3,
    user_id: user?.id
  })

  if (!documents?.length) return []

  // Get resource details for each match in a single query
  const { data: resources } = await supabase
    .from('resources')
    .select('id, title, description, category')
    .in(
      'id',
      documents.map((doc: Document) => doc.resource_id)
    )

  // Map the resource details directly into each document
  return documents.map((doc: Document) => {
    const resource = resources?.find((r: Resource) => r.id === doc.resource_id)
    return {
      ...doc,
      title: resource?.title,
      description: resource?.description,
      category: resource?.category
    }
  })
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

