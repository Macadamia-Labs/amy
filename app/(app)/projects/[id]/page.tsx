import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { getProject } from '@/lib/actions/projects'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'
import { ProjectChats } from './project-chats'

export default async function ProjectPage({
  params
}: {
  params: Promise<{
    id: string
  }>
}) {
  const { id } = await params
  const { project, error } = await getProject(id)

  if (error || !project) {
    notFound()
  }

  return (
    <div className="container py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{project.name}</CardTitle>
          <CardDescription>
            Created on {format(new Date(project.created_at), 'MMM d, yyyy')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{project.description}</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Project Chats</h2>
        <ProjectChats projectId={id} />
      </div>
    </div>
  )
}
