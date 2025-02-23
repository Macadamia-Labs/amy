export const config = {
  pdfProcessingService: {
    url: process.env.PDF_PROCESSING_URL || 'http://127.0.0.1:8000',
    endpoints: {
      convertPdfToPng: '/convert-pdf-to-png'
    }
  },
  docProcessingService: {
    url: process.env.DOC_PROCESSING_URL || 'http://127.0.0.1:8001',
    endpoints: {
      convertDoc: '/convert-doc'
    }
  },
  imageProcessingService: {
    url: process.env.IMAGE_PROCESSING_URL || 'http://127.0.0.1:8002',
    endpoints: {
      processImage: '/process-image'
    }
  }
}
