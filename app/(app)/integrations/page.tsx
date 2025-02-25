'use client'

import { IntegrationCard } from '@/components/integrations/integration-card';
import { useEffect, useState } from 'react';

// Declare global window property
declare global {
  interface Window {
    clearIntegrationsStorage?: () => void;
  }
}

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
    name: 'Abaqus FEA',
    code: 'abaqus',
    description: 'Connect with your Abaqus finite element analysis simulations',
    logoSrc: '/integrations/DS.avif',
    isConnected: false
  },
  {
    name: 'COMPRESS',
    code: 'codeware',
    description: 'Integrate with COMPRESS pressure vessel design software',
    logoSrc: '/integrations/codeware.avif',
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
    name: 'Solidworks',
    code: 'DS',
    description: 'Link your Solidworks workspace',
    logoSrc: '/integrations/DS.avif',
    isConnected: false
  },
  {
    name: 'Gmail',
    code: 'gmail',
    description: 'Connect and manage your Gmail account',
    logoSrc: '/integrations/gmail.jpg',
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
    name: 'Onshape',
    code: 'onshape',
    description: 'Access your Onshape CAD models and assemblies',
    logoSrc: '/integrations/onshape.avif',
    isConnected: false
  },
  {
    name: 'Outlook',
    code: 'outlook',
    description: 'Connect and manage your Outlook email and calendar',
    logoSrc: '/integrations/outlook.avif',
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
    name: 'Siemens NX',
    code: 'siemensnx',
    description: 'Access your Siemens NX CAD models and projects',
    logoSrc: '/integrations/siemens.avif',
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
      const parsedIntegrations = JSON.parse(savedIntegrations);
      
      // Check for duplicates and log them
      const codeCount: Record<string, number> = {};
      parsedIntegrations.forEach((integration: Integration) => {
        codeCount[integration.code] = (codeCount[integration.code] || 0) + 1;
      });
      
      const duplicates = Object.entries(codeCount)
        .filter(([_, count]) => count > 1)
        .map(([code]) => code);
      
      if (duplicates.length > 0) {
        console.warn('Duplicate integration codes found:', duplicates);
      }
      
      // Check if any new default integrations need to be added
      const existingCodes = new Set(parsedIntegrations.map((i: Integration) => i.code));
      const newIntegrations = DEFAULT_INTEGRATIONS.filter(
        integration => !existingCodes.has(integration.code)
      );
      
      if (newIntegrations.length > 0) {
        // Add new integrations to the existing ones
        setIntegrations([...parsedIntegrations, ...newIntegrations]);
      } else {
        setIntegrations(parsedIntegrations);
      }
    } else {
      // Ensure no duplicate codes in DEFAULT_INTEGRATIONS
      const uniqueDefaultIntegrations = Array.from(
        new Map(DEFAULT_INTEGRATIONS.map(item => [item.code, item])).values()
      );
      setIntegrations(uniqueDefaultIntegrations);
    }
  }, [])

  // Save to localStorage whenever integrations change
  useEffect(() => {
    if (integrations.length > 0) {
      // Remove any duplicates before saving to localStorage
      const uniqueIntegrations = Array.from(
        new Map(integrations.map(item => [item.code, item])).values()
      );
      localStorage.setItem('integrations', JSON.stringify(uniqueIntegrations))
      
      // If we removed duplicates, update the state as well
      if (uniqueIntegrations.length !== integrations.length) {
        setIntegrations(uniqueIntegrations);
      }
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

  // Function to clear localStorage - can be called from browser console
  // To use: open browser console and type: window.clearIntegrationsStorage()
  useEffect(() => {
    window.clearIntegrationsStorage = () => {
      localStorage.removeItem('integrations');
      // Ensure no duplicate codes in DEFAULT_INTEGRATIONS before setting state
      const uniqueDefaultIntegrations = Array.from(
        new Map(DEFAULT_INTEGRATIONS.map(item => [item.code, item])).values()
      );
      setIntegrations(uniqueDefaultIntegrations);
      console.log('Integrations storage cleared and reset to defaults');
      // Reload the page to ensure a clean state
      window.location.reload();
    };
    
    return () => {
      delete window.clearIntegrationsStorage;
    };
  }, []);

  return (
    <div className="flex flex-col h-full p-4">
      <h1 className="text-2xl font-bold">Integrations</h1>
      <p className="text-muted-foreground">
        Connect your tools and data sources to use in your projects.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[...integrations]
          .sort((a, b) => (b.isConnected ? 1 : 0) - (a.isConnected ? 1 : 0))
          .map((integration, index) => {
            const originalIndex = integrations.findIndex(
              i => i.code === integration.code
            )
            return (
              <IntegrationCard
                key={`${integration.code}-${index}`}
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
