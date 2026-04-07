# ShiftCV — Resume Format Transformer

Upload your current resume (PDF/DOCX) and a desired LaTeX or DOCX template.
ShiftCV extracts your details with AI and fills the new template automatically,
giving you an editable LaTeX editor with live PDF preview.

## Tech Stack

| Layer    | Tech                                    |
|----------|-----------------------------------------|
| Frontend | React 19 + Vite, CodeMirror 6           |
| Backend  | Python FastAPI                          |
| AI       | Google Gemini 2.5 Flash (`google-genai`)|
| PDF Compile | LaTeX.Online (external API)          |

## Quick Start

### 1. Set your Gemini API key

Edit `backend/.env`:

```
GEMINI_API_KEY=your_actual_key_here
```

Get a free key at https://aistudio.google.com/apikey

### 2. Start the backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API docs available at http://localhost:8000/docs

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## How It Works

1. **Upload** your current resume (PDF or DOCX) + desired format template (TEX or DOCX)
2. **AI extracts** all your details and fills the new template
3. **Edit** the LaTeX source in the built-in editor
4. **Preview** the compiled PDF in real-time
5. **Download** when you're happy with the result

## API Endpoints

| Endpoint         | Method | Input                              | Output              |
|------------------|--------|------------------------------------|----------------------|
| `/api/transform` | POST   | `resume` + `template` (form files) | `{ "latex": "..." }` |
| `/api/compile`   | POST   | `{ "latex": "..." }` (JSON)        | PDF binary           |

## Project Structure

```
ShiftCV/
├── frontend/
│   ├── src/
│   │   ├── App.jsx, App.css       # Main app + theme
│   │   ├── api.js                 # API fetch helpers
│   │   └── components/
│   │       ├── Landing.jsx        # Hero section
│   │       ├── UploadForm.jsx     # File upload UI
│   │       ├── EditorView.jsx     # Split-pane editor
│   │       ├── LatexEditor.jsx    # CodeMirror wrapper
│   │       └── PdfPreview.jsx     # PDF iframe viewer
│   ├── vite.config.js             # Dev proxy to backend
│   └── package.json
├── backend/
│   ├── main.py                    # FastAPI routes
│   ├── services/
│   │   ├── parser.py              # PDF/DOCX text extraction
│   │   ├── gemini.py              # Gemini AI integration
│   │   └── compiler.py            # LaTeX → PDF proxy
│   ├── requirements.txt
│   └── .env                       # API key
└── README.md
```
