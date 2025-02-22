'use client'

import { DocsLayout } from '@/components/layout/docs-layout'
import { DocumentProvider } from '@/lib/providers/document-provider'
import { use } from 'react'
import { docs } from '../content'

const EXAMPLE = `
# Article 1

## General Provisions

Image example:

![Image example](https://api.trymacadamia.com/storage/v1/object/public/standards-images/page_102_cropped.svg)

[this text is being lost]


## dfadsfasdf

### Personnel Qualifications

- **(g)** When the referencing Code Section does not specify qualifications or does not reference directly Article 1 of this Section, qualification may simply involve demonstration in routine manufacturing operations to show that the personnel performing the nondestructive examinations are competent to do so in accordance with the Manufacturer's established procedures.

- **(h)** The user of this Article is responsible for the qualification and certification of NDE Personnel in accordance with the requirements of this Article. The Code User's Quality Program shall stipulate how this is to be accomplished. Qualifications in accordance with a prior edition of SNT-TC-1A, or CP-189 are valid until recertification. Recertification or new certification shall be in accordance with the edition of SNT-TC-1A or CP-189 specified in Footnote 3.

- **(i)** Limited certification of nondestructive examination personnel who do not perform all of the operations of a nondestructive method that consists of more than one operation, or who perform nondestructive examinations of limited scope, may be based on fewer hours of training and experience than recommended in SNT-TC-1A or CP-189. Any limitations or restrictions placed upon a person's certification shall be described in the written practice and on the certification.`

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function DocsPage({ params }: PageProps) {
  const { id } = use(params)
  const content = docs[id as keyof typeof docs] || EXAMPLE

  return (
    <DocumentProvider initialContent={content}>
      <DocsLayout />
    </DocumentProvider>
  )
}
