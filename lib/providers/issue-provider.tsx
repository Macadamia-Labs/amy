'use client'

import { Issue } from '@/types/issues'
import { createContext, useContext } from 'react'

interface IssueContextType {
  issue: Issue | null
  getCurrentContext: () => {
    issue_id: string
    title: string
    description: string
    proposedSolution?: string
  }
}

const IssueContext = createContext<IssueContextType>({
  issue: null,
  getCurrentContext: () => ({
    issue_id: '',
    title: '',
    description: ''
  })
})

export function IssueProvider({
  children,
  issue
}: {
  children: React.ReactNode
  issue: Issue
}) {
  const getCurrentContext = () => ({
    issue_id: issue.id,
    title: issue.title,
    description: issue.description,
    proposedSolution: issue.proposedSolution
  })

  return (
    <IssueContext.Provider
      value={{
        issue,
        getCurrentContext
      }}
    >
      {children}
    </IssueContext.Provider>
  )
}

export const useIssue = () => {
  const context = useContext(IssueContext)
  if (!context) {
    throw new Error('useIssue must be used within an IssueProvider')
  }
  return context
}
