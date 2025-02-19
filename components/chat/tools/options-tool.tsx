"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Check } from "lucide-react";

interface OptionsToolProps {
  children: React.ReactNode;
  onSelect?: (option: string) => void;
}

export default function OptionsTool({ children, onSelect }: OptionsToolProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasSelected, setHasSelected] = useState(false);

  // Parse the options from children
  const options = Array.isArray(children) 
    ? children
        .filter((child: any) => child?.type === "option")
        .map((child: any) => child.props.children)
    : [];

  const handleSelect = (option: string) => {
    if (hasSelected) return;
    setSelectedOption(option);
    setHasSelected(true);
    onSelect?.(option);
  };

  return (
    <div className="flex flex-col gap-2 my-4 w-full max-w-md">
      {options.map((option: string) => (
        <Button
          key={option}
          variant="outline"
          className={cn(
            "w-full justify-start text-left",
            selectedOption === option && "bg-primary/10",
            hasSelected && selectedOption !== option && "opacity-50"
          )}
          onClick={() => handleSelect(option)}
          disabled={hasSelected && selectedOption !== option}
        >
          {option}
          {hasSelected && selectedOption === option && (
            <Check className="ml-auto size-4" />
          )}
        </Button>
      ))}
    </div>
  );
}
