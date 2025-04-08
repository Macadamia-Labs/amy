import { DocsLayout } from '@/components/layout/docs-layout'
import { Suspense } from 'react'
import ResourceLoading from './loading'

export default async function ResourcePage() {
  return (
    <Suspense fallback={<ResourceLoading />}>
      <DocsLayout />
    </Suspense>
  )
}
