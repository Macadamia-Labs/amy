'use client'

import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import Loader from './lottie/loader'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { TextShimmer } from './ui/text-shimmer'

type Agent = {
  id: string
  name: string
  status: string
  activity: string[]
}

export default function ActiveAgents() {
  const [open, setOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  // Mock data for the agents
  const agents: Agent[] = [
    {
      id: '1',
      name: 'Agent 1',
      status: 'Processing data...',
      activity: [
        'Initialized data processing pipeline',
        'Fetching source data from API',
        'Cleaning and normalizing data structure',
        'Running data validation checks'
      ]
    },
    {
      id: '2',
      name: 'Agent 2',
      status: 'Running analysis...',
      activity: [
        'Started analysis module',
        'Computing statistical metrics',
        'Generating insights from data patterns',
        'Preparing visualization data'
      ]
    },
    {
      id: '3',
      name: 'Agent 3',
      status: 'Generating report...',
      activity: [
        'Compiling analysis results',
        'Formatting report structure',
        'Adding visualizations and metrics',
        'Preparing final output document'
      ]
    }
  ]

  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(agent)
  }

  const handleBackClick = () => {
    setSelectedAgent(null)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Loader className="size-5" />
          <TextShimmer className="text-sm font-mono">
            {agents.length} Active Agents
          </TextShimmer>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-96">
        <div className="mt-8 flex flex-col gap-4">
          {selectedAgent ? (
            <>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBackClick}
                  className="h-8 w-8"
                >
                  <ArrowLeft className="size-4" />
                </Button>
                <h2 className="text-lg font-semibold">{selectedAgent.name}</h2>
              </div>
              <div className="flex items-center gap-3 rounded-md border p-3 bg-muted/30">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Loader className="size-5" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedAgent.status}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Activity Log</h3>
                <ul className="space-y-2">
                  {selectedAgent.activity.map((activity, index) => (
                    <li
                      key={`activity-${index.toString()}`}
                      className="text-sm border-l-2 border-primary/50 pl-3 py-1"
                    >
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold">Active Agents</h2>
              <div className="space-y-3">
                {agents.map(agent => (
                  <div
                    key={agent.id}
                    className="flex items-center gap-3 rounded-md border p-3 hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => handleAgentClick(agent)}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Loader className="size-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">{agent.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {agent.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
