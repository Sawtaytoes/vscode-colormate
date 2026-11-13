import { unlink, writeFile } from "node:fs/promises"
import path from "node:path"
import { performance } from "node:perf_hooks"
import expect from "expect"
import { before } from "mocha"
import vscode from "vscode"

import { colorize } from "./colorize"

const fileContents = `
const someFunction = ({} = {}) => {}
const someFunction2 = ({}) => {}
const someFunction3 = ({}) => {}
const someFunction4 = ({}) => {}
const yoyo = () => {}
const someFunction23 = () => {}
const someFunction20 = () => {}

someFunction
someFunction23
someFunction20
someFunction4

const returnValue = (
  someFunction({
    username: 'admin',
    password: 'password',
  })
)

someFunction() // This is the wrong color in Sublime Text
someFunction2({})

console.log(
  returnValue
)
`

const performanceTest = async () => {
  const filePath = path.join(
    __dirname,
    `./colorizeTest-${Math.random()}.js`,
  )

  await writeFile(filePath, fileContents, "utf-8")

  await vscode.workspace
    .openTextDocument(vscode.Uri.file(filePath))
    .then((doc) => vscode.window.showTextDocument(doc))

  const startTime = performance.now()

  await colorize(
    vscode.window.activeTextEditor as vscode.TextEditor,
  )

  const endTime = performance.now() - startTime

  console.info(
    "`colorize` took",
    endTime.toFixed(2),
    "milliseconds.",
  )

  await vscode.commands.executeCommand(
    "workbench.action.closeActiveEditor",
  )

  await unlink(filePath)

  expect(endTime).toBeLessThan(2000)
}

// The built-in TypeScript server starts on the first JavaScript file and
// takes seconds to answer its first semantic-token request. That start-up
// is not `colorize`'s cost, so wait for it before timing anything.
const semanticTokensWarmUpTimeout = 30_000

const waitForSemanticTokens = async () => {
  const filePath = path.join(
    __dirname,
    `./colorizeWarmUp-${Math.random()}.js`,
  )

  await writeFile(filePath, fileContents, "utf-8")

  const document = await vscode.workspace.openTextDocument(
    vscode.Uri.file(filePath),
  )

  await vscode.window.showTextDocument(document)

  const deadline =
    performance.now() + semanticTokensWarmUpTimeout

  let hasSemanticTokens = false

  while (
    !hasSemanticTokens &&
    performance.now() < deadline
  ) {
    const semanticTokens =
      await vscode.commands.executeCommand<
        vscode.SemanticTokens | undefined
      >(
        "vscode.provideDocumentSemanticTokens",
        document.uri,
      )

    hasSemanticTokens = Boolean(semanticTokens)

    if (!hasSemanticTokens) {
      await new Promise((resolve) => {
        setTimeout(resolve, 250)
      })
    }
  }

  await vscode.commands.executeCommand(
    "workbench.action.closeActiveEditor",
  )

  await unlink(filePath)

  // Without semantic tokens, `colorize` takes its TextMate-only path, and
  // the timing tests below would no longer measure the full pipeline.
  if (!hasSemanticTokens) {
    throw new Error(
      `No semantic tokens within ${semanticTokensWarmUpTimeout} ms.`,
    )
  }
}

suite("colorize", () => {
  before(async () => {
    await vscode.commands.executeCommand(
      "workbench.action.closeActiveEditor",
    )

    await waitForSemanticTokens()
  })

  test(
    "Runs within a given timeframe - try 1",
    performanceTest,
  )

  test(
    "Runs within a given timeframe - try 2",
    performanceTest,
  )

  test(
    "Runs within a given timeframe - try 3",
    performanceTest,
  )

  test(
    "Runs within a given timeframe - try 4",
    performanceTest,
  )

  test(
    "Runs within a given timeframe - try 5",
    performanceTest,
  )

  test(
    "Runs within a given timeframe - try 6",
    performanceTest,
  )

  test(
    "Runs within a given timeframe - try 7",
    performanceTest,
  )

  test(
    "Runs within a given timeframe - try 8",
    performanceTest,
  )

  test(
    "Runs within a given timeframe - try 9",
    performanceTest,
  )

  test(
    "Runs within a given timeframe - try 10",
    performanceTest,
  )
})
