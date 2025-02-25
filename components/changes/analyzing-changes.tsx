'use client'
import { AlertIcon, BulbIcon, CheckCircleIcon } from '@/lib/utils/icons'
import { XIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Loader from '../lottie/loader'
import LoadingDots from '../magicui/loading-dots'
import { Button } from '../ui/button'
import { FileReference } from './changes-list'

// Define the structure for each analysis step
interface AnalysisStep {
  id: string
  description: string
  isLoading: boolean
  result?: string
  duration: number // in milliseconds
  status: 'waiting' | 'loading' | 'completed'
  result_type?: 'looks_fine' | 'requires_more_info' | 'issue_detected'
}

// Loading component to handle UI when steps are in progress
interface AnalysisLoadingProps {
  steps: AnalysisStep[]
}

const AnalysisLoading = ({ steps }: AnalysisLoadingProps) => {
  return (
    <div className="ml-12 mt-1 text-sm text-muted-foreground border-l-2 pl-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className="py-1"
          style={{ display: step.status === 'waiting' ? 'none' : 'block' }}
        >
          {step.status === 'loading' && (
            <p className="animate-pulse">
              {step.description}
              <LoadingDots />
            </p>
          )}

          {step.status === 'completed' && (
            <p className="font-medium flex items-center">
              {step.result || step.description + ' - Complete'}
              {step.result_type === 'issue_detected' ? (
                <AlertIcon className="ml-2 size-4 text-red-500" />
              ) : step.result_type === 'requires_more_info' ? (
                <BulbIcon className="ml-2 size-4 text-yellow-500" />
              ) : (
                <CheckCircleIcon className="ml-2 size-4 text-green-500" />
              )}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

// Complete component to show when all steps are done
interface AnalysisCompleteProps {
  steps: AnalysisStep[]
}

const AnalysisComplete = ({ steps }: AnalysisCompleteProps) => {
  // Calculate summary of findings based on result_type
  const issuesFound = steps.some(step => step.result_type === 'issue_detected')

  return (
    <div className="ml-12 mt-1 text-sm border-l-2 pl-3 space-y-2 animate-in fade-in duration-200">
      {steps.map(step => (
        <div key={step.id} className="py-1">
          <p className="font-medium flex items-center">
            {step.result || step.description + ' - Complete'}
            {step.result_type === 'issue_detected' ? (
              <AlertIcon className="ml-2 size-4 text-red-500" />
            ) : step.result_type === 'requires_more_info' ? (
              <BulbIcon className="ml-2 size-4 text-yellow-500" />
            ) : (
              <CheckCircleIcon className="ml-2 size-4 text-green-500" />
            )}
          </p>
        </div>
      ))}

      <div className="font-medium mt-4 p-2 pl-3 pr-4 bg-muted w-fit rounded-lg">
        <p className="text-base font-semibold flex items-center">
          <span className="mr-auto">Analysis Complete</span>
          {issuesFound ? (
            <AlertIcon className="ml-2 size-5 text-red-500" />
          ) : (
            <CheckCircleIcon className="ml-2 size-5 text-green-500" />
          )}
        </p>
        <p className="text-muted-foreground">
          {issuesFound
            ? 'Found potential design issues that need attention.'
            : 'All specifications meet required standards.'}
        </p>
      </div>
    </div>
  )
}

// Main component that manages state
export const AnalyzingChangesExample = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [steps, setSteps] = useState<AnalysisStep[]>([
    {
      id: 'spec_sheet',
      description: 'Analyzing new version of specification sheet',
      isLoading: true,
      result: 'Specification sheet review complete',
      duration: 1200,
      status: 'waiting',
      result_type: 'looks_fine'
    },
    {
      id: 'retrieve',
      description: 'Retrieving related documents',
      isLoading: true,
      result: 'Retrieved 8 related documents',
      duration: 1500,
      status: 'waiting',
      result_type: 'looks_fine'
    },
    {
      id: 'compliance',
      description: 'Checking compliance with ASME BPVC section',
      isLoading: true,
      result: 'General compliance verified with ASME BPVC Section VIII Div. 1',
      duration: 1700,
      status: 'waiting',
      result_type: 'looks_fine'
    },
    {
      id: 'thickness_calc',
      description: 'Performing calculations to check required vessel thickness',
      isLoading: true,
      result: 'Thickness calculations completed using UG-27 and UG-28',
      duration: 2000,
      status: 'waiting',
      result_type: 'requires_more_info'
    },
    {
      id: 'thickness_issue',
      description: 'Detected potential issue with shell thickness',
      isLoading: true,
      result:
        'Shell thickness of 3/8" (0.375") is insufficient for 50 psig at 650 °F + Full Vacuum',
      duration: 1600,
      status: 'waiting',
      result_type: 'issue_detected'
    },
    {
      id: 'related_designs',
      description: 'Finding related designs to check current designs',
      isLoading: true,
      result: 'Found 3 related pressure vessel designs for reference',
      duration: 1800,
      status: 'waiting',
      result_type: 'looks_fine'
    },
    {
      id: 'nozzle_check',
      description: 'Checking nozzle placement is compliant with ASME',
      isLoading: true,
      result:
        'Manway reinforcement pad (1/4" × 2") undersized for 20" opening per UG-37',
      duration: 1500,
      status: 'waiting',
      result_type: 'issue_detected'
    }
  ])

  // Use useRef for the current step index to avoid closure issues
  const currentStepIndexRef = useRef(0)

  // Check if all steps are complete
  const checkIfComplete = (stepsToCheck: AnalysisStep[]) => {
    return stepsToCheck.every(step => step.status === 'completed')
  }

  // Check if any issues were found
  const hasIssues = steps.some(step => step.result_type === 'issue_detected')

  // Simulate the analysis process when expanded
  useEffect(() => {
    if (isExpanded) {
      // Only reset if not already complete
      if (!isComplete) {
        // Reset the step index and completion state when expanded
        currentStepIndexRef.current = 0

        // Reset all steps to waiting
        setSteps(prevSteps =>
          prevSteps.map(step => ({ ...step, status: 'waiting' }))
        )

        // Function to process a step
        const processStep = (index: number) => {
          if (index >= steps.length) return

          // Set the current step to loading without changing the status of completed steps
          setSteps(prevSteps => {
            const newSteps = [...prevSteps]
            // Set just this step to loading, leaving others as they are
            if (index < newSteps.length) {
              newSteps[index].status = 'loading'
            }
            return newSteps
          })

          // After the duration, complete this step and move to the next
          setTimeout(() => {
            setSteps(prevSteps => {
              const newSteps = [...prevSteps]
              if (index < newSteps.length) {
                newSteps[index].status = 'completed'
              }

              // Check if all steps are now complete
              if (index === steps.length - 1) {
                setTimeout(() => setIsComplete(true), 500)
              }

              return newSteps
            })

            // Process the next step
            currentStepIndexRef.current = index + 1
            if (index + 1 < steps.length) {
              processStep(index + 1)
            }
          }, steps[index].duration)
        }

        // Start with the first step
        processStep(0)
      }
    }

    // Cleanup function
    return () => {
      // Only reset the index counter, not the completion state
      currentStepIndexRef.current = 0
    }
  }, [isExpanded, steps.length, isComplete])

  return (
    <div className="rounded-lg w-full border p-4 flex flex-col gap-2">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="gap-2 flex items-center">
          {!isComplete ? (
            <Loader className="size-7" />
          ) : hasIssues ? (
            <AlertIcon className="size-7 text-red-500" />
          ) : (
            <CheckCircleIcon className="size-7 text-green-500" />
          )}
          <span className="ml-2 flex items-center gap-2">
            {isComplete ? (
              <>
                <span>
                  <span className="font-bold">Cooper</span> found 2 potential
                  design issues in the{' '}
                </span>
                <FileReference filename="Pressure Vessel Design.pdf" />
              </>
            ) : (
              <>
                <span className="font-bold">Cooper</span> is analyzing project
                files for potential errors...
              </>
            )}
          </span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label={isExpanded ? 'Close reasoning' : 'View reasoning'}
        >
          {isExpanded ? (
            <>
              <XIcon className="size-4" />
              Close Reasoning
            </>
          ) : (
            <>
              <BulbIcon className="size-4" />
              View Reasoning
            </>
          )}
        </Button>
      </div>

      {isExpanded &&
        (isComplete ? (
          <AnalysisComplete steps={steps} />
        ) : (
          <AnalysisLoading steps={steps} />
        ))}
    </div>
  )
}
