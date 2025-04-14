import { CoreMessage, DataStreamWriter, smoothStream, streamText } from 'ai'
import { initLogger, wrapAISDKModel } from 'braintrust'
import { Section } from '../providers/document-provider'
import { deepReasoningTool } from '../tools/deep-reasoning'
import { formatAndSaveIssuesTool } from '../tools/find-issues'
import { imageAnalysisTool } from '../tools/image-analysis'
import { retrieveCodesTool } from '../tools/retrieve-codes'
import { Workflow } from '../types/workflow'
import { getModel } from '../utils/registry'
const logger = initLogger({
  projectName: 'Amy AI',
  apiKey: process.env.BRAINTRUST_API_KEY
})

const SYSTEM_PROMPT = `
<MAIN_INSTRUCTIONS>
You are Cooper, an expert mechanical engineer. You are given resources to analyze and answer user questions about them. 
In the context that you recieve, descriptions of the images are already provided so you should know most of the content of the images. 
In case the user requests or if you need to know more details of the images in the resources that are provided to you, you should use the imageAnalysis tool. 
For the imageAnalysis tool, you have to provide the image url that is listed with the images in the next e.g.
"""
![img-0.jpeg](img-0.jpeg) (image_url: "https://fgeeyklwaodzomhvnrll.supabase.co/storage/v1/object/sign/resources-images/d15bd282-88f...")
"""

Use the deepReasoning tool to reason more about the document and answer the user's question.
</MAIN_INSTRUCTIONS>
`

type ResearcherReturn = Parameters<typeof streamText>[0]

interface ResearcherConfig {
  messages: CoreMessage[]
  model: string
  userProfile: any
  context?: {
    content: string
    activeSection: Section | null
  }
  resourcesContext?: {
    resourceIds: string[]
    resourcesContent: string
  }
  workflow?: Workflow
  dataStream?: DataStreamWriter
}

export function researcher({
  messages,
  model,
  userProfile,
  context,
  resourcesContext,
  workflow,
  dataStream
}: ResearcherConfig): ResearcherReturn {
  try {
    let fullPrompt = SYSTEM_PROMPT

    const currentDate = new Date().toLocaleString()

    const generalInfo = `\n\n<GENERAL_INFO>
    Current date and time: ${currentDate}
    The user's name is ${userProfile.name} and their company is ${userProfile.company}
    </GENERAL_INFO>
        `

    fullPrompt += generalInfo

    ///////////
    // Workflow Context:
    // This is the context for when the user is on a workflow page.
    ///////////
    if (workflow) {
      fullPrompt += `\n\n<WORKFLOW_INSTRUCTIONS>
      The user has selected a workflow ("${workflow.title}") to perform.
    
      Follow these instructions to perform the desired task:
      ${JSON.stringify(workflow.instructions)}
      </WORKFLOW_INSTRUCTIONS>
      `
    }

    ///////////
    // Document Context:
    // This is the context for when the user is on a resource page inspecting a document.
    ///////////
    if (context) {
      fullPrompt += `\n\n<DOCUMENT_INSTRUCTIONS>
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
      - If the question is not related to the document, you can ignore the document context
      </DOCUMENT_INSTRUCTIONS>
      `
    }

    ///////////
    // Resources Context:
    // This is the context for when the user has resources attached to the conversation.
    ///////////
    const resourcesInfo = `\n\n<ATTACHED_RESOURCES>
             ${
               resourcesContext
                 ? `These are the resources they have directly attached to this conversation:
        ${JSON.stringify(resourcesContext)}`
                 : ''
             }
      </ATTACHED_RESOURCES>
      `
    fullPrompt += resourcesInfo

    console.log('fullPrompt', fullPrompt)

    ///////////
    // Model:
    // Get the model from the registry and wrap it with Braintrust.
    ///////////
    const baseModel = getModel(model)
    const wrappedModel = process.env.BRAINTRUST_API_KEY
      ? wrapAISDKModel(baseModel)
      : baseModel

    return {
      model: wrappedModel,
      system: fullPrompt,
      messages,
      tools: {
        // retrieve: retrieveTool,
        // retrieveCodes: retrieveCodesTool,
        formatAndSaveIssuesTool: formatAndSaveIssuesTool,
        // findOptions: findOptionsTool,
        // deepSearch: deepSearchTool(
        //   dataStream,
        //   resourcesContext?.resourcesContent
        // ),
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
