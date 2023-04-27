import type { DecorationOptions } from 'vscode'

export interface DecorationMatch extends DecorationOptions {
  key: string
}

export type ColorEntry = [string, string]
