'use client'

import { IntegrationCard } from '@/components/integrations/integration-card'
import { useEffect, useState } from 'react'

interface Integration {
  name: string
  code: string
  description: string
  logoSrc: string
  isConnected: boolean
}

export const DEFAULT_INTEGRATIONS: Integration[] = [
  {
    name: 'Ansys',
    code: 'ansys',
    description: 'Connect with your Ansys engineering simulations',
    logoSrc: '/integrations/ansys.avif',
    isConnected: false
  },
  {
    name: 'Autodesk',
    code: 'autodesk',
    description: 'Access your Autodesk CAD files and projects',
    logoSrc: '/integrations/autodesk.avif',
    isConnected: false
  },
  {
    name: 'Confluence',
    code: 'confluence',
    description: 'Link your Confluence workspace',
    logoSrc: '/integrations/confluence.avif',
    isConnected: false
  },
  {
    name: 'Google Drive',
    code: 'gdrive',
    description: 'Connect and manage your Google Drive files',
    logoSrc: '/integrations/gdrive.avif',
    isConnected: false
  },
  {
    name: 'MATLAB',
    code: 'matlab',
    description: 'Integrate with your MATLAB workflows',
    logoSrc: '/integrations/matlab.avif',
    isConnected: false
  },
  {
    name: 'OneDrive',
    code: 'onedrive',
    description: 'Sync with your OneDrive storage',
    logoSrc: '/integrations/onedrive.avif',
    isConnected: false
  },
  {
    name: 'SharePoint',
    code: 'sharepoint',
    description: 'Connect to your SharePoint sites and documents',
    logoSrc: '/integrations/sharepoint.avif',
    isConnected: false
  },
  {
    name: 'Slack',
    code: 'slack',
    description: 'Integrate with your Slack channels',
    logoSrc: '/integrations/slack.avif',
    isConnected: false
  }
]

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([])

  useEffect(() => {
    // Load integrations from localStorage or use defaults
    const savedIntegrations = localStorage.getItem('integrations')
    if (savedIntegrations) {
      setIntegrations(JSON.parse(savedIntegrations))
    } else {
      setIntegrations(DEFAULT_INTEGRATIONS)
    }
  }, [])

  // Save to localStorage whenever integrations change
  useEffect(() => {
    if (integrations.length > 0) {
      localStorage.setItem('integrations', JSON.stringify(integrations))
    }
  }, [integrations])

  const handleConnect = (index: number) => {
    setIntegrations(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], isConnected: true }
      return updated
    })
  }

  const handleDisconnect = (index: number) => {
    setIntegrations(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], isConnected: false }
      return updated
    })
  }

  const handleSync = (index: number) => {
    // Add your sync logic here
    console.log(`Syncing ${integrations[index].name}...`)
  }

  return (
    <div className="flex flex-col h-full p-4">
      <h1 className="text-2xl font-bold">Integrations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[...integrations]
          .sort((a, b) => (b.isConnected ? 1 : 0) - (a.isConnected ? 1 : 0))
          .map((integration, index) => {
            const originalIndex = integrations.findIndex(
              i => i.name === integration.name
            )
            return (
              <IntegrationCard
                key={integration.name}
                {...integration}
                onConnect={() => handleConnect(originalIndex)}
                onDisconnect={() => handleDisconnect(originalIndex)}
                onSync={() => handleSync(originalIndex)}
              />
            )
          })}
      </div>
    </div>
  )
}
