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
    title: 'Undersized Shell Thickness for 50 psig at 650 °F + Full Vacuum',
    description:
      'The drawings list a **3/8" nominal shell** for a vessel that must handle **50 psig** at an elevated temperature of **650 °F**, plus an **external design of full vacuum**. By checking allowable stress (\\(S\\)) for SA-516 Gr.70 at 650 °F (ASME II-D) and then applying the formula in **UG-27** for internal pressure, it becomes clear that 0.375" does not provide the necessary margin once you add the corrosion allowance (0.0625") and account for joint efficiency (\\(E\\)).\n\nA simplified example for the cylindrical shell under internal pressure (UG-27(c)(1)):\n\n\\[t_{\\text{internal}} = \\frac{P \\times R}{S \\times E - 0.6P}\\]\n\n* \\(P = 50\\) psig\n* \\(R = 48\\) in (1/2 of 96" OD, ignoring small differences for ID)\n* \\(S\\) (allowable at 650 °F for SA-516-70) < the room-temp value; typical reduced stress might be \\(\\sim 17,000\\) psi (for example).\n* \\(E\\) could be 1.0 if fully radiographed; if not, it might be 0.85 or 0.90.\n\nPlugging realistic values indicates the required shell thickness plus corrosion allowance **exceeds 0.375"**. Thus, the shell thickness as drawn **fails to meet the minimum code requirement** for combined internal pressure and vacuum loading at this temperature.',
    status: 'open',
    priority: 'critical',
    category: 'Construction',
    location: 'Building A - Mechanical Room 2',
    assignedEngineer: {
      id: 'eng-1',
      name: 'Dr. Sarah Chen',
      title: 'Senior Mechanical Engineer',
      specialty: 'Pressure Vessels',
      email: 'sarah.chen@example.com'
    },
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
      'A new 6″ inlet nozzle was added to a pressure vessel shell but the repad or reinforcing calculation was not updated. The nozzle\'s large size and location near a weld seam make the existing reinforcement insufficient per ASME code requirements (UG‐37 and UG‐40).',
    status: 'in_progress',
    priority: 'high',
    category: 'Construction',
    location: 'Tower 2 - Floor 15 - Grid B-4',
    assignedEngineer: {
      id: 'eng-2',
      name: 'James Rodriguez',
      title: 'Lead Process Engineer',
      specialty: 'Process Equipment',
      email: 'j.rodriguez@example.com'
    },
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
    title: 'Flow Rate/Pressure Mismatch in Piping (ASME B31.3)',
    description:
      'A secondary cooling loop is specified to flow at 180 L/min (exceeding the original design of 150 L/min), causing the piping velocity and internal pressure to exceed what the line was originally designed to handle under ASME B31.3. This can lead to excessive pressure drop, possible water hammer, or insufficient pipe wall thickness.',
    status: 'in_progress',
    priority: 'high',
    category: 'Construction',
    location: 'Building B - Floor 3 - Ceiling Plenum',
    assignedEngineer: {
      id: 'eng-3',
      name: 'Michael Chang',
      title: 'Senior Piping Engineer',
      specialty: 'Process Piping',
      email: 'm.chang@example.com'
    },
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
  },
  {
    id: '4',
    title: 'Foundation Bearing Capacity Exceedance',
    description:
      'Recent structural modifications have increased the load on foundation pad F-23 by approximately 15%. The geotechnical report indicates the soil bearing capacity is 2500 psf, but current calculations show loads approaching 2800 psf. This exceeds the safety factor requirements in ACI 318-19.',
    status: 'open',
    priority: 'critical',
    category: 'Construction',
    location: 'Building C - Foundation Grid F-23',
    assignedEngineer: {
      id: 'eng-4',
      name: 'Dr. Robert Miller',
      title: 'Senior Structural Engineer',
      specialty: 'Foundations',
      email: 'r.miller@example.com'
    },
    createdAt: new Date('2024-03-12'),
    updatedAt: new Date('2024-03-12'),
    resources: [
      {
        id: 'soil-1',
        name: 'Soil Bearing Pressure',
        type: 'Material',
        category: 'Construction',
        usage: 2800,
        total: 2500,
        unit: 'psf'
      }
    ],
    standards: [
      {
        id: 'std-4',
        code: 'ACI 318-19',
        name: 'Building Code Requirements for Structural Concrete',
        category: 'Other',
        description: 'Concrete design and construction standards',
        lastUpdated: new Date('2023-07-10'),
        relevantSections: [
          'Chapter 13 - Foundations',
          'Section 13.3.1 - Design Strength'
        ]
      }
    ],
    documents: [
      {
        id: 'doc-7',
        type: 'Report',
        title: 'Geotechnical Investigation Report',
        fileUrl: '/docs/geotech-report.pdf',
        version: '1.0',
        createdAt: new Date('2023-11-15'),
        updatedAt: new Date('2023-11-15'),
        status: 'approved'
      }
    ]
  },
  {
    id: '5',
    title: 'Electrical Conduit Clearance Violation',
    description:
      'The installation of new HVAC ductwork has created a clearance conflict with existing electrical conduits. Current spacing is 4 inches, violating NEC Article 110.26 requirement for minimum 6 inches clearance for 600V conductors.',
    status: 'open',
    priority: 'high',
    category: 'Construction',
    location: 'Building A - Floor 4 - Electrical Room',
    assignedEngineer: {
      id: 'eng-5',
      name: 'Emily Martinez',
      title: 'Senior Electrical Engineer',
      specialty: 'Power Distribution',
      email: 'e.martinez@example.com'
    },
    createdAt: new Date('2024-03-13'),
    updatedAt: new Date('2024-03-13'),
    resources: [
      {
        id: 'clearance-1',
        name: 'Conduit Clearance',
        type: 'Other',
        category: 'Construction',
        usage: 4,
        total: 6,
        unit: 'inches'
      }
    ],
    standards: [
      {
        id: 'std-5',
        code: 'NEC 2023',
        name: 'National Electrical Code',
        category: 'Other',
        description: 'Electrical installation requirements',
        lastUpdated: new Date('2023-09-01'),
        relevantSections: [
          'Article 110.26 - Spaces About Electrical Equipment',
          'Table 110.26(A)(1)'
        ]
      }
    ],
    documents: [
      {
        id: 'doc-8',
        type: 'Drawing',
        title: 'Electrical Room Layout',
        fileUrl: '/docs/electrical-layout.pdf',
        version: '2.1',
        createdAt: new Date('2024-02-20'),
        updatedAt: new Date('2024-03-13'),
        status: 'review'
      }
    ]
  },
  {
    id: '6',
    title: 'Lifting Lugs and Rigging Details',
    description:
      'Recent tenant improvement modifications created a new enclosed office space (Room 415) without updating the fire sprinkler layout. Current sprinkler spacing exceeds NFPA 13 requirements for light hazard occupancy maximum protection area per sprinkler.',
    status: 'in_progress',
    priority: 'critical',
    category: 'Construction',
    location: 'Building B - Floor 4 - Room 415',
    assignedEngineer: {
      id: 'eng-6',
      name: 'Thomas Wilson',
      title: 'Fire Protection Engineer',
      specialty: 'Sprinkler Systems',
      email: 't.wilson@example.com'
    },
    createdAt: new Date('2024-03-14'),
    updatedAt: new Date('2024-03-14'),
    resources: [
      {
        id: 'coverage-1',
        name: 'Sprinkler Coverage',
        type: 'Equipment',
        category: 'Construction',
        usage: 180,
        total: 130,
        unit: 'sq-ft'
      }
    ],
    standards: [
      {
        id: 'std-6',
        code: 'NFPA 13',
        name: 'Standard for Installation of Sprinkler Systems',
        category: 'Other',
        description: 'Fire sprinkler system requirements',
        lastUpdated: new Date('2023-12-01'),
        relevantSections: [
          'Chapter 10 - Installation Requirements',
          'Section 10.2.4 - Protection Area Limitations'
        ]
      }
    ],
    documents: [
      {
        id: 'doc-9',
        type: 'Drawing',
        title: 'Fire Protection Plan',
        fileUrl: '/docs/fire-protection.pdf',
        version: '1.2',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-03-14'),
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
