'use client'

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import {
  PropagatedChangeExample,
  SupplierAExample,
  SupplierAExample1,
  SupplierAExample2,
  SupplierAExample4,
  SupplierAExample5
} from './changes-list'

type ActivityContextType = {
  visibleChanges: React.ReactNode[]
  currentIndex: number
  totalChanges: number
  animationComplete: boolean
  addNextItem: () => void
  clearAll: () => void
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
    <SupplierAExample4 key="supplierA4" />,
    <SupplierAExample5 key="supplierA5" />,
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
    // <AnalyzingChangesExample key="analyzing" />
  ]

  // State to track which items should be visible
  const [visibleChanges, setVisibleChanges] = useState<React.ReactNode[]>([])
  // State to track the current index for step-by-step addition
  const [currentIndex, setCurrentIndex] = useState(0)
  // State to track if animation is complete
  const [animationComplete, setAnimationComplete] = useState(false)

  // Add next item one by one
  const addNextItem = () => {
    if (currentIndex < changeComponents.length) {
      setVisibleChanges(prev => [...prev, changeComponents[currentIndex]])
      setCurrentIndex(prev => prev + 1)

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
  }

  // Initialize with empty list (no items shown by default)
  useEffect(() => {
    // Start with no visible changes
    setVisibleChanges([])
    setCurrentIndex(0)
  }, [])

  // Add space bar event listener to add next item
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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
    clearAll
  }

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  )
}
