'use client'

import { createContext, ReactNode, useContext, useState } from 'react'

interface CooperContextType {
  showTabs: boolean
  setShowTabs: (show: boolean) => void
  hasContent: boolean
  setHasContent: (hasContent: boolean) => void
}

const CooperContext = createContext<CooperContextType | undefined>(undefined)

export function CooperProvider({ children }: { children: ReactNode }) {
  const [showTabs, setShowTabs] = useState(true)
  const [hasContent, setHasContent] = useState(false)

  return (
    <CooperContext.Provider
      value={{
        showTabs,
        setShowTabs,
        hasContent,
        setHasContent
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
