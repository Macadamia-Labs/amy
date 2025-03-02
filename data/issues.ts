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
    id: 'PIP-1',
    title: 'Mismatch in required UPW flow rate for micro saw E-007',
    description:
      '- Micro-saw E-007 from supplier A requires an Ultra-Pure-Water (UPW) supply for processing of the semiconductor chips.\n - The equipment manual from supplier A in South Korea specifies 3.9 L/min of UPW supply required. \n - However, I found an email exchange between Supplier A and Sr. Process Engineer Thomas on 11/1/2024 that mentions that SpaceX micro saw requires 12.5 L/min.',
    status: 'open',
    priority: 'critical',
    category: 'Design',
    location: 'Building A - Mechanical Room 2',
    assignedEngineer: {
      id: 'eng-3',
      name: 'Brecht Pierreux',
      title: 'Sr. Process Engineer',
      specialty: 'Starlink Silicon Packaging',
      email: 't.wilson@example.com'
    },
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-11'),
    proposedSolution:
      'Sr. Process Engineer Thomas has left the company on Jan 1, 2025. I could not retrieve any further documentation clarifying the required flow rate. Therefore, required UPW flow rate should be confirmed with Mr. Chung from micro saw supplier A in South Korea (chung@supplier.com).',
    resources: mapResourceIds(['manual-micro-saw', 'email-micro-saw']),
    comments: [
      {
        id: 'comment-1',
        content:
          "I have contacted Mr. Chung to double check ASAP the required flow rate. Will update the team once I received his response. ",
        author: {
          id: 'eng-3',
          name: 'Brecht Pierreux',
          title: 'Starlink Engineer',
          specialty: 'Process Piping',
          email: 'm.chang@example.com'
        },
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    ]
  }, 
  {
    id: 'PIP-2',
    title: 'Critical flow velocity issue in UPW piping construction drawing',
    description:
      'Based on the updated flow rate, I have identified a critical issue in the construction drawing from Contractor B. The drawing specifies a ½" diameter pipe, which was originally sized for 4.1 GPM. However, the revised flow rate of 13 GPM through a ½" pipe results in an excessively high flow velocity of 13.73 ft/s, which exceeds recommended design limits.\n\n' +
      'The velocity ($V$) in a pipe is given by:\n\n' +
      '$V = \\frac{Q}{A}$\n\n' +
      'where:\n\n' +
      '• $Q$ = Flow rate (ft³/s)\n' +
      '  $13 \\text{ GPM} \\times 0.002228 = 0.02896 \\text{ ft}^3/\\text{s}$\n\n' +
      '• $A$ = Cross-sectional area (ft²)\n' +
      '  $A = \\pi \\times (\\frac{\\text{ID}}{2})^2$\n\n' +
      'For a ½" Schedule 40 PVC pipe, the inside diameter (ID) is 0.622 inches or 0.05183 feet, so:\n\n' +
      '$A = \\pi \\times (0.05183/2)^2 = \\pi \\times (0.025915)^2 = 0.00211 \\text{ ft}^2$\n\n' +
      'Thus, the velocity:\n\n' +
      '$V = \\frac{0.02896}{0.00211} \\approx 13.73 \\text{ ft/s}$\n\n' +
      'According to ASME B31.3 - Process Piping Code and the technical Datasheet from the pipe supplier, flow velocity should be carefully managed to avoid excessive pressure drop and surge effects, particularly in PVC piping systems, where high velocities can induce cavitation, turbulence, and potential structural fatigue. The recommended flow velocity should be less than 5 ft/s to avoid surge pressure issues (water hammer), which could lead to pipe failure.',
    status: 'open',
    priority: 'critical',
    category: 'Design',
    location: 'Building A - Mechanical Room 2',
    assignedEngineer: {
      id: 'eng-3',
      name: 'Brecht Pierreux',
      title: 'Sr. Process Engineer',
      specialty: 'Starlink Silicon Packaging',
      email: 't.wilson@example.com'
    },
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-11'),
    proposedSolution:
      'To ensure system reliability and compliance with structural guidelines, a 1" pipe is required as a replacement. This will reduce the flow velocity to a safe level below 5 ft/s.\n\n' +
      '**New Pipe Size (1" Pipe)**\n\n' +
      '• Inside Diameter: 1.049 inches = 0.08742 ft\n\n' +
      '• Cross-sectional Area:\n' +
      '  $A = \\pi \\times \\left(\\frac{0.08742}{2}\\right)^2 = 0.006 \\text{ ft}^2$\n\n' +
      '• Velocity Calculation:\n' +
      '  $V = \\frac{0.02896}{0.006} = 4.83 \\text{ ft/s} \\quad \\text{(Acceptable)}$\n\n' +
      'By switching to a 1" pipe, the system will:\n' +
      '- Maintain flow velocity within safe operating limits (<5 ft/s)\n' +
      '- Reduce pressure losses and prevent excessive turbulence\n' +
      '- Improve system longevity and reliability\n\n' +
      'Action Plan\n\n' +
      '- 1️⃣ Contact Contractor B to revise the construction drawings\n' +
      '- 2️⃣ Notify Constructor C to order new pipe size and adjust cost estimates accordingly\n',
    resources: mapResourceIds(['technical-drawing', 'datasheet-upw', 'asme-b31-3']),
    comments: [
      {
        id: 'comment-1',
        content:
          "I sent a note to Contractor B. Once they confirm the new pipe size, I will update the construction guys to order the new pipe materia. Lead time is 1 week.",
        author: {
          id: 'eng-3',
          name: 'Brecht Pierreux',
          title: 'Senior Piping Engineer',
          specialty: 'Process Piping',
          email: 'm.chang@example.com'
        },
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    ]
  }
]
