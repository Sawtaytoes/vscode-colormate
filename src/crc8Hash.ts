import {
  crc8HashTable,
} from "./crc8HashTable"

export const crc8Hash = (
  word: string,
) => (
  Array
  .from(
    word
  )
  .map((
    character,
  ) => (
    character
    .charCodeAt(
      0
    )
  ))
  .map((
    characterCode,
  ) => (
    characterCode
    % 256
  ))
  .reduce(
    (
      crcHash,
      eightBitCharacterCode,
    ) => (
      crc8HashTable[
        crcHash
        ^ eightBitCharacterCode
      ]
    ),
    0,
  )
)
