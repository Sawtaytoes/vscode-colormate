import {
  createAction,
} from '@reduxjs/toolkit'
import {
  ExtensionContext,
  TextEditor
} from 'vscode'

export const addEditor = (
  createAction<
    | TextEditor
    | undefined
  >(
    'addEditor'
  )
)

export const addExtensionContext = (
  createAction<
    ExtensionContext
  >(
    'addExtensionContext'
  )
)
