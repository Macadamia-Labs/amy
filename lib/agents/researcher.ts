import { CoreMessage, DataStreamWriter, smoothStream, streamText } from 'ai'
import { initLogger, wrapAISDKModel } from 'braintrust'
import { Section } from '../providers/document-provider'
import { deepReasoningTool } from '../tools/deep-reasoning'
import { deepSearchTool } from '../tools/deep-search'
import { formatAndSaveIssuesTool } from '../tools/find-issues'
import { findOptionsTool } from '../tools/find-options'
import { imageAnalysisTool } from '../tools/image-analysis'
import { retrieveTool } from '../tools/retrieve'
import { retrieveCodesTool } from '../tools/retrieve-codes'
import { getModel } from '../utils/registry'

const logger = initLogger({
  projectName: 'Amy AI',
  apiKey: process.env.BRAINTRUST_API_KEY
})

const USER_NAME = 'Facundo'
// Needs
const COMPANY_PROFILE = `
Proyectos Engineering. It is a 90-person, multi-disciplinary Architecture & Engineering Design (A/E) and Project Management firm.
`

const PROJECTS_COUNT = 1
const PROJECTS_LIST = `
- Project 1
`

const RESOURCES_COUNT = 1
const RESOURCES_LIST = `
- Resource 1
`
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
  context?: {
    content: string
    activeSection: Section | null
  }
  resourcesContext?: {
    resourceIds: string[]
    resourcesContent: string
  }
  templateContext?: {
    templateId: string
    templateContent: string
  }
  dataStream?: DataStreamWriter
}

export function researcher({
  messages,
  model,
  context,
  resourcesContext,
  templateContext,
  dataStream
}: ResearcherConfig): ResearcherReturn {
  try {
    const currentDate = new Date().toLocaleString()
    let fullPrompt = `${SYSTEM_PROMPT}\nCurrent date and time: ${currentDate}`

    const infoPrompt = `
        Here is a general overview of how the platform works:
        The user's name is ${USER_NAME} and their company is ${COMPANY_PROFILE}
        They have ${PROJECTS_COUNT} projects on the platform:
        ${PROJECTS_LIST}
        They have ${RESOURCES_COUNT} resources in their knowledge base.

        ${
          resourcesContext
            ? `These are the resources they have directly attached to this conversation:
        ${JSON.stringify(resourcesContext)}`
            : ''
        }
        `

    fullPrompt += infoPrompt

    if (templateContext) {
      fullPrompt += `\n\nTemplate Context:
      The user has selected an instructions template.
    
      Follow these instructions to perform the desired task:
      ${templateContext.templateContent}
      `
    }

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

    const baseModel = getModel(model)
    const wrappedModel = process.env.BRAINTRUST_API_KEY
      ? wrapAISDKModel(baseModel)
      : baseModel

    return {
      model: wrappedModel,
      system: fullPrompt,
      messages,
      tools: {
        retrieve: retrieveTool,
        retrieveCodes: retrieveCodesTool,
        formatAndSaveIssuesTool: formatAndSaveIssuesTool,
        findOptions: findOptionsTool,
        deepSearch: deepSearchTool(
          dataStream,
          resourcesContext?.resourcesContent
        ),
        imageAnalysis: imageAnalysisTool,
        deepReasoning: deepReasoningTool(
          dataStream,
          resourcesContext?.resourcesContent
        )
      },
      maxSteps: 10,
      experimental_transform: smoothStream({ chunking: 'word' }),
      experimental_telemetry: {
        isEnabled: true,
        metadata: {
          hasContext: !!context,
          hasResourcesContext: !!resourcesContext,
          messageCount: messages.length,
          toolsEnabled: [
            'retrieve',
            'retrieveCodes',
            'formatAndSaveIssuesTool',
            'findOptions',
            'deepSearch',
            'imageAnalysis',
            'deepReasoning'
          ]
        }
      }
    }
  } catch (error) {
    console.error('Error in chatResearcher:', error)
    throw error
  }
}
