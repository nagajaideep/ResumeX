export default function Landing() {
  return (
    <section className="hero">
      <div className="hero-logo">ShiftCV</div>

      <h1>
        Transform Your Resume <span>in Seconds</span>
      </h1>

      <p>
        Upload your current resume and your desired format — we'll restructure
        everything into a polished LaTeX document you can edit and download.
      </p>

      <div className="hero-cta">
        <a href="#upload" className="btn btn-primary">
          Get Started ↓
        </a>
      </div>

      <button
        className="scroll-arrow"
        onClick={() => document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Scroll to upload"
      >
        ▼
      </button>
    </section>
  );
}
