export const config = {
  pdfProcessingService: {
    url: process.env.PDF_PROCESSING_URL || 'http://127.0.0.1:8000',
    endpoints: {
      convertPdfToPng: '/convert-pdf-to-png'
    }
  }
} 