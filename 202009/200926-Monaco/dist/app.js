import * as monaco from '../node_modules/monaco-editor/esm/vs/editor/editor.api.js';

const monacoInstance = monaco.editor.create(leftContainer, {
  ...defaultOptions,
  value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
});