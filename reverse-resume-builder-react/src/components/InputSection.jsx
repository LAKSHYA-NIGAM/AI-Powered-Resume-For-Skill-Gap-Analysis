import React, { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure the worker for Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function InputSection({ onAnalyze, isLoading }) {
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [pdfStatus, setPdfStatus] = useState(''); // 'parsing', 'success', 'error'
  const [parsedPdfText, setParsedPdfText] = useState('');
  const fileInputRef = useRef(null);

  const parsePdf = async (file) => {
    setPdfStatus('parsing');
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
        useSystemFonts: true,
      });

      const pdf = await loadingTask.promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        // Join items with proper spacing
        let lastY = null;
        const parts = [];
        for (const item of content.items) {
          if (lastY !== null && Math.abs(item.transform[5] - lastY) > 3) {
            parts.push('\n'); // New line when Y position changes
          }
          parts.push(item.str);
          lastY = item.transform[5];
        }
        fullText += parts.join(' ') + '\n\n';
      }

      const cleanedText = fullText
        .replace(/  +/g, ' ')       // collapse multiple spaces
        .replace(/\n{3,}/g, '\n\n') // collapse multiple newlines
        .trim();

      if (cleanedText.length > 10) {
        setParsedPdfText(cleanedText);
        setPdfStatus('success');
        console.log('PDF parsed successfully, text length:', cleanedText.length);
      } else {
        // PDF might be image-based (scanned)
        setPdfStatus('error');
        setParsedPdfText('');
        console.warn('PDF text extraction returned very little text. PDF may be image-based.');
      }
    } catch (err) {
      console.error('PDF parsing error:', err);
      setPdfStatus('error');
      setParsedPdfText('');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      parsePdf(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].name.toLowerCase().endsWith('.pdf')) {
      setSelectedFile(files[0]);
      parsePdf(files[0]);
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    setPdfStatus('');
    setParsedPdfText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Use parsed PDF text if available, otherwise use typed text
    const resumeContent = parsedPdfText || resumeText.trim();
    onAnalyze(resumeContent, jdText.trim());
  };

  return (
    <section className="input-section" id="input-section">
      <div className="section-header">
        <div className="section-badge">📄 INPUT</div>
        <h2>Upload &amp; Analyze</h2>
        <p>Paste your resume and the target job description to get a complete skill gap analysis</p>
      </div>

      <form id="analyze-form" className="input-grid" onSubmit={handleSubmit}>
        {/* Resume Input */}
        <div className="input-card glass-card">
          <div className="card-header">
            <span className="card-icon">📝</span>
            <h3>Your Resume</h3>
          </div>

          <div
            className={`upload-area ${dragOver ? 'drag-over' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input type="file" ref={fileInputRef} accept=".pdf" hidden onChange={handleFileChange} />
            {!selectedFile ? (
              <div className="upload-content">
                <div className="upload-icon-wrapper">
                  <svg className="upload-icon" width="40" height="40" viewBox="0 0 48 48" fill="none">
                    <path d="M24 4L24 32M24 4L16 12M24 4L32 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 28V40C8 41.1 8.9 42 10 42H38C39.1 42 40 41.1 40 40V28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p>Click to upload PDF resume</p>
                <span className="upload-hint">or drag and drop</span>
              </div>
            ) : (
              <div className="file-selected">
                <span className="file-icon">📎</span>
                <span>{selectedFile.name}</span>
                <button type="button" className="remove-file" onClick={removeFile}>✕</button>
              </div>
            )}
          </div>

          {/* PDF parsing status */}
          {pdfStatus === 'parsing' && (
            <div className="pdf-status parsing">
              <span className="spinner"></span> Reading PDF...
            </div>
          )}
          {pdfStatus === 'success' && (
            <div className="pdf-status success">
              ✅ PDF parsed — {parsedPdfText.split(/\s+/).length} words extracted
            </div>
          )}
          {pdfStatus === 'error' && (
            <div className="pdf-status error">
              ⚠️ Could not extract text from PDF. It may be image-based (scanned). Please paste your resume text below instead.
            </div>
          )}

          <div className="divider-text"><span>OR paste text</span></div>

          <textarea
            id="resume-text"
            placeholder={`Paste your resume text here...\n\nExample:\nJohn Doe - Software Developer\nSkills: Python, JavaScript, React, SQL\nExperience: 2 years at XYZ Corp\nProjects: E-commerce platform, ML model...`}
            rows="8"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
        </div>

        {/* Job Description Input */}
        <div className="input-card glass-card">
          <div className="card-header">
            <span className="card-icon">💼</span>
            <h3>Job Description</h3>
          </div>
          <textarea
            id="jd-text"
            placeholder={`Paste the job description here...\n\nExample:\nWe are looking for a Full Stack Developer with experience in:\n- Python, Django, or Flask\n- React or Angular\n- PostgreSQL or MongoDB\n- Docker, AWS\n- Git, CI/CD...`}
            rows="14"
            required
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
          />
        </div>

        {/* Analyze Button */}
        <div className="action-area">
          <button type="submit" className="analyze-btn" id="analyze-btn" disabled={isLoading}>
            {!isLoading ? (
              <span className="btn-text">
                <span className="btn-icon">🔍</span>
                Analyze Skill Gap
                <span className="btn-arrow">→</span>
              </span>
            ) : (
              <span className="btn-loading">
                <span className="spinner"></span> Analyzing...
              </span>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
