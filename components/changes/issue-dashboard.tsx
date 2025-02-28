'use client'

import { Card, CardContent } from '../ui/card'

interface StatCardProps {
  count: number
  label: string
  color: string
}

function StatCard({ count, label, color }: StatCardProps) {
  return (
    <Card className={`border-0 ${color} rounded-lg`}>
      <CardContent className="flex flex-col items-center justify-center p-6">
        <span className="text-5xl font-semibold">{count}</span>
        <span className="text-base mt-1">{label}</span>
      </CardContent>
    </Card>
  )
}

export function IssueDashboard() {
  return (
    <div className="mb-8">
      <Card className="border rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold py-4 text-center">Issues</h2>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <StatCard 
              count={3} 
              label="Open Issues" 
              color="bg-blue-50"
            />
            <StatCard 
              count={3} 
              label="In Progress" 
              color="bg-amber-50"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <StatCard 
              count={5} 
              label="Resolved Issues" 
              color="bg-green-50"
            />
            <StatCard 
              count={2} 
              label="Affected Workflows" 
              color="bg-purple-50"
            />
          </div>
        </div>
      </Card>
    </div>
  )
} 