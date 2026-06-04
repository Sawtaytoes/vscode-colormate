import {
  window,
  type LogOutputChannel,
} from "vscode"

export const outputChannel: (
  LogOutputChannel
) = (
  window
  .createOutputChannel(
    "ColorMate",
    {
      log: true,
    },
  )
)
