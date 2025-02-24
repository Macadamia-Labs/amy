import { Issue } from '@/lib/types'
import { defaultResources } from './resources'

const mapResourceIds = (ids: string[]) =>
  ids
    .map(id => defaultResources.find(resource => resource.id === id))
    .filter(
      (resource): resource is NonNullable<typeof resource> =>
        resource !== undefined
    )

export const sampleIssues: Issue[] = [
  {
    id: '1',
    title: 'Shell Thickness Insufficient for 50 psig at 650 °F + Full Vacuum',
    description:
      'The drawings list a 3/8" nominal shell for a vessel that must handle 50 psig at an elevated temperature of 650 °F, plus an external design of full vacuum. By checking allowable stress (S) for SA-516 Gr.70 at 650 °F (ASME BPVC II-D) and then applying the formula in UG-27 (ASME BPVC VIII DIV 1) for internal pressure, it becomes clear that 0.375" does not provide the necessary margin once you add the corrosion allowance (0.0625") and account for joint efficiency (E).\n\nA simplified example for the cylindrical shell under internal pressure (UG-27(c)(1)):\n\n\\[t_{\\text{internal}} = \\frac{PR}{SE - 0.6P}\\]\n\nWhere:\n- P = 50 psig (design pressure)\n- R = 48 in (vessel radius, 1/2 of 96" OD)\n- S = 17,000 psi (allowable stress at 650 °F for SA-516-70)\n- E = 0.85 to 1.0 (joint efficiency, depending on radiography)\n\nPlugging realistic values indicates the required shell thickness plus corrosion allowance exceeds 0.375". Thus, the shell thickness as drawn fails to meet the minimum code requirement for combined internal pressure and vacuum loading at this temperature.',
    status: 'open',
    priority: 'critical',
    category: 'Construction',
    location: 'Building A - Mechanical Room 2',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-11'),
    proposedSolution:
      'Re-verify the shell and head thickness calculations using the new design pressure of 50 psi according to UG-27. If the current thickness is insufficient, either: 1) Increase the shell and head thickness to meet code requirements, or 2) Reduce the system pressure back to the original 40 psi design pressure if operationally feasible.\n\nFor the nozzle reinforcement per UG-37, verify:\n\n\\[A_{\\text{required}} = t_{\\text{req}} \\times d_{\\text{opening}}\\]\n\nwhere:\n- \\(t_{\\text{req}}\\) = minimum required thickness of the shell for internal pressure (from UG-27)\n- \\(d_{\\text{opening}}\\) = finished diameter of the opening in the shell\n\nThen calculate the area available from:\n1. Excess thickness in the vessel shell\n2. The nozzle wall itself (above that required for nozzle pressure design)\n3. Any added repad or weld buildup\n\nIf \\(A_{\\text{available}} < A_{\\text{required}}\\), you do not meet UG-37 and will need a larger repad, thicker nozzle neck, or other design changes.',
    resources: mapResourceIds(['asme-bpvc-viii-div-1', 'asme-bpvc-ii-d', 'technical-drawing']),
    comments: [
      {
        id: 'comment-1',
        content: 'I reviewed the calculations and agree that the current shell thickness is insufficient. We should proceed with option 1 to increase the shell thickness.',
        author: {
          id: 'eng-2',
          name: 'James Rodriguez',
          title: 'Lead Process Engineer',
          specialty: 'Process Equipment',
          email: 'j.rodriguez@example.com'
        },
        createdAt: new Date('2024-03-11T10:30:00'),
        updatedAt: new Date('2024-03-11T10:30:00')
      },
      {
        id: 'comment-2',
        content: 'Based on the operational requirements, reducing the system pressure is not feasible. We need to proceed with increasing the shell thickness.',
        author: {
          id: 'eng-3',
          name: 'Michael Chang',
          title: 'Senior Piping Engineer',
          specialty: 'Process Piping',
          email: 'm.chang@example.com'
        },
        createdAt: new Date('2024-03-11T14:15:00'),
        updatedAt: new Date('2024-03-11T14:15:00')
      }
    ]
  },
  {
    id: '2',
    title: 'Nozzle Reinforcement Deficiency',
    description:
      "A new 6″ inlet nozzle was added to a pressure vessel shell but the repad or reinforcing calculation was not updated. The nozzle's large size and location near a weld seam make the existing reinforcement insufficient per ASME code requirements (UG‐37 and UG‐40).",
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
    resources: mapResourceIds(['example-file-2', 'asme-bpvc-viii-div-1', ])
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
    resources: mapResourceIds(['asme-b31-3', 'example-file-1'])
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
    resources: mapResourceIds(['example-file-3'])
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
    resources: mapResourceIds(['example-file-1', 'example-file-2'])
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
    resources: mapResourceIds(['example-file-2'])
  }
]
