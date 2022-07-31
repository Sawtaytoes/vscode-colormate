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

export const getSemanticTokenTypes: (
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

export const getTextMateTokenScopes: (
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
      'entity.name.tag.tsx',
      'meta.tag.tsx',
      'support.class.component.tsx',
      'support.type.property-name.json',
      'variable.other.readwrite.alias.ts',
      'variable.other.readwrite.alias.tsx',
    ]
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
      ?? 60
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
      ?? 100
    ),
    getSaturation: () => (
      getConfiguration()
      .get(
        'highContrastDarkTheme.saturation'
      ) as number
      ?? 50
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
      ?? 50
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
