import {
  DecorationRangeBehavior,
  window,
} from "vscode"

import {
  hslConfig,
} from "./configuration.js"
import {
  crc8Hash,
} from "./crc8Hash.js"
import {
  hslToHexColor,
} from "./hslToHexColor.js"

export const getTextEditorDecoration = (
  identifier: string,
) => {
  const crcHex = (
    crc8Hash(
      identifier,
    )
  )

  const colorThemeKind = (
    window
    .activeColorTheme
    .kind
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
        hslConfig
        [colorThemeKind]
        .getSaturation()
      ),
      (
        hslConfig
        [colorThemeKind]
        .getLighting()
      ),
    )
  )

  return (
    window
    .createTextEditorDecorationType({
      color: hexColor,
      rangeBehavior: (
        DecorationRangeBehavior
        .ClosedClosed
      ),
      isWholeLine: false,
    })
  )
}
