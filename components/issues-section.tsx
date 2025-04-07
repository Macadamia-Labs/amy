'use client'

import { Section, ToolArgsSection } from '@/components/section'
import { FormattedIssue } from '@/lib/types' // Assuming FormattedIssue type exists or will be created
import { ToolInvocation } from 'ai'
import { CollapsibleMessage } from './collapsible-message'
import { DefaultSkeleton } from './default-skeleton'
import { Badge } from './ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from './ui/card'

interface IssuesSectionProps {
  tool: ToolInvocation
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function IssuesSection({
  tool,
  isOpen,
  onOpenChange
}: IssuesSectionProps) {
  const isLoading = tool.state === 'call'
  const issues: FormattedIssue[] =
    tool.state === 'result' ? tool.result : undefined

  const header = (
    <ToolArgsSection tool="format-issues">Issues Found</ToolArgsSection>
  )

  return (
    <CollapsibleMessage
      role="assistant"
      isCollapsible={true}
      header={header}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      {!isLoading && issues ? (
        <Section title="Formatted Issues" className="flex flex-col gap-4">
          {issues.map((issue, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{issue.title}</CardTitle>
                {issue.description && (
                  <CardDescription>{issue.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex gap-2">
                {issue.type && (
                  <Badge variant="secondary">Type: {issue.type}</Badge>
                )}
                {issue.severity && (
                  <Badge
                    variant={
                      issue.severity === 'critical' ? 'destructive' : 'outline'
                    }
                  >
                    Severity: {issue.severity}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </Section>
      ) : (
        <DefaultSkeleton />
      )}
    </CollapsibleMessage>
  )
}

export default IssuesSection
