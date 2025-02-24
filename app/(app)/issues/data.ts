import { Issue } from '@/lib/types'

export const sampleIssues: Issue[] = [
  {
    id: '1',
    title: 'Undersized Shell Thickness for 50 psig at 650 °F + Full Vacuum',
    description:
      'The drawings list a 3/8" nominal shell for a vessel that must handle 50 psig at an elevated temperature of 650 °F, plus an external design of full vacuum. By checking allowable stress (S) for SA-516 Gr.70 at 650 °F (ASME II-D) and then applying the formula in UG-27 for internal pressure, it becomes clear that 0.375" does not provide the necessary margin once you add the corrosion allowance (0.0625") and account for joint efficiency (E).\n\nA simplified example for the cylindrical shell under internal pressure (UG-27(c)(1)):\n\n\\[t_{\\text{internal}} = \\frac{P \\times R}{S \\times E - 0.6P}\\]\n\nWhere:\n• Design pressure P = 50 psig\n• Shell radius R = 48 in (1/2 of 96" OD, ignoring small differences for ID)\n• Allowable stress S at 650 °F for SA-516-70 < room temperature value; typical reduced stress might be ~17,000 psi\n• Joint efficiency E = 1.0 for fully radiographed welds; 0.85 or 0.90 otherwise\n\nPlugging realistic values indicates the required shell thickness plus corrosion allowance exceeds 0.375". Thus, the shell thickness as drawn fails to meet the minimum code requirement for combined internal pressure and vacuum loading at this temperature.',
    status: 'open',
    priority: 'critical',
    category: 'Construction',
    location: 'Building A - Mechanical Room 2',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-11'),
    proposedSolution:
      'Re-verify the shell and head thickness calculations using the new design pressure of 50 psi according to UG-27. If the current thickness is insufficient, either: 1) Increase the shell and head thickness to meet code requirements, or 2) Reduce the system pressure back to the original 40 psi design pressure if operationally feasible.\n\nFor the nozzle reinforcement per UG-37, verify:\n\n\\[A_{\\text{required}} = t_{\\text{req}} \\times d_{\\text{opening}}\\]\n\nwhere:\n- \\(t_{\\text{req}}\\) = minimum required thickness of the shell for internal pressure (from UG-27)\n- \\(d_{\\text{opening}}\\) = finished diameter of the opening in the shell\n\nThen calculate the area available from:\n1. Excess thickness in the vessel shell\n2. The nozzle wall itself (above that required for nozzle pressure design)\n3. Any added repad or weld buildup\n\nIf \\(A_{\\text{available}} < A_{\\text{required}}\\), you do not meet UG-37 and will need a larger repad, thicker nozzle neck, or other design changes.',
    resources: [
      {
        id: 'pipe-1',
        title: 'Secondary Loop Flow',
        category: 'Construction',
        description: 'Secondary loop flow rate',
        file_path: '/resources/secondary-loop-flow.pdf',
        user_id: '1',
        created_at: '2024-03-10',
        origin: 'drive'
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
    ],
    severity: 'high'
  }
]
