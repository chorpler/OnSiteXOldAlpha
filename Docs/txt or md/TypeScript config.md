# Nightly drops: typescript@next

```cmd
npm install --save-dev typescript@next
```

### Visual Studio Code

Install the npm package npm install typescript@next, to your local node_modules folder.
Update, .vscode/settings.json with the following:

```json
"typescript.tsdk": "<path to your folder>/node_modules/typescript/lib"
```

### Sublime Text

Install the npm package npm install typescript@next, to a local node_modules folder, then
Update the Settings - User file with the following:

```json
"typescript_tsdk": "<path to your folder>/node_modules/typescript/lib"
//   "typescript_tsdk": "./node_modules/typescript/lib" // local project rel path
```

```json
// current Sublime Settings:
{
  "always_show_minimap_viewport": true,
  "auto_complete_delay": 10,
  "color_scheme": "Packages/Gutter Color/Monokai Extended Bright (SL).gcfix.tmTheme",
  "detect_indentation": true,
  "draw_minimap_border": true,
  "draw_white_space": "all",
  "enable_typescript_language_service": true,
  "ensure_newline_at_eof_on_save": true,
  "font_face": "Roboto Mono",
  "font_size": 11,
  "ignored_packages":
  [
    "CSS",
    "DocBlockr_with_update_capability",
    "Vintage"
  ],
  "node_path": "C:/code/nodejs/node.exe",
  "tab_size": 2,
  "terminal": "C:/code/cmder/cmder.exe",
  "theme": "Seti.sublime-theme",
  "translate_tabs_to_spaces": true,
  "trim_trailing_white_space_on_save": true,
  "typescript_auto_format": true,
  "typescript_tsdk": "./node_modules/typescript/lib"
}
```

[TypeScript-Sublime-Plugin](https://github.com/Microsoft/TypeScript-Sublime-Plugin#installation)

### Visual Studio 2013 and 2015

Note: Most changes do not require you to install a new version of the VS TypeScript plugin in.
The nightly build currently does not include the full plugin setup, but we are working on publishing an installer on a nightly basis as well.

First, install the npm package with npm install typescript@next to a local node_modules folder, then
Download the VSDevMode.ps1 script.

Also see our wiki page on using a custom language service file.
From a poweshell command window, run:

#### VS 2015:

```json
VSDevMode.ps1 14 -tsScript <path to your folder>/node_modules/typescript/lib
```

#### VS 2013:

```json
VSDevMode.ps1 12 -tsScript <path to your folder>/node_modules/typescript/lib
```
