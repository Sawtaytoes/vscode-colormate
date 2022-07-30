import vscode from 'vscode'

export function updateConfiguration() { 
	const configuration = vscode.workspace.getConfiguration('colorIdentifiersMode')
	tokenKinds = new Set(configuration.get('tokenKinds') ?? [])
	ignoredLanguages = new Set(configuration.get('ignoredLanguages') ?? [])
}

export let tokenKinds: Set<string> = new Set(['variable', 'parameter', 'property'])
export let ignoredLanguages: Set<string> = new Set()
export let colors = [
	'#FF00FF'
].map(color => vscode.window.createTextEditorDecorationType({ color }))

vscode.workspace.getConfiguration('colorIdentifiersMode')
