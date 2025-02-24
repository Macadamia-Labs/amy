import 'katex/dist/katex.min.css'
import { BlockMath, InlineMath } from 'react-katex'

interface MathTextProps {
  text: string
}

export function MathText({ text }: MathTextProps) {
  // Split the text into parts by looking for math delimiters
  const parts = text.split(/(\\\[.*?\\\]|\\\(.*?\\\))/g)

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('\\[') && part.endsWith('\\]')) {
          // Display math
          return <BlockMath key={index} math={part.slice(2, -2)} />
        } else if (part.startsWith('\\(') && part.endsWith('\\)')) {
          // Inline math
          return <InlineMath key={index} math={part.slice(2, -2)} />
        } else {
          // Regular text
          return <span key={index}>{part}</span>
        }
      })}
    </>
  )
} 