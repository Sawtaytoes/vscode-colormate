import {
  createAction,
} from '@reduxjs/toolkit'
import {
  ExtensionContext,
  TextEditor
} from 'vscode'

export const addEditor = (
  createAction<
    TextEditor
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

export const colorize = (
  createAction(
    'colorize'
  )
)
