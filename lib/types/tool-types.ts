import { ToolCallPart, ToolResultPart } from "ai";

export interface ExtendedToolResultPart extends ToolResultPart {
  args?: Record<string, any>;
  result: {
    generated_report?: string;
    [key: string]: any;
  };
}

export interface ExtendedToolCallPart extends ToolCallPart {
  args: Record<string, any>;
  onResult?: (result: { error: string } | any) => void;
} 