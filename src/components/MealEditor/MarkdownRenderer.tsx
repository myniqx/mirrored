'use client'

import React from 'react'

/**
 * Custom Markdown Renderer for Meal Text
 * Supports:
 * - **bold** → <strong>
 * - *italic* → <em>
 * - __underline__ → <u>
 * - **{{Allah}}** → <strong style="color: red">Allah</strong>
 */

type MarkdownRendererProps = {
  children: string
  className?: string
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  children,
  className = '',
}) => {
  if (!children) return null

  // Parse markdown to React elements
  const parseMarkdown = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = []
    let currentIndex = 0
    let key = 0

    // Regex patterns
    const patterns = [
      // Allah names (red + bold): **{{text}}**
      {
        regex: /\*\*\{\{(.*?)\}\}\*\*/g,
        render: (match: string, content: string) => (
          <strong key={key++} className="text-red-600 dark:text-red-400">
            {content}
          </strong>
        ),
      },
      // Bold: **text**
      {
        regex: /\*\*(.*?)\*\*/g,
        render: (match: string, content: string) => (
          <strong key={key++}>{content}</strong>
        ),
      },
      // Italic: *text*
      {
        regex: /\*(.*?)\*/g,
        render: (match: string, content: string) => (
          <em key={key++}>{content}</em>
        ),
      },
      // Underline: __text__
      {
        regex: /__(.*?)__/g,
        render: (match: string, content: string) => (
          <u key={key++}>{content}</u>
        ),
      },
    ]

    // Find all matches
    const matches: Array<{
      index: number
      length: number
      element: React.ReactNode
    }> = []

    patterns.forEach((pattern) => {
      let match
      const regex = new RegExp(pattern.regex)
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          index: match.index,
          length: match[0].length,
          element: pattern.render(match[0], match[1]),
        })
      }
    })

    // Sort matches by index
    matches.sort((a, b) => a.index - b.index)

    // Build result
    matches.forEach((match) => {
      // Add text before match
      if (currentIndex < match.index) {
        parts.push(
          <span key={key++}>{text.slice(currentIndex, match.index)}</span>,
        )
      }

      // Add match element
      parts.push(match.element)

      currentIndex = match.index + match.length
    })

    // Add remaining text
    if (currentIndex < text.length) {
      parts.push(<span key={key++}>{text.slice(currentIndex)}</span>)
    }

    return parts.length > 0 ? parts : text
  }

  return <div className={className}>{parseMarkdown(children)}</div>
}
