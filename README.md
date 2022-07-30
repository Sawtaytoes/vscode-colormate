# CodeMate for Visual Studio Code
![ColorMate logo by Noah Raskin](images/logo.png)

The best Semantic highlighting for VSCode!

ColorMate colors all similarly named variables the same, so you can quickly and easily skim your code by reading colors instead of text. The hashing algorithm is modeled after the same amazing CRC8 hasher used by [Colorcoder for Sublime Text](https://packagecontrol.io/packages/Colorcoder).

ColorMate is a semantic highlighter (similar to a syntax highlighter) that gives each identifier (variable, method, function, etc) the same color each time that particular identifier appears.

Built by a long-time user of [Colorcoder for Sublime Text](https://packagecontrol.io/packages/Colorcoder), this solves a specific set of accessibility requirements for code skimming.

This package was originally forked from [Color Identifiers](https://marketplace.visualstudio.com/items?itemName=MatthewNespor.vscode-color-identifiers-mode) by Matthew Nespor.

## Features

This extension works for any language that has semantic tokens in Visual Studio Code. It uses the language server to determine which words to highlight.

It changes the color settings based on a light or dark theme.

<!-- ![feature X](images/screenshot_00.png)
![feature X](images/screenshot_01.png) -->

## Extension Settings

This extension contributes the following settings:

* `colormate.tokenKinds`: The types of language tokens that should have a color applied.
* `colormate.ignoredLanguages`: Don't colorize files in these languages.

## Special Thanks
Beautiful logo curtesy of [Noah Raskin](https://twitter.com/NoahRaskin_).
