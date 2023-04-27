import { describe, expect, it, vi } from 'vitest'
import { getColorMarkdown } from '../src/markdown'

vi.mock('vscode', () => {
  return {
    MarkdownString: vi.fn(),
  }
})

describe('markdwn', () => {
  it('getColorMarkdown', () => {
    const markdown = getColorMarkdown(['#48b0f1', 'Primary'])
    expect(markdown).toMatchInlineSnapshot('spy {}')
  })
})
