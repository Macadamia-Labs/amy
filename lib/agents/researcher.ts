import { CoreMessage, DataStreamWriter, smoothStream, streamText } from 'ai';
import { initLogger, wrapAISDKModel } from 'braintrust';
import { Section } from '../providers/document-provider';
import { deepReasoningTool } from '../tools/deep-reasoning';
import { formatAndSaveIssuesTool } from '../tools/find-issues';
import { imageAnalysisTool } from '../tools/image-analysis';
import { retrieveCodesTool } from '../tools/retrieve-codes';
import { getModel } from '../utils/registry';


const logger = initLogger({
  projectName: 'Amy AI',
  apiKey: process.env.BRAINTRUST_API_KEY
})

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

You are Cooper, an expert mechanical engineer. You are given resourcesto analyze and answer user questions about them. 
In the context that you recieve, descriptions of the images are already provided so you should know most of the content of the images. 
In case the user requests or if you need to know more details of the images in the resources that are provided to you, you should use the imageAnalysis tool. 
For the imageAnalysis tool, you have to provide the image url that is listed with the images in the next e.g.
"""
![img-0.jpeg](img-0.jpeg) (image_url: "https://fgeeyklwaodzomhvnrll.supabase.co/storage/v1/object/sign/resources-images/d15bd282-88fa-4e0c-9039-a8a793be6d68/img-0_f4e2ac80-8b4d-4f09-8f38-e2b180896b0b.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJyZXNvdXJjZXMtaW1hZ2VzL2QxNWJkMjgyLTg4ZmEtNGUwYy05MDM5LWE4YTc5M2JlNmQ2OC9pbWctMF9mNGUyYWM4MC04YjRkLTRmMDktOGYzOC1lMmIxODA4OTZiMGIuanBlZyIsImlhdCI6MTc0NDY1ODk0NSwiZXhwIjo0ODY2NzIyOTQ1fQ.Ug4f67q0J2GXBLVc1LZvO30hB4dRrB550F4_L_9lSro")
"""

Use the deepReasoning tool to reason more about the document and answer the user's question.

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
  workflowContext?: any
  dataStream?: DataStreamWriter
}

export function researcher({
  messages,
  model,
  userProfile,
  context,
  resourcesContext,
  workflowContext,
  dataStream
}: ResearcherConfig): ResearcherReturn {
  try {
    const currentDate = new Date().toLocaleString()
    let fullPrompt = `${SYSTEM_PROMPT}\nCurrent date and time: ${currentDate}`

    const infoPrompt = `
        Here is a general overview of how the platform works:
        The user's name is ${userProfile.name} and their company is ${
      userProfile.company
    }
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

    if (workflowContext) {
      fullPrompt += `\n\nWorkflow Context:
      The user has selected a workflow to perform.
    
      Follow these instructions to perform the desired task:
      ${JSON.stringify(workflowContext)}
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
        // retrieve: retrieveTool,
        retrieveCodes: retrieveCodesTool,
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
