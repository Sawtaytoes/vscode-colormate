import debounce from 'just-debounce'
import vscode from 'vscode'

import {
	colorize,
	removePreviousTextEditorDecorations,
} from './colorize'
import {
	updateConfiguration,
} from './configuration'

const colorizeIfNeeded = (
	debounce(
		colorize,
		200,
	)
)

const handleActiveEditorChange = (
	editor: (
		| (
			vscode
			.TextEditor
		)
		| undefined
	)
) => {
	if (editor == null) {
		return
	}

	colorizeIfNeeded(
		editor
	)
}

function handleColorThemeChange() {
	const editor = vscode.window.activeTextEditor
	
	if (editor != null) { 
		colorizeIfNeeded(editor)
	}
}

function handleTextDocumentChange(event: vscode.TextDocumentChangeEvent) {
	const editor = vscode.window.activeTextEditor

	if (editor != null && editor.document === event.document) {
		colorizeIfNeeded(editor)
	}
}

export function activate(context: vscode.ExtensionContext) {
	updateConfiguration()
	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(updateConfiguration))
	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(handleActiveEditorChange))
	context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(handleTextDocumentChange))
	context.subscriptions.push(vscode.window.onDidChangeActiveColorTheme(handleColorThemeChange))

	const editor = vscode.window.activeTextEditor

	if (editor != null) {
		colorizeIfNeeded(editor)
	}
	else {
		removePreviousTextEditorDecorations()
	}
}

export function deactivate() {}
