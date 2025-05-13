import LoadingDots from '@/components/magicui/loading-dots'
import { Badge } from '@/components/ui/badge'
import { DEFAULT_INTEGRATIONS } from '@/data/integrations'
import { Resource } from '@/lib/types'
import {
  CheckCircleIcon,
  FileUploadIcon,
  IntegrationIcon,
  XCircleIcon
} from '@/lib/utils/icons'
import Image from 'next/image'
import { ReactElement } from 'react'

export const getResourceStatusIcon = (
  resource: Resource,
  uploadStatus: Map<string, string>
): ReactElement => {
  const currentUploadStatus = uploadStatus.get(resource.id)

  if (currentUploadStatus === 'loading') {
    return (
      <Badge className="flex items-center text-blue-500 bg-blue-500/10 hover:bg-blue-500/20">
        <span className="text-xs font-medium mr-1">Uploading</span>
        <LoadingDots />
      </Badge>
    )
  } else if (currentUploadStatus === 'error' || resource.status === 'error') {
    return <XCircleIcon className="size-6 text-red-500" />
  } else if (
    resource.status === 'processing' ||
    resource.status === 'pending'
  ) {
    return (
      <Badge className="flex items-center text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20">
        <span className="text-xs font-medium mr-1">Processing</span>
        <LoadingDots />
      </Badge>
    )
  } else if (resource.status === 'completed') {
    return <CheckCircleIcon className="size-6 text-green-500" />
  }

  return (
    <div className="size-5 border-2 border-dashed border-muted-foreground rounded-full" />
  )
}

export const getResourceSourceIcon = (resource: Resource): ReactElement => {
  const integration = DEFAULT_INTEGRATIONS.find(
    (i: { code: string }) => i.code === resource.origin
  )

  if (integration) {
    return (
      <Image
        src={integration.logoSrc}
        alt={integration.name}
        width={16}
        height={16}
      />
    )
  }

  if (resource.origin === 'upload') {
    return <FileUploadIcon className="size-5 text-muted-foreground" />
  }

  return <IntegrationIcon className="size-5 text-muted-foreground" />
}

export const getResourceSourceName = (resource: Resource): string => {
  const integration = DEFAULT_INTEGRATIONS.find(
    (i: { code: string }) => i.code === resource.origin
  )
  return integration?.name || resource.origin || 'External Source'
}
