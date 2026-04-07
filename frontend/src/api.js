const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function transformResume(resumeFile, templateFile) {
  const form = new FormData();
  form.append('resume', resumeFile);
  form.append('template', templateFile);

  const res = await fetch(`${API_BASE}/transform`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Transform failed' }));
    throw new Error(err.detail || 'Transform failed');
  }

  return res.json(); // { latex: "..." }
}

export async function compileLatex(latex) {
  const res = await fetch(`${API_BASE}/compile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ latex }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Compilation failed' }));
    throw new Error(err.detail || 'Compilation failed');
  }

  return res.blob(); // PDF blob
}
