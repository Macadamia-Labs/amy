'use client'
import { useEffect, useState } from 'react'
import { ActivityDropdown } from './activity-dropdown'

const PROCESSING_STEPS = [
  {
    id: '1',
    status: 'active',
    description: 'Inspecting document structure'
  },
  {
    id: '2',
    status: 'active',
    description: 'Finding related resources'
  },
  {
    id: '3',
    status: 'active',
    description: 'Mapping out changes'
  },
  {
    id: '4',
    status: 'active',
    description: 'Calculating dependent formulas'
  },
  {
    id: '5',
    status: 'active',
    description: 'Analyzing dependencies'
  }
]

export function ProcessingExample() {
  const [activities, setActivities] = useState<typeof PROCESSING_STEPS>([])
  const [isProcessing, setIsProcessing] = useState(true)

  // Simulate adding activities one by one
  useEffect(() => {
    let currentIndex = 0

    const interval = setInterval(() => {
      if (currentIndex < PROCESSING_STEPS.length) {
        setActivities(prev => [...prev, PROCESSING_STEPS[currentIndex]])
        currentIndex++
      } else {
        clearInterval(interval)
        setIsProcessing(false)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <ActivityDropdown activities={activities} isProcessing={isProcessing} />
  )
}
