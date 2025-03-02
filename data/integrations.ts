export interface Integration {
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
    name: 'Autodesk Construction Cloud',
    code: 'autodesk_cc',
    description:
      'Connect to your Autodesk Construction Cloud projects and documents',
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
    name: 'COMSOL',
    code: 'comsol',
    description: 'Connect with your COMSOL Multiphysics simulations',
    logoSrc: '/integrations/Comsol.png',
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
    name: 'GitHub',
    code: 'github',
    description: 'Connect with your GitHub repositories and projects',
    logoSrc: '/integrations/github.avif',
    isConnected: false
  },
  {
    name: 'Jira',
    code: 'jira',
    description: 'Connect with your Jira projects and issues',
    logoSrc: '/integrations/Jira.png',
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
    name: 'Procore',
    code: 'procore',
    description: 'Connect to your Procore construction management projects',
    logoSrc: '/integrations/procore.png',
    isConnected: false
  },
  {
    name: 'Revit',
    code: 'revit',
    description: 'Connect with your Revit building information models',
    logoSrc: '/integrations/revit.png',
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
