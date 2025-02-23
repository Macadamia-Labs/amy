import fetch from 'node-fetch'
import { ProcessedDocumentResult } from './types'

export async function processDocument(
  fileURL: string,
  userId: string
): Promise<ProcessedDocumentResult> {
  const processingEndpoint = `${process.env.DOC_PROCESSING_URL}/convert-doc`
  const response = await fetch(processingEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      userId,
      docUrl: fileURL
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Document processing service error: ${response.statusText} (${response.status})\nDetails: ${errorText}`
    )
  }

  const result = (await response.json()) as ProcessedDocumentResult

  return result
}
