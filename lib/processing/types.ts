export interface ProcessingServiceResponse {
  title: string
  description: string
  content: any
}

export interface ProcessedPDFResult {
  title: string
  description: string
  content: any
}

export interface ProcessedDocumentResult {
  title: string
  description: string
  content: string
  tags?: string[]
}

export interface ProcessedImageResult {
  title: string
  description: string
  content: string
  tags?: string[]
}

export type ProcessedResource =
  | ProcessedPDFResult
  | ProcessedDocumentResult
  | ProcessedImageResult
