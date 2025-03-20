export interface ProcessingServiceResponse {
  pages: string[]
  description: string
  outline: any
}

export interface ProcessedPDFResult {
  imageUrl: string
  filePaths?: string[]
  description: string
  outline: any
}

export interface ProcessedDocumentResult {
  description: string
  content: string
  tags?: string[]
}

export interface ProcessedImageResult {
  description: string
  content: string
  tags?: string[]
}

export type ProcessedResource =
  | ProcessedPDFResult
  | ProcessedDocumentResult
  | ProcessedImageResult
