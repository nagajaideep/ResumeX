import { useState } from 'react';
import { transformResume } from '../api';

export default function UploadForm({ onSuccess, onError }) {
  const [resume, setResume] = useState(null);
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!resume || !template) {
      onError('Please upload both files before transforming.');
      return;
    }

    setLoading(true);
    try {
      const data = await transformResume(resume, template);
      onSuccess(data.latex);
    } catch (err) {
      onError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section id="upload" className="upload-section">
        <h2>Upload Your Files</h2>
        <p className="subtitle">We'll extract your details and fill the new template automatically.</p>

        <form onSubmit={handleSubmit}>
          <div className="upload-grid">
            {/* Resume upload */}
            <label className={`upload-box ${resume ? 'has-file' : ''}`}>
              <div className="icon">📄</div>
              <h3>Your Current Resume</h3>
              <div className="formats">PDF or DOCX</div>
              {resume && <div className="file-name">{resume.name}</div>}
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => setResume(e.target.files[0] || null)}
              />
            </label>

            {/* Template upload */}
            <label className={`upload-box ${template ? 'has-file' : ''}`}>
              <div className="icon">🎨</div>
              <h3>Desired Format</h3>
              <div className="formats">TEX or DOCX template</div>
              {template && <div className="file-name">{template.name}</div>}
              <input
                type="file"
                accept=".tex,.docx"
                onChange={(e) => setTemplate(e.target.files[0] || null)}
              />
            </label>
          </div>

          <div className="transform-btn-wrap">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Transforming…' : '⚡ Transform Resume'}
            </button>
          </div>
        </form>
      </section>

      {loading && (
        <div className="loading-overlay">
          <div className="spinner" />
          <p>Analyzing your resume and building the new format…</p>
        </div>
      )}
    </>
  );
}
