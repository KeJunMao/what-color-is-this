import type * as vscode from 'vscode'
import { version } from '../package.json'
import { RegisterDecorator } from './decorator'
import { RegisterCommands } from './commands'
import { RegisterCompletion } from './completions'
import { log } from './log'

export function activate(ctx: vscode.ExtensionContext) {
  log.info('RegisterDecorator')
  RegisterDecorator(ctx)
  log.info('RegisterCommands')
  RegisterCommands(ctx)
  log.info('RegisterCompletion')
  RegisterCompletion(ctx)
  log.info(`Activated, v${version}`)
}

export function deactivate() {
  log.info('🈚 Deactivated')
}
