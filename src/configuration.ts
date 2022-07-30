import vscode from 'vscode'

export const updateConfiguration = () => { 
	const configuration = (
		vscode
		.workspace
		.getConfiguration(
			'colormate'
		)
	)

	ignoredLanguages = (
		new Set(
			(
				configuration
				.get(
					'ignoredLanguages'
				)
			)
			?? []
		)
	)

	tokenKinds = (
		new Set(
			(
				configuration
				.get(
					'tokenKinds'
				)
			)
			?? [
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
			]
		)
	)
}

export let ignoredLanguages: (
	Set<
		string
	>
)

export let tokenKinds: (
	Set<
		string
	>
)

vscode
.workspace
.getConfiguration(
	'colormate'
)
