import { Resource } from '@/lib/types'
import { categoryIcons } from '@/lib/constants/resources'
import {
  CheckCircleIcon,
  FileUploadIcon,
  IntegrationIcon,
  XCircleIcon
} from '@/lib/utils/icons'
import { DEFAULT_INTEGRATIONS } from '@/app/(app)/integrations/page'
import Image from 'next/image'
import Loader from '@/components/lottie/loader'

export const getResourceStatusIcon = (
  resource: Resource,
  uploadStatus: Map<string, string>
) => {
  const IconComponent =
    categoryIcons[resource.category as keyof typeof categoryIcons]
  const currentUploadStatus = uploadStatus.get(resource.id)

  if (
    currentUploadStatus === 'loading' ||
    resource.status === 'loading' ||
    resource.status === 'processing'
  ) {
    return <Loader className="size-6 text-blue-500" />
  } else if (currentUploadStatus === 'error' || resource.status === 'error') {
    return <XCircleIcon className="size-6 text-red-500" />
  } else if (
    currentUploadStatus === 'success' ||
    resource.status === 'completed'
  ) {
    return <CheckCircleIcon className="size-6 text-green-500" />
  } else if (IconComponent) {
    return <IconComponent className="size-6 text-muted-foreground" />
  }

  return (
    <div className="size-5 border-2 border-dashed border-muted-foreground rounded-full" />
  )
}

export const getResourceSourceIcon = (resource: Resource) => {
  const integration = DEFAULT_INTEGRATIONS.find(
    (i: { code: string }) => i.code === resource.origin
  )

  if (integration) {
    return (
      <Image
        src={integration.logoSrc}
        alt={integration.name}
        className="mx-auto"
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

export const getResourceSourceName = (resource: Resource) => {
  const integration = DEFAULT_INTEGRATIONS.find(
    (i: { code: string }) => i.code === resource.origin
  )
  return integration?.name || resource.origin || 'External Source'
}
