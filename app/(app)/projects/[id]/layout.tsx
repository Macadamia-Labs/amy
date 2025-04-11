import ProjectHeader from '@/components/layout/project-header'

export default async function SearchProjectLayout({
  params,
  children
}: {
  params: Promise<{ id: string }>
  children: React.ReactNode
}) {
  const { id } = await params
  return (
    <div className="flex flex-col h-full">
      <ProjectHeader projectId={id} />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
