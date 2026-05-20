import React, { useEffect, useRef } from 'react';

export default function ATSBreakdown({ atsScore }) {
  const barsRef = useRef([]);

  const bars = [
    { label: 'Keyword Match', value: atsScore.keyword_match, max: 40 },
    { label: 'Resume Sections', value: atsScore.section_score, max: 30 },
    { label: 'Resume Length', value: atsScore.length_score, max: 15 },
    { label: 'Skill Coverage', value: atsScore.skill_coverage, max: 15 },
  ];

  useEffect(() => {
    bars.forEach((bar, i) => {
      const percent = (bar.value / bar.max) * 100;
      const timer = setTimeout(() => {
        if (barsRef.current[i]) {
          barsRef.current[i].style.width = percent + '%';
        }
      }, 300 + i * 150);
      return () => clearTimeout(timer);
    });
  }, [atsScore]);

  return (
    <div className="result-card" id="ats-breakdown-card">
      <div className="card-header">
        <span className="card-icon">📊</span>
        <h3>ATS Score Breakdown</h3>
      </div>
      <div className="ats-bars">
        {bars.map((bar, i) => (
          <div className="ats-bar-item" key={i}>
            <div className="ats-bar-label">
              <span>{bar.label}</span>
              <span>{bar.value}/{bar.max}</span>
            </div>
            <div className="ats-bar-track">
              <div
                className="ats-bar-fill"
                ref={(el) => (barsRef.current[i] = el)}
                style={{ width: 0 }}
              />
            </div>
          </div>
        ))}
        <div style={{
          gridColumn: '1 / -1',
          marginTop: '8px',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
        }}>
          📝 Word count: <strong>{atsScore.word_count}</strong> | 
          Sections found: <strong>{atsScore.sections_found.join(', ') || 'None'}</strong>
        </div>
      </div>
    </div>
  );
}
