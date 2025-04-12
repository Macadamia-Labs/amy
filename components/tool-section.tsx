'use client'

import { Message, ToolInvocation } from 'ai'
import DeepReasoningSection from './deep-reasoning-section'
import DeepSearchSection from './deep-search-section'
import FindOptionsSection from './find-options-section'
import { ImageAnalysisSection } from './image-analysis-section'
import IssuesSection from './issues-section'
import RetrieveSection from './retrieve-section'
import { SearchSection } from './search-section'
import { VideoSearchSection } from './video-search-section'

interface ToolSectionProps {
  message: Message
  tool: ToolInvocation
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function ToolSection({
  message,
  tool,
  isOpen,
  onOpenChange
}: ToolSectionProps) {
  switch (tool.toolName) {
    case 'search':
      return (
        <SearchSection
          tool={tool}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )
    case 'video_search':
      return (
        <VideoSearchSection
          tool={tool}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )
    case 'retrieve':
      return (
        <RetrieveSection
          tool={tool}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )
    case 'formatIssues':
      return (
        <IssuesSection
          tool={tool}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )
    case 'findOptions':
      return (
        <FindOptionsSection
          tool={tool}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )
    case 'deepSearch':
      return (
        <DeepSearchSection
          message={message}
          tool={tool}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )
    case 'deepReasoning':
      return (
        <DeepReasoningSection
          message={message}
          tool={tool}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )
    case 'imageAnalysis':
      return (
        <ImageAnalysisSection
          tool={tool}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )
    default:
      return (
        <div className="bg-red-100/50 p-4 rounded rounded-xl text-red-500 text-sm">
          Unknown tool: {tool.toolName}
        </div>
      )
  }
}
