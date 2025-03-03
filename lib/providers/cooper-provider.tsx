'use client'

import { createContext, ReactNode, useContext, useState } from 'react'

interface CooperContextType {
  showTabs: boolean
  setShowTabs: (show: boolean) => void
  hasContent: boolean
  setHasContent: (hasContent: boolean) => void
  sources: Array<{ id: string; [key: string]: any }>
  setActiveSource: (source: { id: string; [key: string]: any }) => void
  setActiveTab: (tab: string) => void
}

const CooperContext = createContext<CooperContextType | undefined>(undefined)

export function CooperProvider({ children }: { children: ReactNode }) {
  const [showTabs, setShowTabs] = useState(true)
  const [hasContent, setHasContent] = useState(false)
  const [sources, setSources] = useState<
    Array<{ id: string; [key: string]: any }>
  >([])
  const [activeSource, setActiveSource] = useState<{
    id: string
    [key: string]: any
  } | null>(null)
  const [activeTab, setActiveTab] = useState<string>('chat')

  return (
    <CooperContext.Provider
      value={{
        showTabs,
        setShowTabs,
        hasContent,
        setHasContent,
        sources,
        setActiveSource,
        setActiveTab
      }}
    >
      {children}
    </CooperContext.Provider>
  )
}

export function useCooper(): CooperContextType {
  const context = useContext(CooperContext)

  if (context === undefined) {
    throw new Error('useCooper must be used within a CooperProvider')
  }

  return context
}
