import { CoreMessage, smoothStream, streamText } from 'ai'
import { Section } from '../providers/document-provider'
import { retrieveTool } from '../tools/retrieve'
import { searchTool } from '../tools/search'
import { getModel } from '../utils/registry'

const SYSTEM_PROMPT = `
Instructions:

You are Cooper, a helpful AI assistant that helps navigate the knowledge base of an engineering firm.
When asked a question, you should:
1. Search for relevant information online using the web search tool when needed
2. Use the retrieve tool to find information in the knowledge base
3. Analyze all search results to provide accurate, up-to-date information
4. Always cite sources using the [number](url) format, matching the order of search results. If multiple sources are relevant, include all of them, and comma separate them. Only use information that has a URL available for citation.
5. If results are not relevant or helpful, rely on your general knowledge
6. Provide comprehensive and detailed responses based on search results, ensuring thorough coverage of the user's question
7. Use markdown to structure your responses. Use headings to break up the content into sections.
8. **Use the retrieve tool only with user-provided URLs.**

Citation Format:
[number](url)
`

type ResearcherReturn = Parameters<typeof streamText>[0]

interface ResearcherConfig {
  messages: CoreMessage[]
  model: string
  searchMode: boolean
  context?: {
    content: string
    activeSection: Section | null
  }
}

export function researcher({
  messages,
  model,
  searchMode,
  context
}: ResearcherConfig): ResearcherReturn {
  try {
    const currentDate = new Date().toLocaleString()
    let fullPrompt = `${SYSTEM_PROMPT}\nCurrent date and time: ${currentDate}`

    if (context) {
      fullPrompt += `\n\nDocument Context:
1. You have access to a document with the following content:
${context.content}

2. The user is currently viewing the following section:
${
  context.activeSection
    ? context.activeSection.content
    : 'No specific section selected'
}

When answering questions:
- Consider the document context when relevant to the user's question
- If the question is about the document, focus on the content from the active section first
- You can reference other parts of the document if needed
- If the question is not related to the document, you can ignore the document context`
    }

    return {
      model: getModel(model),
      system: fullPrompt,
      messages,
      tools: {
        webSearch: searchTool,
        retrieve: retrieveTool,
      },
      // experimental_activeTools: searchMode
      //   ? ['search', 'retrieve']
      //   : [],
      maxSteps: searchMode ? 5 : 1,
      experimental_transform: smoothStream({ chunking: 'word' })
    }
  } catch (error) {
    console.error('Error in chatResearcher:', error)
    throw error
  }
}
