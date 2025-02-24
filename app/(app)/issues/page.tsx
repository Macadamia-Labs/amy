'use client'

import { IssueCard } from '@/components/issues/issue-card'
import { IssueTable } from '@/components/issues/issue-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Issue } from '@/lib/types'
import { LayoutGridIcon, TableIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

// Sample data for demonstration
const sampleIssues: Issue[] = [
  {
    id: '1',
    title: 'Shell Thickness Underrated for Internal Pressure',
    description:
      'During the design revision on 2/23/2025, the vessel’s design pressure was increased (from 40 psi to 50 psi). The shell and heads were not re‐verified with the new pressure. UUnder UG‐27 of the ASME Boiler & Pressure Vessel Code (BPVC), Section VIII, Division 1, the required thickness may now exceed what was initially specified.',
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
        code: 'ASME BPVC VIII-1',
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
    title: 'Nozzle Reinforcement Deficiency',
    description:
      'A new 6″ inlet nozzle was added to a pressure vessel shell but the repad or reinforcing calculation was not updated. The nozzle’s large size and location near a weld seam make the existing reinforcement insufficient per ASME code requirements (UG‐37 and UG‐40).',
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
    title: 'Flow Rate/Pressure Mismatch in Piping (ASME B31.3)',
    description:
      'A secondary cooling loop is specified to flow at 180 L/min (exceeding the original design of 150 L/min), causing the piping velocity and internal pressure to exceed what the line was originally designed to handle under ASME B31.3. This can lead to excessive pressure drop, possible water hammer, or insufficient pipe wall thickness.',
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
              <Link key={issue.id} href={`/issues/${issue.id}`}>
                <IssueCard issue={issue} />
              </Link>
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
