import type { ExtensionContext } from 'vscode'
import { commands } from 'vscode'
import { config } from './config'

export function RegisterCommands(ctx: ExtensionContext) {
  ctx.subscriptions.push(
    commands.registerCommand('what-color-is-this.toggle-enabled', () => {
      config.enabled = !config.enabled
    }),
  )

  ctx.subscriptions.push(
    commands.registerCommand('what-color-is-this.toggle-inplace', () => {
      config.inplace = !config.inplace
    }),
  )
}
