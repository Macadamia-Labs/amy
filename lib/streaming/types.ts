import { Message } from 'ai'
import { Section } from '../providers/document-provider'

export interface BaseStreamConfig {
  messages: Message[]
  model: string
  chatId: string
  searchMode: boolean
  context?: {
    content: string
    activeSection: Section | null
  }
}
