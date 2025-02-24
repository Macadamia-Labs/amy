'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CADNodeProps } from '@/types/node-types'
import { Handle, Position } from '@xyflow/react'

export function MaterialNode({ data }: CADNodeProps) {
  if (data.type !== 'material') return null

  return (
    <Card className="w-[300px] border">
      <CardHeader className="bg-amber-500/50 rounded">
        <CardTitle className="text-sm font-medium">{data.label}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Material:</span> {data.material}
          </div>
          <div className="space-y-1">
            <span className="text-sm font-medium">Properties:</span>
            {Object.entries(data.properties).map(([key, value]) => (
              <div key={key} className="text-sm pl-2">
                {key}: {value}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </Card>
  )
}
