// Parts copied and modified from https://github.com/siegebell/scope-info/blob/master/src/extension.ts.
import path from 'path'
import vscode, {
  TextDocument,
} from 'vscode'

interface ExtensionGrammar {
  language?: string, scopeName?: string, path?: string, embeddedLanguages?: {[scopeName:string]:string}, injectTo?: string[]
}
interface ExtensionPackage {
  contributes?: {
    languages?: {id: string, configuration: string}[],
    grammars?: ExtensionGrammar[],
  }
}

export function getScopeName(
  languageId: (
    TextDocument["languageId"]
  ),
): string {
  try {
    const languages = (
      vscode
      .extensions
      .all
      .filter(x => x.packageJSON && x.packageJSON.contributes && x.packageJSON.contributes.grammars)
      .reduce((a: ExtensionGrammar[],b) => [
        ...a,
        ...(
          (b.packageJSON as ExtensionPackage).contributes?.grammars
          || []
        )
      ], [])
    )

    const matchingLanguages = languages.filter(g => g.language === languageId)
    
    if (matchingLanguages.length > 0) {
      // console.info(`Mapping language ${languageId} to initial scope ${matchingLanguages[0].scopeName}`);
      return matchingLanguages[0].scopeName || ''
    }
  } catch(err) { }

  return ''
}

export function getScopeFilePath(
  scopeName: string,
): string {
  const grammars =
    vscode.extensions.all
    .filter(x => x.packageJSON && x.packageJSON.contributes && x.packageJSON.contributes.grammars)
    .reduce((a: (ExtensionGrammar&{extensionPath: string})[],b) => [
        ...a,
        ...((
          b.packageJSON as ExtensionPackage).contributes?.grammars
          || []
        ).map(x => Object.assign({extensionPath: b.extensionPath}, x))
      ], [])
  const matchingLanguages = grammars.filter(g => g.scopeName === scopeName)
  // let match : RegExpExecArray;
  // if (matchingLanguages.length === 0 && (match = /^source[.](.*)/.exec(scopeName)))
  //   matchingLanguages = grammars.filter(g => g.language === match[1]);
  
  if (matchingLanguages.length > 0) {
    const ext = matchingLanguages[0]
    const file = path.join(ext.extensionPath, ext.path || '')
    // console.info(`Scope-info: found grammar for ${scopeName} at ${file}`)
    return file
  }

  return ''
}
