import { useState, useEffect, useCallback } from 'react';
import LatexEditor from './LatexEditor';
import PdfPreview from './PdfPreview';
import { compileLatex } from '../api';

export default function EditorView({ latex, onChange, onBack }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [compiling, setCompiling] = useState(false);
  const [compileError, setCompileError] = useState('');

  const compile = useCallback(async (code) => {
    setCompiling(true);
    setCompileError('');
    try {
      const blob = await compileLatex(code);
      const url = URL.createObjectURL(blob);
      setPdfUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    } catch (err) {
      setCompileError(err.message || 'Compilation failed');
    } finally {
      setCompiling(false);
    }
  }, []);

  // Auto-compile on first load
  useEffect(() => {
    if (latex) compile(latex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDownload() {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = 'resume.pdf';
    a.click();
  }

  return (
    <div className="editor-view">
      {/* Toolbar */}
      <div className="editor-toolbar">
        <span className="logo">ResumeX</span>
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back
        </button>
        <button
          className="btn btn-primary"
          onClick={() => compile(latex)}
          disabled={compiling}
        >
          {compiling ? 'Compiling…' : '▶ Compile'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleDownload}
          disabled={!pdfUrl}
        >
          ↓ Download PDF
        </button>
      </div>

      {/* Split pane */}
      <div className="editor-split">
        <div className="editor-pane">
          <LatexEditor value={latex} onChange={onChange} />
        </div>
        <div className="preview-pane">
          <PdfPreview
            pdfUrl={pdfUrl}
            loading={compiling}
            error={compileError}
          />
        </div>
      </div>
    </div>
  );
}
