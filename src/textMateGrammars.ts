// Parts copied and modified from https://github.com/siegebell/scope-info/blob/master/src/extension.ts.
import path from "node:path"
import vscode, { type TextDocument } from "vscode"

import { outputChannel } from "./outputChannel"

interface ExtensionGrammar {
  language?: string
  scopeName?: string
  path?: string
  embeddedLanguages?: { [scopeName: string]: string }
  injectTo?: string[]
}
interface ExtensionPackage {
  contributes?: {
    languages?: {
      id: string
      configuration: string
    }[]
    grammars?: ExtensionGrammar[]
  }
}

export function getScopeName(
  languageId: TextDocument["languageId"],
): string {
  try {
    // `flatMap`, not `reduce` + spread: the accumulator was
    // rebuilt on every extension, which is quadratic over the
    // full extension list.
    const languages: ExtensionGrammar[] =
      vscode.extensions.all.flatMap(
        (extension) =>
          (extension.packageJSON as ExtensionPackage)
            .contributes?.grammars ?? [],
      )

    const matchingLanguages = languages.filter(
      (grammar) => grammar.language === languageId,
    )

    if (matchingLanguages.length > 0) {
      // console.info(`Mapping language ${languageId} to initial scope ${matchingLanguages[0].scopeName}`);
      return matchingLanguages[0].scopeName || ""
    }
  } catch (error) {
    outputChannel.error(error as Error)
  }

  return ""
}

export function getScopeFilePath(
  scopeName: string,
): string {
  // `flatMap`, not `reduce` + spread — same quadratic
  // accumulator as `getScopeName` above.
  const grammars: (ExtensionGrammar & {
    extensionPath: string
  })[] = vscode.extensions.all.flatMap((extension) =>
    (
      (extension.packageJSON as ExtensionPackage)
        .contributes?.grammars ?? []
    ).map((grammar) => ({
      extensionPath: extension.extensionPath,
      ...grammar,
    })),
  )
  const matchingLanguages = grammars.filter(
    (grammar) => grammar.scopeName === scopeName,
  )
  // let match : RegExpExecArray;
  // if (matchingLanguages.length === 0 && (match = /^source[.](.*)/.exec(scopeName)))
  //   matchingLanguages = grammars.filter(g => g.language === match[1]);

  if (matchingLanguages.length > 0) {
    const ext = matchingLanguages[0]
    const file = path.join(
      ext.extensionPath,
      ext.path || "",
    )
    // console.info(`Scope-info: found grammar for ${scopeName} at ${file}`)
    return file
  }

  return ""
}
