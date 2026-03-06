import { expect } from "expect"
import {
  before,
} from "mocha"
import path from "path"
import { vol } from "memfs"
import {
  performance,
} from "perf_hooks"
import vscode from "vscode"

import {
  colorize,
} from "./colorize.js"

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
  const filePath = (
    path
    .join(
      __dirname,
      `./colorizeTest-${Math.random()}.js`,
    )
  )

  vol
  .fromJSON({
    [filePath]: fileContents,
  })

  // await (
  //   vol
  //   .promises
  //   .writeFile(
  //     filePath,
  //     fileContents,
  //     {
  //       encoding: "utf-8",
  //     },
  //   )
  // )
  console.log("hi!")

  const realFilePath = (
    await (
      vol
      .promises
      .realpath(
        filePath,
      )
    )
  )

  console.log({ realFilePath })

  await (
    vscode
    .workspace
    .openTextDocument(
      vscode
      .Uri
      .file(
        realFilePath
        .toString(),
      ),
    )
    .then((
      doc,
    ) => (
      vscode
      .window
      .showTextDocument(
        doc,
      )
    ))
  )

  const startTime = (
    performance
    .now()
  )

  await (
    colorize(
      (
        vscode
        .window
        .activeTextEditor
      ) as (
        vscode.TextEditor
      ),
    )
  )

  const endTime = (
    (
      performance
      .now()
    )
    - startTime
  )

  console
  .info(
    "`colorize` took",
    (
      endTime
      .toFixed(
        2,
      )
    ),
    "milliseconds.",
  )

  await (
    vscode
    .commands
    .executeCommand(
      "workbench.action.closeActiveEditor",
    )
  )

  expect(
    endTime,
  )
  .toBeLessThan(
    2000,
  )
}

suite(
  "colorize",
  () => {
    before(() => (
      vscode
      .commands
      .executeCommand(
        "workbench.action.closeActiveEditor",
      )
    ))

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
  },
)
