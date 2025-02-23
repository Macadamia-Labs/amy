export interface ProcessingServiceResponse {
  pages: string[]
}

export interface ProcessedPDFResult {
  imageUrl: string
  filePaths?: string[]
  description: string
}

export interface ProcessedDocumentResult {
  description: string
  content: string
  tags: string[]
}

export interface ProcessedImageResult {
  description: string
  content: string
  tags: string[]
}

export type ProcessedResource =
  | ProcessedPDFResult
  | ProcessedDocumentResult
  | ProcessedImageResult
