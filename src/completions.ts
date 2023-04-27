import { CompletionItem, CompletionItemKind, Position, Range, languages } from 'vscode'
import type { CompletionItemProvider, ExtensionContext, TextDocument } from 'vscode'
import { colorNameEntries } from './config'
import { getColorMarkdown } from './markdown'
import type { ColorEntry } from './types'

export function RegisterCompletion(ctx: ExtensionContext) {
  const nameProvider: CompletionItemProvider = {
    provideCompletionItems(document: TextDocument, position: Position) {
      const line = document.getText(new Range(new Position(position.line, 0), new Position(position.line, position.character)))
      const match = /color/ig.test(line)
      if (!match)
        return null

      return colorNameEntries.value.map(([code, name]) => {
        const item = new CompletionItem(code, CompletionItemKind.Color)
        item.detail = name
        return item
      })
    },
    resolveCompletionItem(item: CompletionItem) {
      return {
        ...item,
        documentation: item.detail ? getColorMarkdown([item.label, item.detail] as ColorEntry) : '',
      }
    },
  }

  ctx.subscriptions.push(
    languages.registerCompletionItemProvider(
      {
        scheme: 'file',
      },
      nameProvider,
    ),
  )
}
