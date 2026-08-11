// Source: https://stackoverflow.com/a/44134328/1624862
export const hslToHexColor = (
  hue: number,
  saturation: number,
  lightness: number,
) => {
  const lightnessFraction = lightness / 100

  const amplitude =
    (saturation *
      Math.min(lightnessFraction, 1 - lightnessFraction)) /
    100

  // `channel` is 0/8/4 — the red/green/blue offsets into the
  // hue wheel that the source formula uses.
  const toHexChannel = (channel: number) => {
    const wheelPosition = (channel + hue / 30) % 12

    const color =
      lightnessFraction -
      amplitude *
        Math.max(
          Math.min(wheelPosition - 3, 9 - wheelPosition, 1),
          -1,
        )

    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0")
  }

  return `#${toHexChannel(0)}${toHexChannel(8)}${toHexChannel(4)}`
}
