import CodeMirror from '@uiw/react-codemirror';
import { latex } from 'codemirror-lang-latex';

// Dark theme matching our app
const darkTheme = {
  '&': {
    backgroundColor: '#0a0a0a',
    color: '#e5e5e5',
  },
  '.cm-gutters': {
    backgroundColor: '#111',
    color: '#555',
    border: 'none',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#1a1a1a',
  },
  '.cm-activeLine': {
    backgroundColor: '#1a1a2a',
  },
  '&.cm-focused .cm-cursor': {
    borderLeftColor: '#3b82f6',
  },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
    backgroundColor: '#2563eb33',
  },
};

export default function LatexEditor({ value, onChange }) {
  return (
    <CodeMirror
      value={value}
      height="100%"
      extensions={[latex()]}
      theme={darkTheme}
      onChange={(val) => onChange(val)}
      basicSetup={{
        lineNumbers: true,
        highlightActiveLine: true,
        bracketMatching: true,
        foldGutter: true,
      }}
    />
  );
}
