export default function PdfPreview({ pdfUrl, loading, error }) {
  if (loading) {
    return (
      <div className="preview-loading">
        <div className="spinner" />
        <p style={{ marginTop: '1rem' }}>Compiling LaTeX…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="preview-error">
        <p>⚠ Compilation Error</p>
        <pre>{error}</pre>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className="preview-loading">
        <p>Click <strong>Compile</strong> to generate a PDF preview.</p>
      </div>
    );
  }

  return (
    <iframe
      src={pdfUrl}
      title="PDF Preview"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
