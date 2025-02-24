import Citation from '@/components/citation'
import { useCooper } from '@/lib/providers/cooper-provider'
import { ToolInvocation } from 'ai'
import { useEffect } from 'react'
import { RetrievalResult } from './retrieval-card'

export default function RetrieveDocumentationTool({
  tool
}: {
  tool: ToolInvocation & { result: RetrievalResult[] }
}) {
  const cooperContext = useCooper()

  useEffect(() => {
    if (cooperContext) {
      console.log('adding sources', tool.result)
      cooperContext.addSources(tool.result)
    }
  }, [tool.result])

  return (
    <div className="flex items-center gap-1">
      <span>Fetched {tool.result.length} sources:</span>
      <div className="flex items-center gap-0.5">
        {tool.result.map((result: RetrievalResult, index: number) => (
          <Citation key={result.id} id={result.id} number={index + 1} />
        ))}
      </div>
    </div>
  )
}
