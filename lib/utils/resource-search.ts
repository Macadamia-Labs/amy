import { Resource } from '@/lib/types'

export function searchResources(
  resources: Resource[],
  query: string
): Resource[] {
  if (!query.trim()) {
    return resources
  }

  const searchTerms = query.toLowerCase().split(' ')

  return resources.filter(resource => {
    // Search in content_as_text if available
    const contentText = resource.content_as_text?.toLowerCase() || ''

    // Search in other fields as fallback
    const title = resource.title?.toLowerCase() || ''
    const description = resource.description?.toLowerCase() || ''
    const category = resource.category?.toLowerCase() || ''

    // Combine all searchable text
    const searchableText = `${contentText} ${title} ${description} ${category}`

    // Check if all search terms are present in the searchable text
    return searchTerms.every(term => searchableText.includes(term))
  })
}
