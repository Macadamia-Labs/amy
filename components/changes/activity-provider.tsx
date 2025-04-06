'use client'

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import { AnalyzingChangesExample } from './analyzing-changes'
import {
  PropagatedChangeExample,
  SupplierAExample,
  SupplierAExample1,
  SupplierAExample2
} from './changes-list'

type ActivityContextType = {
  visibleChanges: React.ReactNode[]
  currentIndex: number
  totalChanges: number
  animationComplete: boolean
  addNextItem: () => void
  clearAll: () => void
  // Add issue counts to the context
  issueCounts: {
    openIssues: number
    inProgress: number
    resolved: number
  }
  updateIssueCounts: (counts: {
    openIssues: number
    inProgress: number
    resolved: number
  }) => void
}

const ActivityContext = createContext<ActivityContextType | undefined>(
  undefined
)

export function useActivity() {
  const context = useContext(ActivityContext)
  if (!context) {
    throw new Error('useActivity must be used within an ActivityProvider')
  }
  return context
}

type ActivityProviderProps = {
  children: ReactNode
}

export function ActivityProvider({ children }: ActivityProviderProps) {
  // Sequence of components to be displayed (in correct order - first to appear at top)
  const changeComponents = [
    // <ShellThicknessIssueExample key="shell" />,
    <PropagatedChangeExample key="propagated" />,
    <SupplierAExample key="supplierA" />,
    <SupplierAExample1 key="supplierA1" />,
    <SupplierAExample2 key="supplierA2" />,
    // <SupplierAExample4 key="supplierA4" />,
    // <SupplierAExample5 key="supplierA5" />
    // <MaterialSpecificationChangeExample key="material" />,
    // <ValueChangeExample key="value" />,
    // <StatusChangeExample key="status" />,
    // <EmailForwardingExample key="email" />,
    // <UploadedFileExample key="uploaded" />,
    // <UndersizedManwayIssueExample key="manway" />,
    // <FlowRateMismatchIssueExample key="flow" />,
    // <InletNozzleIssueExample key="inlet" />,
    // <SupportSaddlesIssueExample key="support" />,
    // <LiftingLugIssueExample key="lifting" />,
    <AnalyzingChangesExample key="analyzing" />
  ]

  // State to track which items should be visible
  const [visibleChanges, setVisibleChanges] = useState<React.ReactNode[]>([])
  // State to track the current index for step-by-step addition
  const [currentIndex, setCurrentIndex] = useState(0)
  // State to track if animation is complete
  const [animationComplete, setAnimationComplete] = useState(false)
  // State to track issue counts
  const [issueCounts, setIssueCounts] = useState({
    openIssues: 0,
    inProgress: 0,
    resolved: 0
  })

  // Function to update issue counts
  const updateIssueCounts = (counts: {
    openIssues: number
    inProgress: number
    resolved: number
  }) => {
    setIssueCounts(counts)
  }

  // Add next item one by one
  const addNextItem = () => {
    if (currentIndex < changeComponents.length) {
      setVisibleChanges(prev => [...prev, changeComponents[currentIndex]])
      setCurrentIndex(prev => prev + 1)

      // Update issue counts based on the current step
      // These values will be provided by the user on each space press
      // For now, we'll use some example values that change with each step
      if (currentIndex === 0) {
        setIssueCounts({
          openIssues: 1,
          inProgress: 0,
          resolved: 0
        })
      } else if (currentIndex === 1) {
        setIssueCounts({
          openIssues: 0,
          inProgress: 1,
          resolved: 0
        })
      } else if (currentIndex === 2) {
        setIssueCounts({
          openIssues: 1,
          inProgress: 0,
          resolved: 1
        })
      } else if (currentIndex === 3) {
        setIssueCounts({
          openIssues: 0,
          inProgress: 1,
          resolved: 1
        })
      } else if (currentIndex === 4) {
        setIssueCounts({
          openIssues: 0,
          inProgress: 1,
          resolved: 1
        })
      } else if (currentIndex === 5) {
        setIssueCounts({
          openIssues: 0,
          inProgress: 0,
          resolved: 2
        })
      }

      // Set animation complete when all items are added
      if (currentIndex === changeComponents.length - 1) {
        setAnimationComplete(true)
      }
    }
  }

  // Clear all changes
  const clearAll = () => {
    setVisibleChanges([])
    setAnimationComplete(true)
    setCurrentIndex(0)
    setIssueCounts({
      openIssues: 0,
      inProgress: 0,
      resolved: 0
    })
  }

  // Initialize with first 3 changes
  useEffect(() => {
    // Show first 3 changes
    const initialChanges = changeComponents.slice(0, 3)
    setVisibleChanges(initialChanges)
    setCurrentIndex(3)

    // Set initial issue counts based on first 3 changes
    setIssueCounts({
      openIssues: 1,
      inProgress: 0,
      resolved: 1
    })
  }, [])

  // Add space bar event listener to add next item
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't capture space if user is typing in an input or textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      if (
        event.code === 'Space' &&
        !animationComplete &&
        currentIndex < changeComponents.length
      ) {
        event.preventDefault() // Prevent default spacebar behavior (scrolling)
        addNextItem()
      }
    }

    // Add event listener
    window.addEventListener('keydown', handleKeyDown)

    // Clean up event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentIndex, animationComplete, changeComponents.length])

  const value = {
    visibleChanges,
    currentIndex,
    totalChanges: changeComponents.length,
    animationComplete,
    addNextItem,
    clearAll,
    issueCounts,
    updateIssueCounts
  }

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  )
}
