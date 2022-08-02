import expect from 'expect'

import {
  crc8Hash,
} from './crc8Hash'

suite(
  'crc8Hash',
  () => {
    test(
      'Has the correct hash when no identifier',
      () => {
        expect(
          crc8Hash(
            ''
          )
        )
        .toBe(
          0
        )
      },
    )

    test(
      'Has the correct hash for "hello"',
      () => {
        expect(
          crc8Hash(
            'hello'
          )
        )
        .toBe(
          0x92
        )
      },
    )

    test(
      'Has the correct hash for "world"',
      () => {
        expect(
          crc8Hash(
            'world'
          )
        )
        .toBe(
          0xB3
        )
      },
    )

    test(
      'Has the correct hash for "someFunction"',
      () => {
        expect(
          crc8Hash(
            'someFunction'
          )
        )
        .toBe(
          0x14
        )
      },
    )

    test(
      'Has the correct hash for "someFunction2"',
      () => {
        expect(
          crc8Hash(
            'someFunction2'
          )
        )
        .toBe(
          0xF2
        )
      },
    )
  },
)
