'use client'

import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  IntegrationNodeData,
  ResourceNodeData,
  StandardNodeData
} from '@/lib/types/node-types'
import { Handle, Position } from '@xyflow/react'
import { AlertCircle, CheckCircle, Clock, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { ComponentType, ReactNode } from 'react'

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
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case 'running':
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
    case 'failed':
      return <AlertCircle className="h-4 w-4 text-red-500" />
    default:
      return <Clock className="h-4 w-4 text-gray-500" />
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
            <span className="text-sm font-medium">{name}</span>
            <StatusIcon status={status} />
          </div>
          <span className="text-sm text-muted-foreground">{description}</span>
          {/* Progress bar */}
          {status === 'running' && (
            <Progress value={progress} className="h-1 mt-2" />
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

  return (
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
  )
}
