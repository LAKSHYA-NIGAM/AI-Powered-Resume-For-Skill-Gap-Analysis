import React, { useEffect, useRef } from 'react';

function AnimatedRing({ percentage, className = '' }) {
  const ringRef = useRef(null);
  const circumference = 2 * Math.PI * 52;

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;
    ring.style.strokeDashoffset = circumference;
    const timer = setTimeout(() => {
      const offset = circumference - (percentage / 100) * circumference;
      ring.style.strokeDashoffset = offset;
    }, 300);
    return () => clearTimeout(timer);
  }, [percentage, circumference]);

  return (
    <svg viewBox="0 0 120 120">
      <circle className="ring-bg" cx="60" cy="60" r="52" />
      <circle
        ref={ringRef}
        className={`ring-fill ${className}`}
        cx="60" cy="60" r="52"
        strokeDasharray={circumference}
        strokeDashoffset={circumference}
      />
    </svg>
  );
}

function AnimatedNumber({ value }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let current = 0;
    const target = value;
    const step = Math.max(1, Math.ceil(target / 30));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(interval); }
      el.textContent = current;
    }, 30);
    return () => clearInterval(interval);
  }, [value]);
  return <span ref={ref}>0</span>;
}

export default function ScoreCards({ data }) {
  const { match_percentage, similarity_score, ats_score, stats } = data;

  return (
    <div className="score-overview" id="score-overview">
      <div className="score-card glass-card primary">
        <div className="score-ring">
          <AnimatedRing percentage={match_percentage} />
          <span className="score-value">{match_percentage}%</span>
        </div>
        <h3>Skill Match</h3>
        <p className="score-subtitle">{stats.matching_count}/{stats.total_jd_skills} skills</p>
      </div>

      <div className="score-card glass-card">
        <div className="score-ring">
          <AnimatedRing percentage={similarity_score} className="similarity" />
          <span className="score-value">{similarity_score}%</span>
        </div>
        <h3>ML Similarity</h3>
        <p className="score-subtitle">TF-IDF Cosine</p>
      </div>

      <div className="score-card glass-card">
        <div className="score-ring">
          <AnimatedRing percentage={ats_score.total} className="ats" />
          <span className="score-value">{ats_score.total}</span>
        </div>
        <h3>ATS Score</h3>
        <p className="score-subtitle">{ats_score.rating}</p>
      </div>

      <div className="score-card glass-card stats-card">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number matched"><AnimatedNumber value={stats.matching_count} /></span>
            <span className="stat-label">Matched</span>
          </div>
          <div className="stat-item">
            <span className="stat-number missing"><AnimatedNumber value={stats.missing_count} /></span>
            <span className="stat-label">Missing</span>
          </div>
          <div className="stat-item">
            <span className="stat-number extra"><AnimatedNumber value={stats.extra_count} /></span>
            <span className="stat-label">Extra</span>
          </div>
          <div className="stat-item">
            <span className="stat-number total"><AnimatedNumber value={stats.total_jd_skills} /></span>
            <span className="stat-label">JD Skills</span>
          </div>
        </div>
        <h3>Skills Overview</h3>
      </div>
    </div>
  );
}
