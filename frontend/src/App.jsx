import { useState } from 'react';
import Landing from './components/Landing';
import UploadForm from './components/UploadForm';
import EditorView from './components/EditorView';

export default function App() {
  const [view, setView] = useState('landing');   // 'landing' | 'editor'
  const [latexCode, setLatexCode] = useState('');
  const [error, setError] = useState('');

  function handleTransformDone(latex) {
    setLatexCode(latex);
    setView('editor');
  }

  function handleBack() {
    setView('landing');
    setLatexCode('');
  }

  if (view === 'editor') {
    return (
      <EditorView
        latex={latexCode}
        onChange={setLatexCode}
        onBack={handleBack}
      />
    );
  }

  return (
    <>
      <Landing />
      <UploadForm
        onSuccess={handleTransformDone}
        onError={(msg) => setError(msg)}
      />

      {error && (
        <div className="error-toast" onClick={() => setError('')}>
          {error}
        </div>
      )}
    </>
  );
}
