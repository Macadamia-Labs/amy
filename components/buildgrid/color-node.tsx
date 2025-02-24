import { Handle, Position } from '@xyflow/react'
import { memo } from 'react'

interface ColorNodeData {
  color: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

interface ColorNodeProps {
  data: ColorNodeData
  isConnectable: boolean
}

export const ColorNode = memo(({ data, isConnectable }: ColorNodeProps) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        onConnect={params => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div>
        Custom Color Picker Node: <strong>{data.color}</strong>
      </div>
      <input
        className="nodrag"
        type="color"
        onChange={data.onChange}
        defaultValue={data.color}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        isConnectable={isConnectable}
      />
    </>
  )
})

ColorNode.displayName = 'ColorNode'
