'use client'

import Loader from '../lottie/loader'
import { useActivity } from './activity-provider'

interface IssueCategory {
  count: number
  label: string
  color: string
}

interface NavItem {
  label: string
}

export function CooperReasoningSection() {
  // Get issue counts from the ActivityProvider
  const { issueCounts } = useActivity()
  
  // Navigation items
  const navItems: NavItem[] = [
    { label: 'Resources' },
    { label: 'Workflows' }
  ]

  // Create issue categories using the counts from ActivityProvider
  const issueCategories: IssueCategory[] = [
    {
      count: issueCounts.openIssues,
      label: 'Open Issues',
      color: 'bg-red-100'
    },
    {
      count: issueCounts.inProgress,
      label: 'In Progress',
      color: 'bg-amber-100'
    },
    {
      count: issueCounts.resolved,
      label: 'Resolved',
      color: 'bg-green-100'
    }
  ]

  return (
    <div className="mb-8 rounded-lg border p-4">
      <div className="flex flex-col">
        {/* Header section with Cooper info */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Loader className="size-10 mr-3" />
            <div className="flex items-center">
              <h2 className="text-xl font-semibold">Cooper, your AI mechanical engineer</h2>
            </div>
          </div>
          
          {/* Status bar in top right corner */}
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm text-gray-600">Online</span>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex gap-2">
          {/* Navigation items */}
          {navItems.map((item, index) => (
            <div key={index} className="rounded-lg p-4 flex-1 text-center border border-gray-200">
              <div className="text-2xl font-bold">&nbsp;</div>
              <div className="text-sm">{item.label}</div>
            </div>
          ))}
          
          {/* Issues section */}
          {issueCategories.map((category, index) => (
            <div key={index} className={`${category.color} rounded-lg p-4 flex-1 text-center`}>
              <div className="text-2xl font-bold">{category.count}</div>
              <div className="text-sm">{category.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 