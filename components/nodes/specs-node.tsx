'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CADNodeProps } from '@/lib/types/node-types'
import { Handle, Position } from '@xyflow/react'
import { AlertCircle, CheckCircle, Clock, Loader2 } from 'lucide-react'

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

export function SpecsNode({ data }: CADNodeProps) {
  if (data.type !== 'specs') return null

  return (
    <Card className="w-[300px] border">
      <CardHeader className="bg-purple-500/50 rounded pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{data.label}</CardTitle>
          <StatusIcon status={data.status} />
        </div>
        {data.status === 'running' && (
          <Progress value={data.progress} className="h-1 mt-2" />
        )}
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="space-y-1">
            <span className="text-sm font-medium">Requirements:</span>
            {data.requirements.map((req, index) => (
              <div key={index} className="text-sm pl-2">
                • {req}
              </div>
            ))}
          </div>
          {Object.keys(data.constraints).length > 0 && (
            <div className="space-y-1">
              <span className="text-sm font-medium">Constraints:</span>
              {Object.entries(data.constraints).map(([key, value]) => (
                <div key={key} className="text-sm pl-2">
                  {key}: {value}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </Card>
  )
}
