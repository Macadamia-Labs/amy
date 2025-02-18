import * as React from "react";

interface ShortCutProps {
  children: React.ReactNode;
  className?: string; // Add optional className prop
}

const ShortCut: React.FC<ShortCutProps> = ({ children, className }) => {
  return (
    <div className={className}>
      <kbd
        className={`pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 `}
      >
        {children}
      </kbd>
    </div>
  );
};

export default ShortCut;
