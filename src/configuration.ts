import vscode from 'vscode'

export function updateConfiguration() { 
	const configuration = vscode.workspace.getConfiguration('colorcoder')
	
	tokenKinds = new Set(configuration.get('tokenKinds') ?? [
		'class',
		'decorator',
		'enum',
		'event',
		'function',
		'label',
		'macro',
		'method',
		'namespace',
		'parameter',
		'property',
		'type',
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
