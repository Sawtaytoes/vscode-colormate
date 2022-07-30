import vscode, { ColorThemeKind } from 'vscode'
import { rangesByName } from './rangesByName'
import { ignoredLanguages } from "./configuration"
import { crc8Hash } from './crc8Hash'
import { hslToHexColor } from './hslToHexColor'

const textEditorDecorations = new Map()

export const removePreviousTextEditorDecorations = () => {
	Array
	.from(
		textEditorDecorations
		.entries()
	)
	.forEach(([
		symbol,
		textEditorDecoration,
	]) => {
		textEditorDecoration
		.dispose()

		textEditorDecorations
		.delete(
			symbol
		)
	})
}

export async function colorize(
	editor: vscode.TextEditor,
): Promise<void> {
	const uri = editor.document.uri
	
	if (
		uri == null
		|| ignoredLanguages.has(editor.document.languageId)
	) {
		return
	}

	const [
		legend,
		tokensData,
	] = (
		await (
			Promise
			.all([
				(
					vscode
					.commands
					.executeCommand<
						| (
							vscode
							.SemanticTokensLegend
						)
						| undefined
					>(
						'vscode.provideDocumentSemanticTokensLegend',
						uri,
					)
				),
				(
					vscode
					.commands
					.executeCommand<
						| (
							vscode
							.SemanticTokens
						)
						| undefined
					>(
						'vscode.provideDocumentSemanticTokens',
						uri,
					)
				),
			])
		)
	)

	if (
		tokensData == null
		|| legend == null
	) {
		return
	}

	const rangesBySymbolName = (
		rangesByName(
			tokensData,
			legend,
			editor,
		)
	)

	removePreviousTextEditorDecorations()

	Object
	.entries(
		rangesBySymbolName
	)
	.forEach(([
		symbolName,
		ranges,
	]) => {
		const crcHex = (
			crc8Hash(
				symbolName
			)
		)

		const isLightTheme = (
			(
				vscode
				.window
				.activeColorTheme
				.kind
			)
			=== (
				ColorThemeKind
				.Light
			)
		)

		const hexColor = (
			hslToHexColor(
				(
					crcHex
					* (
						360
						/ 256
					)
				),
				(
					isLightTheme
					? 100
					: 65
				),
				(
					isLightTheme
					? 35
					: 60
				),
			)
		)

		const textEditorDecoration = (
			vscode
			.window
			.createTextEditorDecorationType({
				color: hexColor,
			})
		)

		textEditorDecorations
		.set(
			symbolName,
			textEditorDecoration,
		)

		editor
		.setDecorations(
			textEditorDecoration,
			ranges,
		)
	})
}
