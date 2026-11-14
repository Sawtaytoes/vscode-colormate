import { unlink, writeFile } from "node:fs/promises"
import path from "node:path"
import expect from "expect"
import vscode from "vscode"

import { textEditorDecorationMap } from "./cache"
import { colorize } from "./colorize"
import {
  getColorizeAbortSignal,
  startColorizing,
  stopColorizing,
} from "./colorizeLifecycle"
import { deactivate } from "./extension"
import { removeAllTextEditorDecorations } from "./removeAllTextEditorDecorations"

const fileContents = `
const someFunction = () => {}

someFunction()
`

const openTestEditor = async () => {
  const filePath = path.join(
    __dirname,
    `./colorizeLifecycle-${Math.random()}.js`,
  )

  await writeFile(filePath, fileContents, "utf-8")

  const document = await vscode.workspace.openTextDocument(
    vscode.Uri.file(filePath),
  )

  const editor =
    await vscode.window.showTextDocument(document)

  return { editor, filePath }
}

const closeTestEditor = async (filePath: string) => {
  await vscode.commands.executeCommand(
    "workbench.action.closeActiveEditor",
  )

  await unlink(filePath)
}

suite("colorizeLifecycle", () => {
  teardown(() => {
    startColorizing()

    removeAllTextEditorDecorations()
  })

  test("A new start replaces an aborted signal", () => {
    stopColorizing()

    expect(getColorizeAbortSignal().aborted).toBe(true)

    startColorizing()

    expect(getColorizeAbortSignal().aborted).toBe(false)
  })

  test("A start keeps a signal that is not aborted", () => {
    const abortSignal = getColorizeAbortSignal()

    startColorizing()

    expect(getColorizeAbortSignal()).toBe(abortSignal)
  })

  test("Colorizes an editor while active", async () => {
    const { editor, filePath } = await openTestEditor()

    try {
      await colorize(editor)

      expect(textEditorDecorationMap.has(editor)).toBe(true)
    } finally {
      await closeTestEditor(filePath)
    }
  })

  test("Adds no decorations when deactivated mid-call", async () => {
    const { editor, filePath } = await openTestEditor()

    try {
      // `colorize` runs until its first `await`, so this call is waiting
      // on VS Code when `deactivate` runs.
      const colorizing = colorize(editor)

      deactivate()

      await colorizing

      expect(textEditorDecorationMap.has(editor)).toBe(
        false,
      )
    } finally {
      await closeTestEditor(filePath)
    }
  })

  test("Does nothing when called after deactivation", async () => {
    const { editor, filePath } = await openTestEditor()

    try {
      deactivate()

      await colorize(editor)

      expect(textEditorDecorationMap.has(editor)).toBe(
        false,
      )
    } finally {
      await closeTestEditor(filePath)
    }
  })
})
