import { Change } from './types'

export const exampleChanges: Change[] = [
  {
    id: '1',
    project: 'Vehicle Specifications',
    user: {
      name: 'Amy',
      avatar: undefined
    },
    authorizedBy: 'Abel',
    action: 'propagated changes from Drag Coefficient',
    timestamp: 'February 11, 2025 at 1:50 PM',
    subChanges: [
      {
        id: '1-1',
        project: 'Vehicle Specifications',
        user: { name: 'Amy' },
        action: 'changed contents of',
        target: 'Vehicle Specifications',
        timestamp: 'February 11, 2025 at 1:50 PM'
      },
      {
        id: '1-2',
        project: 'Vehicle Specifications',
        user: { name: 'Amy' },
        action: 'added new version of',
        target: 'Table Vehicle Power vs Speed in Mild Weather',
        timestamp: 'February 11, 2025 at 1:50 PM'
      },
      {
        id: '1-3',
        project: 'Vehicle Specifications',
        user: { name: 'Amy' },
        action: 'added new version of',
        target: 'Table Vehicle Power vs Speed in Cold Weather',
        timestamp: 'February 11, 2025 at 1:50 PM'
      },
      {
        id: '1-4',
        project: 'Vehicle Specifications',
        user: { name: 'Amy' },
        action: 'changed value',
        target: 'Vehicle Range in Cold Weather',
        description: '453.3 → 444.5 km',
        timestamp: 'February 11, 2025 at 1:50 PM'
      },
      {
        id: '1-5',
        project: 'Vehicle Specifications',
        user: { name: 'Amy' },
        action: 'changed value',
        target: 'Vehicle Range in Mild Weather',
        description: '533.5 → 521.5 km',
        timestamp: 'February 11, 2025 at 1:50 PM'
      },
      {
        id: '1-6',
        project: 'Vehicle Specifications',
        user: { name: 'Amy' },
        action: 'added new version of',
        target: 'Plot - Vehicle Power vs Speed in Cold Weather',
        timestamp: 'February 11, 2025 at 1:50 PM'
      },
      {
        id: '1-7',
        project: 'Vehicle Specifications',
        user: { name: 'Amy' },
        action: 'added new version of',
        target: 'Plot - Vehicle Power vs Speed in Mild Weather',
        timestamp: 'February 11, 2025 at 1:50 PM'
      },
      {
        id: '1-8',
        project: 'Vehicle Specifications',
        user: { name: 'Amy' },
        action: 'edited',
        target: 'Cold weather range needs to be greater than 450.0 km',
        timestamp: 'February 11, 2025 at 1:50 PM'
      }
    ]
  },
  {
    id: '2',
    project: 'Battery Cell Specifications',
    user: {
      name: 'Amy',
      avatar: undefined
    },
    action: 'propagated changes',
    target: ' from Battery Cell Specifications',
    timestamp: 'Friday at 9:23 PM',
    subChanges: [] // 17 changes that are collapsed
  }
]
