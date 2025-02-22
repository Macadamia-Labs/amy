import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Issue } from '@/lib/types'
import { cn } from '@/lib/utils'
import {
  ActivityIcon,
  CheckCircleIcon,
  CheckSquareIcon,
  ClockIcon,
  HardDriveIcon,
  NotesIcon,
  TextFileIcon,
  WrenchIcon
} from '@/lib/utils/icons'

interface IssueCardProps {
  issue: Issue
}

const statusIcons = {
  open: ActivityIcon,
  in_progress: ClockIcon,
  resolved: CheckSquareIcon,
  closed: CheckSquareIcon
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800'
}

const categoryIcons = {
  Production: WrenchIcon,
  Construction: HardDriveIcon,
  Maintenance: WrenchIcon,
  Safety: ActivityIcon
}

const documentTypeIcons = {
  Drawing: TextFileIcon,
  Simulation: WrenchIcon,
  Report: NotesIcon,
  Specification: TextFileIcon,
  Manual: TextFileIcon
}

export function IssueCard({ issue }: IssueCardProps) {
  const StatusIcon = statusIcons[issue.status]
  const CategoryIcon = categoryIcons[issue.category]

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CategoryIcon className="h-5 w-5 text-muted-foreground" />
          </div>
          <span
            className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              priorityColors[issue.priority]
            )}
          >
            {issue.priority}
          </span>
          <CheckCircleIcon className="h-4 w-4 text-green-500" />
        </div>
        {/* <div className="flex items-center gap-2 mt-2">
          <MapPinIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {issue.location}
          </span>
        </div> */}
        <CardTitle className="text-lg mt-2">{issue.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {issue.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="border-t pt-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Resources
            </h4>
            <div className="space-y-2">
              {issue.resources.map(resource => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <WrenchIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{resource.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${(resource.usage / resource.total) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {resource.usage}/{resource.total} {resource.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Standards Section */}
          {issue.standards.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Applicable Standards
              </h4>
              <div className="space-y-1">
                {issue.standards.map(standard => (
                  <div
                    key={standard.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <NotesIcon className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {standard.code} - {standard.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Documents Section */}
          {issue.documents.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Related Documents
              </h4>
              <div className="space-y-2">
                {issue.documents.map(doc => {
                  const DocIcon = documentTypeIcons[doc.type]
                  return (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <DocIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{doc.title}</span>
                      </div>
                      {/* <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-xs',
                          doc.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : doc.status === 'review'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        )}
                      >
                        {doc.status}
                      </span> */}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
