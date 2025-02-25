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
      'The vessel drawings specify a **3/8"** (0.375") nominal shell for a horizontal pressure vessel intended to operate at **50 psig** and **650 °F**, while also being designed for full vacuum.\n\n1. Internal-Pressure Check (**UG-27**): Using ASME BPVC Section II-D for SA-516 Gr.70 at 650 °F, the allowable stress is approximately **S = 17,000 psi** (exact value to be confirmed). Applying the internal-pressure formula from **UG-27(c)(1)**:\n\n    \\[t_{\\text{internal}} = \\frac{PR}{SE - 0.6P}\\]\n\n    Where:\n    - P = 50 psig (design pressure)\n    - R = 48" (half of 96" OD)\n    - E = joint efficiency\n    - S = allowable stress at 650 °F\n\n    The calculated required thickness (plus **0.0625" corrosion allowance**) slightly exceeds **0.375"** once a realistic joint efficiency (<1.0) is used.\n\n2. External-Pressure (Vacuum) Check (**UG-28**): Under full vacuum, the vessel must also resist external pressure. Preliminary checks using UG-28 or external-pressure charts indicate that **0.375"** could be borderline or insufficient, especially at elevated temperature where creep effects or reduced modulus may also be considerations.\n\nAs a result, the current **3/8"** shell **does not meet** the combined internal and external design thickness required by the code at 650 °F.',
    status: 'open',
    priority: 'critical',
    category: 'Design',
    location: 'Building A - Mechanical Room 2',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-11'),
    proposedSolution:
      '1. **Re-verify Shell and Head Thickness**\n\n    • Recalculate the required shell and head thickness for **50 psig at 650 °F** in strict accordance with **UG-27** (internal pressure) and **UG-28** (external pressure).\n\n    • Confirm the allowable stresses from Section II-D at the specified temperature and ensure that the chosen joint efficiency (E) is correct for your weld examination level.\n\n    • If the calculations confirm that 3/8" is insufficient, then (a) **Increase the Shell and Head Thickness** to meet both internal- and external-pressure requirements, or (b) **Reduce the Design Pressure** (if operationally feasible) back to 40 psig. \n\n2. **Nozzle Reinforcement** (**UG-37**)\n\n    • For each nozzle opening, verify the required reinforcement area:\n    \\[A_{\\text{required}} = t_{\\text{req}} \\times d_{\\text{opening}}\\]\n    where \\(t_{\\text{req}}\\) is the required shell thickness from the internal-pressure calculations (UG-27), and\n    \\(d_{\\text{opening}}\\) is the finished diameter of the nozzle bore.\n\n    • Confirm that the total area available (from shell, nozzle neck, repad, etc.) is ≥ \\(A_{\\text{required}}\\). If not, design a larger repad, use a thicker nozzle neck, or apply another reinforcement method.\n\n3. **Stiffening for Vacuum**\n\n    • If the required thickness to resist vacuum is excessively large, consider **external stiffening rings** or other bracing to handle external pressure, especially for longer cylindrical sections or large diameters.',
    resources: mapResourceIds([
      'asme-bpvc-viii-div-1',
      'asme-bpvc-ii-d',
      'technical-drawing'
    ]),
    comments: [
      {
        id: 'comment-1',
        content: 'We can\’t reduce the pressure to 40 psig given our process needs, so we must go with a thicker shell. I\’ll check nozzle reinforcements per UG‐37. Let\’s finalize calculations and update the fabrication drawings.',
        author: {
          id: 'eng-3',
          name: 'Brecht Pierreux',
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
    title: 'Undersized Manway Reinforcement for 20″ Opening',
    description:
      "The manway (A) is 20″ nominal with only a 1/4″ × 2″ doubler plate shown. This doubler area is insufficient to replace the shell material removed by the large nozzle hole. Per UG‑37, reinforcement around large openings must at least match the area $A_{required} = t_{req} \\times d_{hole} \\times F$. Given the 3/8″ nominal shell (plus corrosion allowance) and the wide diameter of the manway cut, the repad or doubler ring needs more cross-sectional area than 1/4″ × 2″ provides.",
    status: 'in_progress',
    priority: 'high',
    category: 'Calculation',
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
    resources: mapResourceIds(['example-file-2', 'asme-bpvc-viii-div-1', 'technical-drawing'])
  },
  {
    id: '3',
    title: 'Flow Rate Mismatch in Piping (ASME B31.3)',
    description:
      'A secondary cooling loop is specified to flow at **180 L/min** (exceeding the original design of **150 L/min**), causing the piping velocity and internal pressure to exceed what the line was originally designed to handle under **ASME B31.3**. This can lead to **excessive pressure drop**, possible **water hammer**, or **insufficient pipe wall thickness**.',
    status: 'in_progress',
    priority: 'high',
    category: 'Specification',
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
    resources: mapResourceIds(['asme-b31-3', 'example-file-1', 'technical-drawing'])
  },
  {
    id: '4',
    title: '6″ Inlet Nozzle (B) Missing Required Repad',
    description:
      'The 6″ inlet nozzle (B) on the pressure vessel is shown without a reinforcement pad (repad). Per ASME BPVC Section VIII Div. 1 UG-37, this large opening requires reinforcement to compensate for the material removed from the shell. Calculations show that the current design without a repad results in excessive stress concentrations around the nozzle-to-shell junction. The nozzle wall thickness alone is insufficient to provide the required area replacement. This violates code requirements and creates a potential failure point under design pressure conditions.',
    status: 'open',
    priority: 'critical',
    category: 'Safety',
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
    resources: mapResourceIds(['example-file-3', 'asme-bpvc-viii-div-1']),
    proposedSolution:
      'To address the missing reinforcement pad for the 6″ inlet nozzle (B), the following actions are recommended:\n\n1. **Add Reinforcement Pad**:\n   - Design a properly sized reinforcement pad according to ASME BPVC Section VIII Div. 1 UG-37\n   - Calculate the required reinforcement area based on the formula: A_required = d × t_r × F\n   - Ensure the repad extends sufficiently beyond the nozzle opening (minimum 2.5√(D×t) or 2.5t, whichever is greater)\n\n2. **Verify Weld Design**:\n   - Specify appropriate weld sizes for both the nozzle-to-shell and repad-to-shell connections\n   - Ensure full penetration welds where required by code\n   - Include proper weld details on the fabrication drawings\n\n3. **Update Calculations**:\n   - Document the area replacement calculations per UG-37\n   - Verify that the combined reinforcement from the nozzle wall, repad, and shell meets or exceeds the required area\n   - Include the calculations in the vessel documentation package\n\n4. **Revise Drawings**:\n   - Update the vessel fabrication drawings to show the added reinforcement pad\n   - Include material specifications, dimensions, and weld details\n   - Ensure the drawing revisions are properly documented and controlled'
  },
  {
    id: '5',
    title: 'Support Saddles Underdesigned for Large Wind Uplift and Seismic',
    description:
      'Wind speed is 160 mph (ASCE 7‑22), Risk Category III, and seismic conditions are also noted. Yet the saddle drawings do not show adequate anchor bolt quantity or size to handle the high overturning moment and shear. The welds between saddle and shell appear minimal for a 96″ diameter vessel subject to both wind and vacuum loads. Standard "Zick\'s Analysis" or a recognized method would show that these saddles and welds are too small.',
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
    resources: mapResourceIds(['asce-7-22', 'asme-bpvc-viii-div-1']),
    proposedSolution:
      'The saddle design needs to be revised to account for the high wind loads (160 mph per ASCE 7-22) and seismic conditions. The following improvements are required:\n\n1. **Increase Anchor Bolt Quantity and Size**:\n   - Calculate the overturning moment based on the 160 mph wind speed and Risk Category III\n   - Determine appropriate anchor bolt size and quantity to resist both tension and shear\n   - Ensure proper embedment depth and edge distance for concrete foundation\n\n2. **Strengthen Saddle-to-Shell Welds**:\n   - Perform a detailed stress analysis of the saddle-to-shell connection\n   - Increase weld size to handle the combined stresses from wind, seismic, and vacuum loads\n   - Consider adding reinforcement plates at high-stress areas\n\n3. **Perform Zick\'s Analysis**:\n   - Conduct a comprehensive Zick\'s Analysis to verify saddle design adequacy\n   - Ensure the design accounts for both longitudinal and circumferential stresses\n   - Verify that the saddle design meets ASME BPVC Section VIII requirements'
  },
  {
    id: '6',
    title: 'Lifting Lug Fillet Weld Too Small for Vessel Weight',
    description:
      'The lifting lug detail (3/8″ and 1/2″ plates) shows a fillet weld size that is insufficient for the vessel\'s dry weight (~11,426 lbs) plus dynamic load factors. When lifted, the lug and the lug-to-shell weld experience combined shear and tension. The drawn weld thickness (e.g., ~1/4″ fillet) does not satisfy the stress requirements in UG‑22 or typical lug design rules (Appendix L or custom calcs).',
    status: 'in_progress',
    priority: 'critical',
    category: 'Maintenance',
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
    resources: mapResourceIds(['asme-bpvc-viii-div-1', 'technical-drawing'])
  }
]
