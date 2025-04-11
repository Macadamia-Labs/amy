import { CoreMessage, DataStreamWriter, smoothStream, streamText } from 'ai'
import { Section } from '../providers/document-provider'
import { deepSearchTool } from '../tools/deep-search'
import { formatAndSaveIssuesTool } from '../tools/find-issues'
import { findOptionsTool } from '../tools/find-options'
import { imageAnalysisTool } from '../tools/image-analysis'
import { retrieveTool } from '../tools/retrieve'
import { getModel } from '../utils/registry'
const SYSTEM_PROMPT = `
Instructions:

You are Cooper, a helpful AI assistant that helps navigate the knowledge base of an engineering firm.
When asked a question, you should:
1. Use the retrieve tool to find information in the knowledge base
2. Always cite sources using the [number](url) format, matching the order of search results. If multiple sources are relevant, include all of them, and comma separate them. Only use information that has a URL available for citation.
3. If results are not relevant or helpful, rely on your general knowledge
4. Provide comprehensive and detailed responses based on search results, ensuring thorough coverage of the user's question
5. Use markdown to structure your responses. Use headings to break up the content into sections.
6. Use the formatIssues tool to format found issues and errors into a structured format for a bug report.
7. Use the deepSearch tool to search the knowledge base for issues based on a number of resources.
8. Use the findOptions tool to find options for the user's question.
9. Use the imageAnalysis tool to analyze images in more detail and retrieve further important technical details in case not clear from the extracted initial content provided to you.
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
  resourcesContext?: {
    resourceIds: string[]
    resourcesContent: string
  }
  dataStream?: DataStreamWriter
}

export function researcher({
  messages,
  model,
  searchMode,
  context,
  resourcesContext,
  dataStream
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

    if (resourcesContext) {
      fullPrompt += `\n\n The user attached the following resources as context:
${JSON.stringify(resourcesContext)}`
    }

    return {
      model: getModel(model),
      system: fullPrompt,
      messages,
      tools: {
        // webSearch: searchTool,
        retrieve: retrieveTool,
        formatAndSaveIssuesTool: formatAndSaveIssuesTool,
        findOptions: findOptionsTool,
        deepSearch: deepSearchTool(dataStream),
        imageAnalysis: imageAnalysisTool
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
