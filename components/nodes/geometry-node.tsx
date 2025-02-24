"use client";

import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CADNodeProps } from "@/types/node-types";

export function GeometryNode({ data }: CADNodeProps) {
  if (data.type !== "geometry") return null;

  return (
    <Card className="w-[300px] border-none">
      <CardHeader className="bg-green-500/50 rounded">
        <CardTitle className="text-sm font-medium">{data.label}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Shape:</span> {data.shape}
          </div>
          <div className="space-y-1">
            <span className="text-sm font-medium">Dimensions:</span>
            {Object.entries(data.dimensions).map(([key, value]) => (
              <div key={key} className="text-sm pl-2">
                {key}: {value}mm
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </Card>
  );
}
