import { ToolInvocation } from "ai";
import { RetrievalResult } from "./retrieval-card";
import { useEffect } from "react";
import { useOswald } from "@/lib/providers/oswald-provider";
import Citation from "@/components/citation";

export default function RetrieveDocumentationTool({
  tool,
}: {
  tool: ToolInvocation & { result: RetrievalResult[] };
}) {
  const oswaldContext = useOswald();

  useEffect(() => {
    if (oswaldContext) {
      console.log("adding sources", tool.result);
      oswaldContext.addSources(tool.result);
    }
  }, [tool.result]);

  return (
    <div className="flex items-center gap-1">
      <span>Fetched {tool.result.length} sources:</span>
      <div className="flex items-center gap-0.5">
        {tool.result.map((result: RetrievalResult, index: number) => (
          <Citation key={result.id} id={result.id} number={index + 1} />
        ))}
      </div>
    </div>
  );
}
