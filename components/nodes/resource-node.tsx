'use client'

import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { VideoPlayerPanel } from '@/components/video-player-panel'
import {
  IntegrationNodeData,
  ResourceNodeData,
  StandardNodeData
} from '@/lib/types/node-types'
import { AlertIcon, CheckCircleIcon } from '@/lib/utils/icons'
import { Handle, Position } from '@xyflow/react'
import Image from 'next/image'
import { ComponentType, ReactNode, useState } from 'react'

type NodeComponentProps<T> = {
  data: T
  id: string
  type: string
  selected?: boolean
  isConnectable?: boolean
}

interface ResourceNodeContentProps {
  name: string
  description: string
  icon?: ReactNode
  status?: 'pending' | 'running' | 'completed' | 'failed'
  progress?: number
}

// Component for rendering the status icon based on node status
function StatusIcon({
  status
}: {
  status?: 'pending' | 'running' | 'completed' | 'failed'
}) {
  switch (status) {
    case 'completed':
      return <CheckCircleIcon className="size-5 text-green-500" />
    case 'running':
      return null
    case 'failed':
      return <AlertIcon className="size-5 text-red-500" />
    default:
      return null
  }
}

function ResourceNodeContent({
  name,
  description,
  icon,
  status = 'pending',
  progress = 0
}: ResourceNodeContentProps) {
  return (
    <Card className="border p-4 pr-6">
      <div className="flex gap-4 items-center">
        {icon || (
          <div className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center">
            <span className="text-lg font-semibold">{name.charAt(0)}</span>
          </div>
        )}
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium mr-4">{name}</span>
            <StatusIcon status={status} />
          </div>
          <span className="text-sm text-muted-foreground">{description}</span>
          {/* Progress bar */}
          {status === 'running' && (
            <Progress
              value={progress}
              className="h-1 mt-2 transition-progress"
            />
          )}
        </div>
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </Card>
  )
}

export const ResourceNode: ComponentType<
  NodeComponentProps<ResourceNodeData>
> = ({ data }) => {
  if (data.type !== 'resource') return null

  return (
    <ResourceNodeContent
      name={data.name}
      description={data.description}
      status={data.status}
      progress={data.progress}
    />
  )
}

export const StandardNode: ComponentType<
  NodeComponentProps<StandardNodeData>
> = ({ data }) => {
  if (data.type !== 'standard') return null

  return (
    <ResourceNodeContent
      name={`${data.name}`}
      description={data.description}
      status={data.status}
      progress={data.progress}
    />
  )
}

export const IntegrationNode: ComponentType<
  NodeComponentProps<IntegrationNodeData>
> = ({ data }) => {
  if (data.type !== 'integration') return null
  
  const [videoDialogOpen, setVideoDialogOpen] = useState(false)
  
  // Check if this is the Animation node
  const isAnimationNode = data.name === 'FEA Animation' && data.description === 'Circumferential stress'
  
  const handleNodeClick = () => {
    if (isAnimationNode) {
      setVideoDialogOpen(true)
    }
  }

  return (
    <>
      <div onClick={handleNodeClick} style={{ cursor: isAnimationNode ? 'pointer' : 'default' }}>
        <ResourceNodeContent
          name={data.name}
          description={data.description}
          status={data.status}
          progress={data.progress}
          icon={
            <Image
              src={data.integration.logoSrc}
              alt={data.integration.type}
              width={36}
              height={36}
            />
          }
        />
      </div>
      
      {isAnimationNode && (
        <VideoPlayerPanel
          isOpen={videoDialogOpen}
          onOpenChange={setVideoDialogOpen}
          videoPath="/demo/animation/tank.mp4"
          title="Circumferential Stress Animation"
        />
      )}
    </>
  )
}
