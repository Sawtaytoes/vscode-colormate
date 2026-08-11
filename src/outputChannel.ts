import { type LogOutputChannel, window } from "vscode"

export const outputChannel: LogOutputChannel =
  window.createOutputChannel("ColorMate", {
    log: true,
  })
