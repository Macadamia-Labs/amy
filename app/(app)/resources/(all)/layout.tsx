import ResourcesHeader from '@/components/layout/resources-header'
export default function ResourcesLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-full">
      <ResourcesHeader />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
