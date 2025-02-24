'use client'

import { Card } from '@/components/ui/card'
import {
  IntegrationNodeData,
  ResourceNodeData,
  StandardNodeData
} from '@/lib/types/node-types'
import { Handle, Position } from '@xyflow/react'
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
}

function ResourceNodeContent({
  name,
  description,
  icon
}: ResourceNodeContentProps) {
  return (
    <Card className="border p-4 pr-6">
      <div className="flex gap-4 items-center">
        {icon || (
          <div className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center">
            <span className="text-lg font-semibold">{name.charAt(0)}</span>
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium">{name}</span>
          <span className="text-sm text-muted-foreground">{description}</span>
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

  return <ResourceNodeContent name={data.name} description={data.description} />
}

export const StandardNode: ComponentType<
  NodeComponentProps<StandardNodeData>
> = ({ data }) => {
  if (data.type !== 'standard') return null

  return (
    <ResourceNodeContent
      name={`${data.name}`}
      description={data.description}
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
