import { Message } from 'ai'
import { Section } from '../providers/document-provider'

export interface BaseStreamConfig {
  messages: Message[]
  model: string
  chatId: string
  userId: string
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
}
