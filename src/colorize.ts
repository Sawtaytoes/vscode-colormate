import vscode, { ColorThemeKind } from 'vscode'
import { rangesByName } from './rangesByName'
import { ignoredLanguages } from "./configuration"
import { crc8Hash } from './crc8Hash'
import { hslToHexColor } from './hslToHexColor'

export async function colorize(editor: vscode.TextEditor): Promise<void> {
	const uri = editor.document.uri
	if (uri == null || ignoredLanguages.has(editor.document.languageId)) { return }

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

		const color = (
			hslToHexColor(
				crcHex * (360 / 256),
				(
					isLightTheme
					? 100
					: 62
				),
				(
					isLightTheme
					? 35
					: 65
				),
			)
		)

		const hexColor = (
			vscode
			.window
			.createTextEditorDecorationType({
				color,
			})
		)

		editor
		.setDecorations(
			hexColor,
			ranges,
		)
	})
}
