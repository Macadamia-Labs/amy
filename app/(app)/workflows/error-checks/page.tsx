'use client'

import { useState } from 'react'
import { ErrorChecksHeader } from './error-checks-header'
import { ErrorChecksResourcesCard } from './error-checks-resources-card'
import { ErrorsCard } from './errors-card'
import { RulesCard } from './rules-card'

interface Rule {
  id: string
  text: string
  enabled: boolean
}

interface ErrorMessage {
  id: string
  message: string
  ruleText?: string // Optional: link error to a specific rule
  // Add other relevant error details here if needed
}

interface Resource {
  id: string
  name: string
  signedFileUrl: string
  type: string
}

// Mock data for resources - replace with actual data fetching as needed
const mockResources = [
  {
    id: 'res1',
    name: 'Bill_of_Materials_v1.xlsx',
    signedFileUrl: 'mock-url/Bill_of_Materials_v1.xlsx',
    type: 'Spreadsheet'
  },
  {
    id: 'res2',
    name: 'Technical_Drawing_RevA.pdf',
    signedFileUrl: 'mock-url/Technical_Drawing_RevA.pdf',
    type: 'PDF Document'
  },
  {
    id: 'res3',
    name: 'ISO_Drawing_Standard.pdf',
    signedFileUrl: 'mock-url/ISO_Drawing_Standard.pdf',
    type: 'PDF Document'
  }
]

export default function ErrorChecksPage() {
  const [selectedRules, setSelectedRules] = useState<Rule[]>([])
  const [selectedResourceIds, setSelectedResourceIds] = useState<Set<string>>(
    new Set()
  )
  const [foundErrors, setFoundErrors] = useState<ErrorMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSelectedRulesChange = (updatedSelectedRules: Rule[]) => {
    setSelectedRules(updatedSelectedRules)
  }

  const handleResourceSelect = (resourceIds: Set<string>) => {
    setSelectedResourceIds(resourceIds)
    setFoundErrors([])
  }

  async function handleErrorCheck() {
    const selectedResourceId = Array.from(selectedResourceIds)[0] || null
    if (!selectedResourceId) {
      // Potentially show a notification to the user
      console.warn('No resource is selected.')
      setFoundErrors([
        {
          id: 'config-error-resource',
          message: 'Please select a resource to perform an error check.'
        }
      ])
      return
    }

    const enabledRuleTexts = selectedRules
      .filter(rule => rule.enabled)
      .map(rule => rule.text)

    if (enabledRuleTexts.length === 0) {
      console.warn('No rules are enabled.')
      setFoundErrors([
        {
          id: 'config-error-rules',
          message: 'Please select or enable at least one rule to check.'
        }
      ])
      return
    }

    setIsLoading(true)
    setFoundErrors([]) // Clear previous errors

    try {
      // Find the selected resource URL
      const selectedResource = mockResources.find(
        r => r.id === selectedResourceId
      )
      const fileUrl = selectedResource?.signedFileUrl
      const response = await fetch('/api/error-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rules: enabledRuleTexts,
          fileUrl
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error checking failed')
      }

      const result: { errors: ErrorMessage[] } = await response.json()
      setFoundErrors(result.errors)
    } catch (error) {
      console.error('Error checking failed:', error)
      setFoundErrors([
        {
          id: 'api-fetch-error',
          message:
            error instanceof Error ? error.message : 'An unknown error occurred'
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <ErrorChecksHeader
        onCheckErrors={handleErrorCheck}
        isLoading={isLoading}
        rulesCount={selectedRules.filter(r => r.enabled).length}
        isResourceSelected={selectedResourceIds.size > 0}
      />
      <div className="grid grid-cols-2 gap-6 p-6 overflow-auto">
        <div className="col-span-1">
          <RulesCard
            selectedRules={selectedRules}
            onChangeSelectedRules={handleSelectedRulesChange}
          />
        </div>
        <div className="col-span-1">
          <ErrorChecksResourcesCard
            selectedResourceIds={selectedResourceIds}
            onSelectResource={handleResourceSelect}
          />
        </div>
      </div>
      <div className="p-6 pt-0">
        <ErrorsCard errors={foundErrors} />
      </div>
    </div>
  )
}
