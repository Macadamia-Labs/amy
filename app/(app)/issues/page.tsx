'use client'

import { IssueCard } from '@/components/issues/issue-card'
import { IssueTable } from '@/components/issues/issue-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Issue } from '@/lib/types'
import { LayoutGridIcon, TableIcon } from 'lucide-react'
import { useState } from 'react'

// Sample data for demonstration
const sampleIssues: Issue[] = [
  {
    id: '1',
    title: 'Pipe Flow Rate Mismatch with Heat Exchanger',
    description:
      'Flow rate in secondary cooling loop exceeds heat exchanger specifications, causing pressure buildup in section P-103',
    status: 'open',
    priority: 'critical',
    category: 'Construction',
    location: 'Building A - Mechanical Room 2',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-11'),
    resources: [
      {
        id: 'pipe-1',
        name: 'Secondary Loop Flow',
        type: 'Equipment',
        category: 'Construction',
        usage: 180,
        total: 150,
        unit: 'L/min'
      },
      {
        id: 'pressure-1',
        name: 'System Pressure',
        type: 'Equipment',
        category: 'Construction',
        usage: 4.2,
        total: 5.0,
        unit: 'bar'
      }
    ],
    standards: [
      {
        id: 'std-1',
        code: 'ASME B31.3',
        name: 'Process Piping',
        category: 'ASME',
        description: 'Standards for process piping design and construction',
        lastUpdated: new Date('2023-06-15'),
        relevantSections: [
          'Chapter IX - Fluid Flow',
          'Section 301.5.2 - Design Pressure'
        ]
      }
    ],
    documents: [
      {
        id: 'doc-1',
        type: 'Drawing',
        title: 'Piping & Instrumentation Diagram',
        fileUrl: '/docs/pid-cooling-system.pdf',
        version: '2.3',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-03-10'),
        status: 'approved'
      },
      {
        id: 'doc-2',
        type: 'Simulation',
        title: 'CFD Analysis Results',
        fileUrl: '/docs/cfd-analysis.pdf',
        version: '1.0',
        createdAt: new Date('2024-03-10'),
        updatedAt: new Date('2024-03-11'),
        status: 'review'
      }
    ]
  },
  {
    id: '2',
    title: 'Structural Load Distribution Anomaly',
    description:
      'Steel beam deflection exceeds calculated values at grid intersection B-4, potential design revision needed',
    status: 'in_progress',
    priority: 'high',
    category: 'Construction',
    location: 'Tower 2 - Floor 15 - Grid B-4',
    createdAt: new Date('2024-03-11'),
    updatedAt: new Date('2024-03-11'),
    resources: [
      {
        id: 'load-1',
        name: 'Beam Load',
        type: 'Material',
        category: 'Construction',
        usage: 75,
        total: 85,
        unit: 'kN/m'
      },
      {
        id: 'deflection-1',
        name: 'Beam Deflection',
        type: 'Material',
        category: 'Construction',
        usage: 42,
        total: 35,
        unit: 'mm'
      }
    ],
    standards: [
      {
        id: 'std-2',
        code: 'AISC 360-16',
        name: 'Specification for Structural Steel Buildings',
        category: 'Other',
        description: 'Steel construction specifications',
        lastUpdated: new Date('2023-08-20'),
        relevantSections: [
          'Chapter L - Serviceability Design',
          'Section B3.7 - Analysis Methods'
        ]
      }
    ],
    documents: [
      {
        id: 'doc-3',
        type: 'Drawing',
        title: 'Structural Steel Details',
        fileUrl: '/docs/structural-details.pdf',
        version: '3.2',
        createdAt: new Date('2023-12-15'),
        updatedAt: new Date('2024-01-20'),
        status: 'approved'
      },
      {
        id: 'doc-4',
        type: 'Simulation',
        title: 'FEA Load Analysis',
        fileUrl: '/docs/fea-analysis.pdf',
        version: '2.1',
        createdAt: new Date('2024-03-11'),
        updatedAt: new Date('2024-03-11'),
        status: 'review'
      }
    ]
  },
  {
    id: '3',
    title: 'HVAC Ductwork Size Conflict',
    description:
      'Main supply duct cross-section insufficient for specified airflow, causing excessive velocity and noise',
    status: 'in_progress',
    priority: 'high',
    category: 'Construction',
    location: 'Building B - Floor 3 - Ceiling Plenum',
    createdAt: new Date('2024-03-09'),
    updatedAt: new Date('2024-03-10'),
    resources: [
      {
        id: 'airflow-1',
        name: 'Supply Air Flow',
        type: 'Equipment',
        category: 'Construction',
        usage: 2200,
        total: 1800,
        unit: 'CFM'
      },
      {
        id: 'velocity-1',
        name: 'Air Velocity',
        type: 'Equipment',
        category: 'Construction',
        usage: 1200,
        total: 1000,
        unit: 'FPM'
      }
    ],
    standards: [
      {
        id: 'std-3',
        code: 'ASHRAE 90.1',
        name: 'Energy Standard for Buildings',
        category: 'Other',
        description: 'HVAC design and energy efficiency standards',
        lastUpdated: new Date('2023-09-15'),
        relevantSections: [
          'Section 6.5.3 - Air System Design',
          'Table 6.5.3.1-1'
        ]
      }
    ],
    documents: [
      {
        id: 'doc-5',
        type: 'Drawing',
        title: 'HVAC Layout Plan',
        fileUrl: '/docs/hvac-layout.pdf',
        version: '2.0',
        createdAt: new Date('2024-03-08'),
        updatedAt: new Date('2024-03-10'),
        status: 'approved'
      },
      {
        id: 'doc-6',
        type: 'Simulation',
        title: 'Airflow Analysis Report',
        fileUrl: '/docs/airflow-simulation.pdf',
        version: '1.1',
        createdAt: new Date('2024-03-10'),
        updatedAt: new Date('2024-03-10'),
        status: 'review'
      }
    ]
  }
]

export default function Page() {
  const [view, setView] = useState<'grid' | 'table'>('grid')

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Issues</h1>
        <p className="text-muted-foreground">
          Monitor design conflicts, specification mismatches, and technical
          compliance
        </p>
      </div>

      <Tabs
        value={view}
        onValueChange={value => setView(value as 'grid' | 'table')}
        className="mb-4"
      >
        <TabsList>
          <TabsTrigger value="grid" className="flex items-center gap-2">
            <LayoutGridIcon className="h-4 w-4" />
            Grid View
          </TabsTrigger>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <TableIcon className="h-4 w-4" />
            Table View
          </TabsTrigger>
        </TabsList>
        <TabsContent value="grid" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleIssues.map(issue => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="table" className="mt-4">
          <IssueTable issues={sampleIssues} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
