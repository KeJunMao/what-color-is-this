import { window } from 'vscode'

const _log = window.createOutputChannel('What Color Is This')
export const log = {
  info: (...args: any[]) => {
    // eslint-disable-next-line no-console
    console.log(...args)
    const time = new Date().toLocaleTimeString()
    _log.appendLine(`[INFO ${time}] ${args.join(' ')}`)
  },
  error: (...args: any[]) => {
    console.error(...args)
    const time = new Date().toLocaleTimeString()
    for (let i = 0; i < args.length; i++) {
      if (args[i] instanceof Error) {
        const err = args[i] as Error
        args[i] = `[Error ${err.name}] ${err.message}\n${err.stack}`
      }
    }
    _log.appendLine(`[Error ${time}] ${args.join(' ')}`)
  },
} as const
