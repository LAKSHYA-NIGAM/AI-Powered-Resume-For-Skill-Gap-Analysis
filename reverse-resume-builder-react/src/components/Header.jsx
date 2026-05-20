import React from 'react';

export default function Header() {
  return (
    <header className="header" id="header">
      <div className="header-content">
        <div className="logo">
          <div className="logo-icon">
            <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#logo-grad)" />
              <path d="M8 16L14 22L24 10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32">
                  <stop stopColor="#eab308" />
                  <stop offset="1" stopColor="#34d399" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1>SmartHire<span className="accent">AI</span></h1>
        </div>
        <p className="tagline">AI-Powered Reverse Resume Builder &amp; Skill Gap Analyzer</p>
      </div>

      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">✨ Powered by TF-IDF &amp; NLP</div>
          <h2 className="hero-title">
            <span className="hero-line">Analyze Your</span>
            <span className="hero-line gradient-text">Skill Gap</span>
            <span className="hero-line">In Seconds</span>
          </h2>
          <p className="hero-description">
            Upload your resume, paste a job description, and our AI engine will identify matching skills, 
            missing competencies, and generate a personalized learning roadmap — all in your browser.
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-number">135+</span>
              <span className="hero-stat-label">Skills Tracked</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <span className="hero-stat-number">12</span>
              <span className="hero-stat-label">Job Roles</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <span className="hero-stat-number">100%</span>
              <span className="hero-stat-label">Client-Side</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
          <div className="floating-card card-1"><span>🐍</span> Python</div>
          <div className="floating-card card-2"><span>⚛️</span> React</div>
          <div className="floating-card card-3"><span>🤖</span> ML</div>
          <div className="floating-card card-4"><span>☁️</span> AWS</div>
          <div className="floating-card card-5"><span>🐳</span> Docker</div>
        </div>
      </div>
    </header>
  );
}
