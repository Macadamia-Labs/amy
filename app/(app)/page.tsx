import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  categoryIcons,
  resources,
  type ResourceItem
} from '@/lib/constants/resources'
import Link from 'next/link'

export default function AppPage() {
  // Sort resources by date (most recent first)
  const sortedResources = [...resources].sort(
    (a: ResourceItem, b: ResourceItem) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  // Get the 5 most recent resources
  const recentResources = sortedResources.slice(0, 3)

  return (
    <div className="p-4 w-full overflow-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <div className="h-12 w-1 bg-purple-500 rounded-full"></div>
          <div>
            <h1 className="text-2xl font-bold">My First Project</h1>
            <p className="text-muted-foreground">
              Project to design a pressure vessel systems
            </p>
          </div>
        </div>
      </div>
      {/* Recent Resources Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Resources</h2>
        <div className="flex overflow-x-auto gap-4 pb-4">
          {recentResources.map((item: ResourceItem) => {
            const IconComponent = categoryIcons[item.category]
            return (
              <Card
                key={item.id}
                className="flex-shrink-0 w-[300px] hover:shadow-md transition-shadow cursor-pointer"
              >
                <Link href={item.link}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-2">
                      <IconComponent className="size-8 text-muted-foreground" />
                      <CardTitle className="text-lg truncate">
                        {item.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-2">
                      {item.description}
                    </CardDescription>
                    <div className="text-sm text-muted-foreground">
                      Last updated: {item.date}
                    </div>
                  </CardContent>
                </Link>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
