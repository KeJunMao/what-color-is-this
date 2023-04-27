import type { ExtensionContext, TextEditor } from 'vscode'
import { DecorationRangeBehavior, Range, window, workspace } from 'vscode'

import tinycolor from 'tinycolor2'
import { colorNameEntries, config, onConfigUpdated } from './config'
import type { ColorEntry, DecorationMatch } from './types'
import { getColorMarkdown } from './markdown'

export function RegisterDecorator(ctx: ExtensionContext) {
  const InlineNameDecoration = window.createTextEditorDecorationType({
    textDecoration: 'none; opacity: 0.6 !important;',
    rangeBehavior: DecorationRangeBehavior.ClosedClosed,
  })
  const HideTextDecoration = window.createTextEditorDecorationType({
    textDecoration: 'none; display: none;', // a hack to inject custom style
  })
  let decorations: DecorationMatch[] = []
  let editor: TextEditor | undefined

  function updateDecorations() {
    if (!editor)
      return

    if (!config.enabled) {
      editor.setDecorations(InlineNameDecoration, [])
      editor.setDecorations(HideTextDecoration, [])
      return
    }

    const { document } = editor
    const text = document.getText()
    const colors: [Range, ColorEntry][] = []
    const regex = /(#(?:[\da-f]{3}){1,2}|(?:rgb|hsl)a?\([\d.,% ]+\))/gi
    let match
    // eslint-disable-next-line no-cond-assign
    while ((match = regex.exec(text)) !== null) {
      const colorCode = match[0]
      const colorEntry = colorNameEntries.value.find(([colorString]) => tinycolor.equals(colorCode, colorString))
      if (!colorEntry)
        continue

      const startPos = document.positionAt(match.index)
      const endPos = document.positionAt(match.index + match[0].length)
      colors.push([new Range(startPos, endPos), colorEntry])
    }
    decorations = colors.map(([range, [key, name]]): DecorationMatch => {
      const color = tinycolor(key)
      return {
        key,
        range,
        renderOptions: {
          before: {
            contentText: name,
            backgroundColor: key,
            color: color.isDark() ? '#eee' : '#222',
          },
        },
        hoverMessage: getColorMarkdown([key, name]),
      }
    })
    refreshDecorations()
  }

  function refreshDecorations() {
    if (!editor)
      return

    if (!config.enabled) {
      editor.setDecorations(InlineNameDecoration, [])
      editor.setDecorations(HideTextDecoration, [])
      return
    }

    editor.setDecorations(InlineNameDecoration, decorations)
    if (config.inplace) {
      editor.setDecorations(
        HideTextDecoration,
        decorations
          .map(({ range }) => range)
          .filter(i => i.start.line !== editor!.selection.start.line),
      )
    }
    else {
      editor.setDecorations(HideTextDecoration, [])
    }
  }

  function updateEditor(_editor?: TextEditor) {
    if (!_editor || editor === _editor)
      return
    editor = _editor
    decorations = []
  }

  let timeout: NodeJS.Timer | undefined
  function triggerUpdateDecorations(_editor?: TextEditor) {
    updateEditor(_editor)

    if (timeout) {
      clearTimeout(timeout)
      timeout = undefined
    }
    timeout = setTimeout(() => {
      updateDecorations()
    }, 200)
  }

  window.onDidChangeActiveTextEditor((e) => {
    triggerUpdateDecorations(e)
  }, null, ctx.subscriptions)

  workspace.onDidChangeTextDocument((event) => {
    if (window.activeTextEditor && event.document === window.activeTextEditor.document)
      triggerUpdateDecorations(window.activeTextEditor)
  }, null, ctx.subscriptions)

  workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration('what-color-is-this')) {
      onConfigUpdated()
      triggerUpdateDecorations()
    }
  }, null, ctx.subscriptions)

  window.onDidChangeVisibleTextEditors((editors) => {
    triggerUpdateDecorations(editors[0])
  }, null, ctx.subscriptions)

  window.onDidChangeTextEditorSelection((e) => {
    updateEditor(e.textEditor)
    refreshDecorations()
  })

  // on start up
  updateEditor(window.activeTextEditor)
  triggerUpdateDecorations()
}
