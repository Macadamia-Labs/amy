'use client'

import { Card, CardContent } from '../ui/card'

interface ReasoningStep {
  id: string
  description: string
  status: 'in-progress' | 'completed'
}

export function ReasoningStepsPanel() {
  // Example reasoning steps - newest steps should be added at the beginning for top-down display
  const reasoningSteps: ReasoningStep[] = [
    {
      id: '1',
      description: 'Analyzing pressure vessel design against ASME BPVC Section VIII Division 1',
      status: 'completed'
    },
    {
      id: '2',
      description: 'Checking shell thickness calculations using UG-27 formula',
      status: 'completed'
    },
    {
      id: '3',
      description: 'Verifying nozzle reinforcement requirements per UG-37',
      status: 'in-progress'
    }
  ]

  // Calculate a meaningful status text based on the steps
  const completedSteps = reasoningSteps.filter(step => step.status === 'completed').length
  const totalSteps = reasoningSteps.length
  const progressText = `${completedSteps}/${totalSteps} tasks complete`
  const currentTask = reasoningSteps.find(step => step.status === 'in-progress')?.description || 'Analysis complete'

  return (
    <div className="mb-8">
      <Card className="border rounded-lg p-4 h-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold">Status:</h2>
            <span className="ml-2">{progressText}</span>
          </div>
        </div>
        <CardContent className="p-0">
          <div className="space-y-3">
            {reasoningSteps.map((step) => (
              <div key={step.id} className="flex items-start gap-2">
                <div className={`size-2.5 rounded-full mt-1 ${
                  step.status === 'completed' ? 'bg-green-500' : 'bg-blue-500 animate-pulse'
                }`} />
                <div className="flex-1">
                  <p className="text-sm">
                    {step.description}
                    {step.status === 'in-progress' && (
                      <span className="text-blue-500 ml-2 animate-pulse">in progress...</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 