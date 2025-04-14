import { CoreMessage, DataStreamWriter, smoothStream, streamText } from 'ai';
import { initLogger, wrapAISDKModel } from 'braintrust';
import { Section } from '../providers/document-provider';
import { deepReasoningTool } from '../tools/deep-reasoning';
import { formatAndSaveIssuesTool } from '../tools/find-issues';
import { imageAnalysisTool } from '../tools/image-analysis';
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
You are Cooper, an expert mechanical engineer. You are given access to technical documents to assist the user with their technical work. The user is another expert mechanical engineer. 
Your base model is gemini-2.0-flash-001 to answer the user's questions. 

You are given the following tools you can use while assisting the user:

- imageAnalysis: in the context that you recieve, descriptions of the images are already provided so you should know most of the content of the images. 
  In case the user requests or if you need to know more details of the images in the resources that are provided to you, you should use the imageAnalysis tool. 
  For the imageAnalysis tool, you have to provide the image url that is listed with the images in the next example.
  """
  ![img-0.jpeg](img-0.jpeg) (image_url: "https://fgeeyklwaodzomhvnrll.supabase.co/storage/v1/object/sign/resources-images/d15bd282-88fa-4e0c-9039-a8a793be6d68/img-0_f4e2ac80-8b4d-4f09-8f38-e2b180896b0b.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJyZXNvdXJjZXMtaW1hZ2VzL2QxNWJkMjgyLTg4ZmEtNGUwYy05MDM5LWE4YTc5M2JlNmQ2OC9pbWctMF9mNGUyYWM4MC04YjRkLTRmMDktOGYzOC1lMmIxODA4OTZiMGIuanBlZyIsImlhdCI6MTc0NDY1ODk0NSwiZXhwIjo0ODY2NzIyOTQ1fQ.Ug4f67q0J2GXBLVc1LZvO30hB4dRrB550F4_L_9lSro")
  """
  IMPORTANT: You should NOT ask the user for permission to use the imageAnalysis tool. If you think more information is needed, directly use the imageAnalysis tool.
  EXAMPLE: if the user asks you to extract the bill of materials from the drawing but it wasn't extracted yet in the image decription, use the imageAnalysis tool directly to get the bill of materials. Do not first ask for the user permission. 

- deepReasoning: the deepReasoning tool allows you to use a reasoning AI model "gemini-2.5-pro-exp-03-25" to reason more in case this is needed to answer the user's question. 
  You should identify yourself if the question from the user can be answered with the basemodel "gemini-2.0-flash-001" of if the reasoning model "gemini-2.5-pro-exp-03-25" is needed. 
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
