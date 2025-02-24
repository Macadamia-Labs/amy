"use client";

import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CADNodeProps } from "@/types/node-types";

export function SpecsNode({ data }: CADNodeProps) {
  if (data.type !== "specs") return null;

  return (
    <Card className="w-[300px] border-none">
      <CardHeader className="bg-purple-500/50 rounded">
        <CardTitle className="text-sm font-medium">{data.label}</CardTitle>
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
          <div className="space-y-1">
            <span className="text-sm font-medium">Constraints:</span>
            {Object.entries(data.constraints).map(([key, value]) => (
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
  );
}
