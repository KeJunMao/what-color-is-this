import type * as vscode from 'vscode'
import { RegisterDecorator } from './decorator'
import { RegisterCommands } from './commands'
import { RegisterCompletion } from './completions'

export function activate(ctx: vscode.ExtensionContext) {
  RegisterDecorator(ctx)
  RegisterCommands(ctx)
  RegisterCompletion(ctx)
}

export function deactivate({ subscriptions }: vscode.ExtensionContext) {
  subscriptions.forEach(subscription => subscription.dispose())
}
