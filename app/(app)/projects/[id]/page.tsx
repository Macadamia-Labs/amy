import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getProject } from '@/lib/actions/projects'
import { format } from 'date-fns'
import { notFound } from 'next/navigation'

export default async function ProjectPage({
    params, 
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
        </div>
    )
}
