import { Issue } from '@/lib/types'

export const issues: Issue[] = [
  {
    id: '1',
    title: 'Undersized Shell Thickness for 50 psig at 650 °F + Full Vacuum',
    description:
      'The drawings list a **3/8" nominal shell** for a vessel that must handle **50 psig** at an elevated temperature of **650 °F**, plus an **external design of full vacuum**. By checking allowable stress (\\(S\\)) for SA-516 Gr.70 at 650 °F (ASME II-D) and then applying the formula in **UG-27** for internal pressure, it becomes clear that 0.375" does not provide the necessary margin once you add the corrosion allowance (0.0625") and account for joint efficiency (\\(E\\)).',
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
        title: 'Secondary Loop Flow',
        description: 'Flow rate measurement for secondary cooling loop',
        category: 'Construction',
        file_path: '/measurements/flow-rate.pdf',
        user_id: 'user-1',
        created_at: '2024-03-10T00:00:00Z',
        origin: 'matlab',
        status: 'completed'
      },
      {
        id: 'pressure-1',
        title: 'System Pressure',
        description: 'Pressure readings from system sensors',
        category: 'Construction',
        file_path: '/measurements/pressure.pdf',
        user_id: 'user-1',
        created_at: '2024-03-10T00:00:00Z',
        origin: 'matlab',
        status: 'completed'
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
    resources: [
      {
        id: 'load-1',
        title: 'Beam Load',
        description: 'Structural load calculations',
        category: 'Construction',
        file_path: '/calculations/beam-load.pdf',
        user_id: 'user-1',
        created_at: '2024-03-11T00:00:00Z',
        origin: 'matlab',
        status: 'completed'
      },
      {
        id: 'deflection-1',
        title: 'Beam Deflection',
        description: 'Deflection analysis results',
        category: 'Construction',
        file_path: '/calculations/deflection.pdf',
        user_id: 'user-1',
        created_at: '2024-03-11T00:00:00Z',
        origin: 'matlab',
        status: 'completed'
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
        title: 'Supply Air Flow',
        description: 'HVAC supply air flow measurements',
        category: 'Construction',
        file_path: '/measurements/airflow.pdf',
        user_id: 'user-1',
        created_at: '2024-03-09T00:00:00Z',
        origin: 'matlab',
        status: 'completed'
      },
      {
        id: 'velocity-1',
        title: 'Air Velocity',
        description: 'Air velocity measurements in ductwork',
        category: 'Construction',
        file_path: '/measurements/velocity.pdf',
        user_id: 'user-1',
        created_at: '2024-03-09T00:00:00Z',
        origin: 'matlab',
        status: 'completed'
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
        title: 'Soil Bearing Pressure',
        description: 'Geotechnical analysis of foundation bearing pressure',
        category: 'Construction',
        file_path: '/analysis/soil-bearing.pdf',
        user_id: 'user-1',
        created_at: '2024-03-12T00:00:00Z',
        origin: 'matlab',
        status: 'completed'
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
        title: 'Conduit Clearance',
        description: 'Electrical conduit clearance measurements',
        category: 'Construction',
        file_path: '/measurements/clearance.pdf',
        user_id: 'user-1',
        created_at: '2024-03-13T00:00:00Z',
        origin: 'matlab',
        status: 'completed'
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
        title: 'Sprinkler Coverage',
        description: 'Fire sprinkler coverage analysis',
        category: 'Construction',
        file_path: '/analysis/sprinkler-coverage.pdf',
        user_id: 'user-1',
        created_at: '2024-03-14T00:00:00Z',
        origin: 'matlab',
        status: 'completed'
      }
    ]
  }
]
