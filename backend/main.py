"""
ResumeX — FastAPI backend
Two endpoints: /api/transform and /api/compile
"""

import os
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Response
from fastapi.middleware.cors import CORSMiddleware
from services.parser import extract_text
from services.gemini import transform_resume
from services.compiler import compile_latex
import traceback

load_dotenv()

app = FastAPI(title="ResumeX API")

# CORS — allow Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── POST /api/transform ──────────────────────────────────────────────
@app.post("/api/transform")
async def transform(resume: UploadFile = File(...), template: UploadFile = File(...)):
    """Accept a resume + template, return filled LaTeX."""
    try:
        print(f"Received resume: {resume.filename}, template: {template.filename}")

        resume_bytes = await resume.read()
        template_bytes = await template.read()

        print(
            f"Resume size: {len(resume_bytes)} bytes, Template size: {len(template_bytes)} bytes"
        )

        resume_text = extract_text(resume_bytes, resume.filename)
        template_text = extract_text(template_bytes, template.filename)

        print(f"Extracted resume text length: {len(resume_text)}")
        print(f"Extracted template text length: {len(template_text)}")

        if not resume_text.strip():
            return Response(
                content='{"detail": "Could not extract text from resume. Make sure it is not a scanned image."}',
                status_code=400,
                media_type="application/json",
            )

        if not template_text.strip():
            return Response(
                content='{"detail": "Could not extract text from template."}',
                status_code=400,
                media_type="application/json",
            )

        latex = await transform_resume(resume_text, template_text, template.filename)

        print(f"Generated LaTeX length: {len(latex)}")

        return {"latex": latex}

    except Exception as e:
        print(f"ERROR in /api/transform: {e}")
        traceback.print_exc()
        return Response(
            content=f'{{"detail": "Server error: {str(e)}"}}',
            status_code=500,
            media_type="application/json",
        )


# ── POST /api/compile ────────────────────────────────────────────────
@app.post("/api/compile")
async def compile_tex(body: dict):
    """Compile LaTeX string to PDF via LaTeX.Online."""
    try:
        latex_code = body.get("latex", "")

        if not latex_code.strip():
            return Response(
                content='{"detail": "Empty LaTeX code"}',
                status_code=400,
                media_type="application/json",
            )

        pdf_bytes = await compile_latex(latex_code)
        return Response(content=pdf_bytes, media_type="application/pdf")

    except Exception as e:
        print(f"ERROR in /api/compile: {e}")
        traceback.print_exc()
        return Response(
            content=f'{{"detail": "Compilation error: {str(e)}"}}',
            status_code=500,
            media_type="application/json",
        )
