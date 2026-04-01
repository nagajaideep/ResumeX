"""
LaTeX compilation proxy — sends LaTeX source to LaTeX.Online and returns PDF bytes.
"""

import urllib.parse
import httpx


async def compile_latex(latex_string: str) -> bytes:
    """Compile LaTeX to PDF using free online services."""

    errors = []

    # Method 1: LaTeX.Online via POST
    try:
        async with httpx.AsyncClient(timeout=120.0, follow_redirects=True) as client:
            encoded = urllib.parse.quote(latex_string, safe="")
            url = f"https://latexonline.cc/compile?text={encoded}&command=pdflatex"
            resp = await client.get(url)

            if resp.status_code == 200 and resp.headers.get(
                "content-type", ""
            ).startswith("application/pdf"):
                return resp.content
            else:
                errors.append(f"latexonline.cc: status={resp.status_code}")
    except Exception as e:
        errors.append(f"latexonline.cc: {e}")

    # Method 2: ytotech LaTeX API
    try:
        async with httpx.AsyncClient(timeout=120.0, follow_redirects=True) as client:
            payload = {
                "compiler": "pdflatex",
                "resources": [{"main": True, "content": latex_string}],
            }
            resp = await client.post(
                "https://latex.ytotech.com/builds/sync",
                json=payload,
            )

            if resp.status_code == 200 and len(resp.content) > 100:
                return resp.content
            else:
                errors.append(
                    f"ytotech: status={resp.status_code}, body={resp.text[:200]}"
                )
    except Exception as e:
        errors.append(f"ytotech: {e}")

    raise Exception(f"All LaTeX compilers failed: {'; '.join(errors)}")
