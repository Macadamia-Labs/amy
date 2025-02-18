import fs from 'fs'
import { NextResponse } from 'next/server'
import path from 'path'

interface Section {
  level: number
  title: string
  content: string
  start: number
  end: number
}

function parseMarkdownSections(markdown: string): Section[] {
  const lines = markdown.split('\n')
  const sections: Section[] = []
  let currentSection: Section | null = null

  lines.forEach((line, index) => {
    if (line.startsWith('#')) {
      if (currentSection) {
        currentSection.end = index - 1
        sections.push(currentSection)
      }

      const level = line.match(/^#+/)?.[0].length || 0
      const title = line.replace(/^#+\s*/, '')
      currentSection = {
        level,
        title,
        content: line + '\n',
        start: index,
        end: index
      }
    } else if (currentSection) {
      currentSection.content += line + '\n'
      currentSection.end = index
    }
  })

  if (currentSection) {
    sections.push(currentSection)
  }

  return sections
}

export async function GET() {
  try {
    const docsDirectory = path.join(process.cwd(), 'docs')
    const files = fs.readdirSync(docsDirectory)

    const docs = files
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const filePath = path.join(docsDirectory, file)
        const content = fs.readFileSync(filePath, 'utf8')
        const sections = parseMarkdownSections(content)
        const id = file.replace('.md', '')

        // Use the first h1 as the title, or fallback to the filename
        const title = sections.find(s => s.level === 1)?.title || id

        return {
          id,
          title,
          sections
        }
      })

    return NextResponse.json(docs)
  } catch (error) {
    console.error('Error reading docs:', error)
    return NextResponse.json({ error: 'Failed to read docs' }, { status: 500 })
  }
}
