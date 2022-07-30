import vscode from 'vscode'

export function updateConfiguration() { 
	const configuration = vscode.workspace.getConfiguration('colorcoder')
	
	tokenKinds = new Set(configuration.get('tokenKinds') ?? [
		'class.defaultLibrary',
		'class',
		'enum',
		'enumMember',
		'event',
		'function.defaultLibrary',
		'function',
		'interface',
		'macro',
		'method',
		'namespace',
		'parameter',
		'property.readonly',
		'property',
		'struct',
		'type.defaultLibrary',
		'type',
		'variable.readonly.defaultLibrary',
		'variable.readonly',
		'variable',
	])
	ignoredLanguages = new Set(configuration.get('ignoredLanguages') ?? [])
}

export let tokenKinds: Set<string> = new Set([])
export let ignoredLanguages: Set<string> = new Set()
export let colors = [
	'#FF00FF'
].map(color => vscode.window.createTextEditorDecorationType({ color }))

vscode.workspace.getConfiguration('colorcoder')
