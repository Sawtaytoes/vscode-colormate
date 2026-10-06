import { copyFile, mkdir } from "node:fs/promises"
import { createRequire } from "node:module"
import esbuild from "esbuild"

const production = process.argv.includes("--production")
const watch = process.argv.includes("--watch")

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
  name: "esbuild-problem-matcher",

  setup(build) {
    build.onStart(() => {
      console.log("[watch] build started")
    })
    build.onEnd((result) => {
      result.errors.forEach(({ text, location }) => {
        console.error(`✘ [ERROR] ${text}`)
        console.error(
          `    ${location.file}:${location.line}:${location.column}:`,
        )
      })
      console.log("[watch] build finished")
    })
  },
}

async function main() {
  const require = createRequire(import.meta.url)
  await mkdir("dist", { recursive: true })
  await copyFile(
    require.resolve("vscode-oniguruma/release/onig.wasm"),
    "dist/onig.wasm",
  )

  const ctx = await esbuild.context({
    entryPoints: ["src/extension.ts"],
    bundle: true,
    format: "cjs",
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    platform: "node",
    outfile: "dist/extension.js",
    external: ["vscode"],
    logLevel: "silent",
    plugins: [
      /* add to the end of plugins array */
      esbuildProblemMatcherPlugin,
    ],
  })
  if (watch) {
    await ctx.watch()
  } else {
    await ctx.rebuild()
    await ctx.dispose()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
