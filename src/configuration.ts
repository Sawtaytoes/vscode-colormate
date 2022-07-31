import vscode, {
  ColorThemeKind,
} from 'vscode'

const getConfiguration = () => (
  vscode
  .workspace
  .getConfiguration(
    'colormate'
  )
)

export const getIgnoredLanguages: (
  () => (
    Set<
      string
    >
  )
) = () => (
  new Set(
    (
      getConfiguration()
      .get(
        'ignoredLanguages'
      )
    )
    ?? []
  )
)

export const getConfiguredSemanticTokenTypes: (
  () => (
    Set<
      string
    >
  )
) = () => (
  new Set(
    (
      getConfiguration()
      .get(
        'semanticTokenTypes'
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

export const getConfiguredTextMateTokenScopes: (
  () => (
    Set<
      string
    >
  )
) = () => (
  new Set(
    (
      getConfiguration()
      .get(
        'textMateTokenScopes'
      )
    )
    ?? [
      'entity.name.tag',
      'entity.other.attribute-name',
      'support.type.property-name.json',
      'variable.other.readwrite.alias',
    ]
  )
)

export const getExcludedTextMateTokenScopes: (
  () => (
    Set<
      string
    >
  )
) = () => (
  new Set(
    (
      getConfiguration()
      .get(
        'excludedTextMateTokenScopes'
      )
    )
    ?? []
  )
)

export const hslConfig = {
  [
    ColorThemeKind
    .Dark
  ]: {
    getLighting: () => (
      (
        getConfiguration()
        .get(
          'darkTheme.lighting'
        )
      ) as number
      ?? 65
    ),
    getSaturation: () => (
      getConfiguration()
      .get(
        'darkTheme.saturation'
      ) as number
      ?? 65
    ),
  },
  [
    ColorThemeKind
    .HighContrast
  ]: {
    getLighting: () => (
      (
        getConfiguration()
        .get(
          'highContrastDarkTheme.lighting'
        )
      ) as number
      ?? 90
    ),
    getSaturation: () => (
      getConfiguration()
      .get(
        'highContrastDarkTheme.saturation'
      ) as number
      ?? 100
    ),
  },
  [
    ColorThemeKind
    .HighContrastLight
  ]: {
    getLighting: () => (
      (
        getConfiguration()
        .get(
          'highContrastLightTheme.lighting'
        )
      ) as number
      ?? 15
    ),
    getSaturation: () => (
      getConfiguration()
      .get(
        'highContrastLightTheme.saturation'
      ) as number
      ?? 100
    ),
  },
  [
    ColorThemeKind
    .Light
  ]: {
    getLighting: () => (
      (
        getConfiguration()
        .get(
          'lightTheme.lighting'
        )
      ) as number
      ?? 100
    ),
    getSaturation: () => (
      getConfiguration()
      .get(
        'lightTheme.saturation'
      ) as number
      ?? 35
    ),
  },
}
