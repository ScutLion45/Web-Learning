# Monaco API-DOC Learning

## Functions
### `monaco.editor.create`

> Create a new editor under `domElement`. The `domElement` should be empty (not contain other dom nodes). The editor will read the size of `domElement`.

> **@ Parameters**
>
> |param|interface|
> |--|--|
> |`domElement`|`HTMLElement`|
> |`options` [Optional]|[`IStandaloneEditorConstructionOptions`](#`IStandaloneEditorConstructionOptions`)|
> |`override` [Optional]|`IEditorOverrideServices`|

> **@ Returns**
> 
> [`IStandaloneCodeEditor`](#`IStandaloneCodeEditor`)

---
## Interfaces
### `IStandaloneCodeEditor`

#### Hierarchy
> - `IEditor`
>   - `ICodeEditor`
>     - `IStandaloneCodeEditor`

#### Methods
##### $ `getSelection`
> - `getSelection()`: `Selection` | `null`
> 
> > Get the primary selection of the editor

##### $ `getSelections`
> - `getSelections()`: `Selection`[] | `null`
> 
> > Get all the selections of the editor

##### $ `getValue`
> - `getValue(options?: { lineEnding: string; preserveBOM: boolean })`: `string`
> 
> > Get value of the current model attached to this editor
> 
> > See [`ITextModel.getValue`](#`ITextModel`)

##### $ `setValue`
> - `setValue(newValue: string)`: `void`
>
> > Set the value of the current model attached to this editor.
>
> > See [`ITextModel.setValue`](#`ITextModel`)

##### $ `updateOptions`
> - `updateOptions(newOptions`: `IEditorOptions` & `IGlobalEditorOptions)`: `void`
>
> > Overrides `IEditor.updateOptions`
>
> > Update the editor's options **after the editor has been created.**


### `ITextModel`
> created by Function `monaco.editor.createModel`

#### Methods
##### $ `getValue`
> - `getValue(eol?`: `EndOfLinePreference`, `preserveBOM?: boolean)`: `string`
>
> > Get the text stored in this model.
>
> **@ Parameters**
>
> |param|interface|description|
> |--|--|--|
> |`eol` [Optional]|[`EndOfLinePrefrence`](https://microsoft.github.io/monaco-editor/api/enums/monaco.editor.endoflinepreference.html)|The end of line character preference. Defaults to `EndOfLinePreference.TextDefined`.|
> |`preserveBOM` [Optional]|`boolean`||
>
> **@ Returns**
>
> `string`. The text.

##### $ `setValue`
> - `setValue(newValue: string)`: `void`
>
> > Replace the entire text buffer value contained in this model.


---
## Options
### `IStandaloneEditorConstructionOptions`

#### Hierarchy
> - `IEditorOptions`
>   - `IGlobalEditorOptions`
>     - `IStandaloneEditorConstructionOptions`

#### Essential Properties
> - [`value`](#$`value`)
> - [`language`](#$`language`)
> - [`theme`](#$`theme`)
> - [`minimap`](#$`minimap`)
> - [`wordWrap`](#$`wordWrap`)
> - [`automaticLayout`](#$`automaticLayout`)
> - [`readonly`](#$`readonly`)

#### Properties
> Only list the most important properties.

##### $ `autoClosingBrackets`
> Optional Values: `"always"` | `"languageDefined"`(default) | `"beforeWhitespace"` | `"never"`
>
> > Options for auto closing brackets(括号). **Defaults to** language defined behavior.

##### $ `autoClosingQuotes`
> Optional Values: `"always"` | `"languageDefined"`(default) | `"beforeWhitespace"` | `"never"`
>
> > Options for auto closing quotes(引号). Defaults to language defined behavior.

##### $ `automaticLayout`
> Optional Values: `true` | `false`(default)
>
> > Enable that the editor will install an interval to check if its container dom node size has changed. Enabling this might have a severe performance impact. **Defaults to** `false`.

##### $ `codeLens`
> Optional Values: `true`(default) | `false`
>
> > Show code lens. Defaults to true.

##### $ `comments`
> Interface: `IEditorCommentsOptions`

```
{
  ignoreEmptyLines: boolean,  // Ignore empty lines when inserting
                              // line comments. 
                              // Defaults to true.
  insertSpace: boolean        // Insert a space after the line comment
                              // token and inside the block comments tokens.
                              // Defaults to true.
}
```
>
> > Control the behaviour of comments in the editor.

##### $ `detectIndentation`
> Optional Values: `true`(default) | `false`
>
> > Controls whether [`tabSize`](#$`tabSize`) and [`insertSpaces`](#$`insertSpaces`) will be automatically detected when a file is opened based on the file contents. Defaults to true.
> > See [`tabSize`](#$`tabSize`)

##### $ `dimension`
> Interface: `IDemension`

```
{
  height: number,
  width: number
}
```

> > The initial editor dimension (to avoid measuring the container).

##### $ `emptySelectionClipboard`
> Optional Values: `true`(default) | `false`
>
> > Copying without a selection copies the current line. Defaults to true.

##### $ `extraEditorClassName`
> Type: `string`
>
> > Class name to be added to the editor.

##### $ `folding`
> Optional Values: `true`(default) | `false`
>
> > Enable code folding. Defaults to `true`.
> > See [`showFoldingControls`](#$`showFoldingControls`)

##### $ `foldingHighlight`
> Optional Values: `true`(default) | `false`
>
> > Enable highlight for folded regions. Defaults to true.

##### $ `foldingStrategy`
> Optional Values: `"auto"`(default) | `"indentation"`
>
> > Selects the folding strategy. `'auto'` uses the strategies contributed for the current document, `'indentation'` uses the indentation based folding strategy. Defaults to `'auto'`.

##### $ `fontFamily`
> Type: `string`
>
> >  The font family.

##### $ `fontLigatures`
> Type: `boolean` | `string`
>
> >  Enable [font ligatures(连字)](https://jareddev.com/blog/post/vs-code-upgrade-your-font-ligatures). **Defaults to** `false`.

##### $ `fontSize`
> Type: `number`
>
> > The font size.

##### $ `fontWeight`
> Type: `string`
>
> > The font weight.

##### $ `highlightActiveIndentGuide`
> Optional Values: `true`(default) | `false`
>
> > Enable highlighting of the active indent guide. Defaults to true.
> > See [`renderIndentGuides`](#$`renderIndentGuides`)

##### $ `insertSpaces`
> Optional Values: `true`(default) | `false`
>
> > Insert spaces when pressing `Tab`. This setting is overridden based on the file contents when `detectIndentation` is on. Defaults to true.

##### $ `language`
> Type: `string`
>
> > The initial language of the auto created model([`ITextModel`](#`ITextModel`)) in the editor. To not create automatically a model, use `model: null`.

##### $ `letterSpacing`
> Type: `number`
>
> > The letter spacing.

##### $ `lineNumber`
> Interface: `LineNumbersType`

```
LineNumbersType: "on" | "off" | "relative" | "interval" | ((lineNumber: number) => string)
```

> > Control the rendering of line numbers. If it is a `function`, it will be invoked when rendering a line number and the return value will be rendered. Otherwise, if it is a `truey`, line numbers will be rendered normally (equivalent of using an identity function). Otherwise, line numbers will not be rendered. **Defaults to** `"on"`.

##### $ `lineNumbersMinChars`
> Type: `number`(defaults to `5`)
>
> > Control the width of line numbers, by reserving horizontal space for rendering at least an amount of digits. **Defaults to** `5`.

##### $ `links`
> Optional Values: `true`(default) | `false`
>
> > Enable detecting links and making them clickable. Defaults to true.

##### $ `matchBrackets`
> Optional Values: `"never"` | `"near"` | `"always"`(default)
>
> > Enable highlighting of matching brackets. Defaults to `'always'`.

##### $ `maxTokenizationLineLength`
> Type: `number`(defaults to `20000`)
>
> > Lines above this length will not be tokenized for performance reasons. Defaults to `20000`.

##### $ `minimap`
> Interface: [`IEditorMinimapOptions`](#`IEditorMinimapOptions`)
>
> > Control the behavior and rendering of the minimap(侧边栏预览).

##### $ `model`
> Interface: [`ITextModel`](#`ITextModel`)
>
> The initial model associated with this code editor.

##### $ `mouseStyle`
> Optional Values: `"copy"` | `"default"` | `"text"`(default)
>
> > Control the mouse pointer style. Defaults to `'text'`

##### $ `mouseWheelZoom`
> Optional Values: `true` | `false`(default)
>
> > Zoom the font in the editor when using the mouse wheel in combination with holding `CtrlKey`. **Defaults to** `false`.

##### $ `multiCursorModifier`
> Optional Values: `alt`(default) | `ctrlCmd`
>
> The modifier to be used to add multiple cursors with the mouse. Defaults to `'alt'`

##### $ `occurrencesHighlight`
> Optional Values: `true`(default) | `false`
>
> > Enable semantic occurrences(语法错误) highlight. Defaults to true.

##### $ `padding`
> Interface: `IEditorPaddingOptions`

```
{
  bottom: number, // Spacing between bottom edge of editor and last line.
  top: number     // Spacing between top edge of editor and first line.
}
```

> > Controls the spacing around the editor.

##### $ `parameterHints`
> Interface: `IEditorParameterHintOptions`

```
{
  cycle: boolean,   // Enable cycling of parameter hints.
                    // Defaults to **false**.
  enabled: boolean  // Enable parameter hints. Defaults to true.
}
```

> > Parameter hint options.

##### $ `quickSuggestions`
> Interface: `boolean` | `IQuickSuggestionsOptions`
>
> > Enable quick suggestions (shadow suggestions) **Defaults** to `true`.

##### $ `readonly`
> Optional Values: `true` | `false`(default)
>
> > Should the editor be read only. **Defaults to** `false`.

##### $ `renderIndentGuides`
> Optional Values: `true`(default) | `false`
>
> > Enable rendering of indent guides. Defaults to true.

##### $ `renderLineHighlight`
> Optional Values: `"all"`(default) | `"gutter"` | `"line"` | `"none"`
>
> > Enable rendering of current line highlight. Defaults to `'all'`.

##### $ `renderLineHighlightOnlyWhenFocus`
> Optional Values: `true` | `false`(default)
>
> > Control if the current line highlight should be rendered only the editor is focused. **Defaults to** `false`.


##### $ `roundedSelection`
> Optional Values: `true`(default) | `false`
>
> > Render the editor selection with rounded borders. Defaults to true.

##### $ `scrollBeyondLastColumn`
> Type: `number`(defaults to `5`)
>
> > Enable that scrolling can go beyond the last column by a number of columns. Defaults to `5`.

##### $ `scrollBeyondLastLine`
> Optional Values: `true`(default) | `false`
>
> > Enable that scrolling can go one screen size after the last line. Defaults to true.

##### $ `scrollbar`
> Interface: [`IEditorScrollbarOptions`](#$`IEditorScrollbarOptions`)
>
> > Control the behavior and rendering of the scrollbars.

##### $ `selectOnLineNumbers`
> Optional Values: `true`(default) | `false`
>
> > Should the corresponding line be selected when clicking on the line number? Defaults to true.

##### $ `selectionHighlight`
> Optional Values: `true`(default) | `false`
>
> > Enable selection highlight. Defaults to true.

##### $ `semanticHighlighting.enabled`
> Optional Values: `true` | `false` | `"configuredByTheme"`(default)
>
> > Controls whether the semanticHighlighting is shown for the languages that support it. 
> >   - `true`: semanticHighlighting is enabled for all themes
> >   - `false`: semanticHighlighting is disabled for all themes
> >   - `'configuredByTheme'`: semanticHighlighting is controlled by the current color theme's semanticHighlighting setting.
> >
> > Defaults to `'byTheme'`.

##### $ `showDeprecated`
> Optional Values: `true` | `false`
>
> > Controls strikethrough(删除线) deprecated(不推荐使用) variables.

##### $ `showFoldingControls`
> Optional Values: `"always"` | `"mouseover"`(default)
>
> > Controls whether the fold actions in the gutter stay always visible or hide unless the mouse is over the gutter. Defaults to `'mouseover'`.

##### $ `showUnused`
> Optional Values: `true` | `false`
>
> > Controls fading out of unused variables.

##### $ `smoothScrolling`
> Optional Values: `true` | `false`(default)
>
> > Enable that the editor animates scrolling to a position. **Defaults to** `false`.

##### $ `stopRenderingLineAfter`
> Type: `number`(defaults to `10000`)
>
> > Performance guard: Stop rendering a line after x characters. Defaults to `10000`. Use `-1` to never stop rendering.

##### $ `suggest`
> Interface: [`ISuggestOptions`](#`ISuggestOptions`)
>
> > Suggest options.
> > See [`suggestFontSize`](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.istandaloneeditorconstructionoptions.html#suggestfontsize)

##### $ `suggestSelection`
> Optional Values: `"first` | `"recentlyUsed"`(default) | `"recentlyUsedByPrefix"`
>
> > The history mode for suggestions.
> >   - `'first'`: 始终选择第一个建议；
> >   - `'recentlyUsed'`(default): 选择最近的建议，除非进一步键入其他选择项。例如`console. -> console.log`，因为最近补全过`log`；
> >   - `'recentlyUsedByPrefix'`: 根据之前补全过的建议的前缀来选择。例如`co -> console.log`、`con -> const`。

##### $ `tabSize`
> Type: `number`(defaults to `4`)
>
> > The number of spaces a tab is equal to. This setting is **overridden** based on the file contents when [`detectIndentation`](#$`detectIndentation`) is on. Defaults to `4`.

##### $ `theme`
> Optional Values: `"vs"`(default) | `"vs-dark"` | `"hc-dark"`
>
> > Initial theme to be used for rendering. You can create custom themes via `monaco.editor.defineTheme`. To switch a theme, use `monaco.editor.setTheme`.

##### $ `unfoldOnClickAfterEndOfLine`
> Optional Values: `true` | `false`(default)
>
> > Controls whether clicking on the empty content after a folded line will unfold the line. **Defaults to** `false`.

##### $ `value`
> Type: `string`
>
> > The initial value of the auto created model in the editor. To not create automatically a model, use `model`: `null`.

##### $ `wordWrap`
> Optional Values: `"off"`(default) | `"on"` | `"wordWrapColumn"` | `"bounded"`
>
> > Control the wrapping of the editor.
> >   - `'off'`(default): the lines will **never** wrap;
> >   - `'on'`: the lines will wrap at the viewport width;
> >   - `'wordWrapColumn'`: the lines will wrap at [`wordWrapColumn`](#$`wordWrapColumn`);
> >   - `'bounded'`: the lines will wrap at min(viewport width, [`wordWrapColumn`](#$`wordWrapColumn`)).

##### $ `wordWrapColumn`
> Type: `number`(defaults to `80`)
>
> > See [`wordWrap`](#$`wordWrap`)

##### $ `wrappingIndent`
> Optional Values: `"none"`(default in monaco-editor) | `"same"`(default in vscode) | `"indent"` | `"deepIndent"`
>
> > Control indentation of wrapped lines.
> >   - `'none'`(default in monaco-editor): 没有缩进。折行从第`1`列开始；
> >   - `'same'`(default in vscode): 折行的缩进量与其父级相同；
> >   - `'indent'`: 折行的缩进量比起父级多`1`；
> >   - `'deepIndent'`: 折行的缩进量比起父级多`2`；

##### $ `wrappingStrategy`
> Optional Values: `"simple"`(default) | `"advanced"`
>
> > Controls the wrapping strategy to use.



<br>

### `IEditorMinimapOptions`
#### Properties
##### $ `enabled`
> Optional Values: `true`(default) | `false`
>
> > Enable the rendering of the minimap(侧边栏预览). Defaults to true.

##### $ `maxColumn`
> Type: `number`(defaults to `120`)
>
> > Limit the width of the minimap to render at most a certain number of columns. Defaults to 120.

##### $ `renderCharacters`
> Optional Values: `true`(default) | `false`
>
> > Render the actual text on a line (as opposed to color blocks). Defaults to true.

##### $ `scale`
> Type: `number`(defaults to `1`)
>
> > Relative size of the font in the minimap. Defaults to `1`.

##### $ `showSlider`
> Optional Values: `"always"` | `"mouseover"`(default)
>
> > Control the rendering of the minimap slider. Defaults to `'mouseover'`.

##### $ `side`
> Optional Values: `"left"` | `"right"`(default)
>
> > Control the side of the minimap in editor. Defaults to `'right'`.

##### $ `size`
> Optional Values: `"actual"`(default) | `"fill"` | `"fit"` | `"proportional"`
>
> > Control the minimap rendering mode. Defaults to `'actual'`.

<br>

### `IEditorScrollbarOptions`
#### Properties


<br>

### `ISuggestOptions`
#### Properties
