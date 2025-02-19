import { useOswald } from "@/lib/providers/oswald-provider";
import { Button } from "../ui/button";

interface CitationProps {
  id: string;
}

export default function Citation({ id }: CitationProps) {
  const oswaldContext = useOswald();

  // Find the source and its index
  const sourceIndex = oswaldContext.sources.findIndex(
    (source) => source.id === id
  );
  const source = oswaldContext.sources[sourceIndex];

  if (!source) return null;

  const handleClick = () => {
    oswaldContext.setActiveSource(source);
    oswaldContext.setActiveTab("sources");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-5 w-5 rounded-full p-0 text-xs font-medium inline-flex items-center justify-center align-super mx-1"
      onClick={handleClick}
    >
      {sourceIndex + 1}
    </Button>
  );
}
