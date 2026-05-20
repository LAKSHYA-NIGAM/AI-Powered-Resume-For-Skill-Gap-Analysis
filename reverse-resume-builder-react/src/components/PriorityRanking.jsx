import React from 'react';

export default function PriorityRanking({ ranking }) {
  const levels = [
    { key: 'High', label: 'High Priority', dotClass: 'high' },
    { key: 'Medium', label: 'Medium Priority', dotClass: 'medium' },
    { key: 'Low', label: 'Low Priority', dotClass: 'low' },
  ];

  return (
    <div className="result-card" id="priority-card">
      <div className="card-header">
        <span className="card-icon">🎯</span>
        <h3>Skill Importance Ranking</h3>
      </div>
      <div className="priority-grid" id="priority-grid">
        {levels.map((level) => {
          const skills = ranking[level.key] || [];
          return (
            <div className="priority-column" key={level.key}>
              <div className="priority-header">
                <div className={`priority-dot ${level.dotClass}`}></div>
                <span>{level.label}</span>
              </div>
              {skills.length > 0 ? (
                skills.map((s) => (
                  <div className="priority-skill" key={s}>{s}</div>
                ))
              ) : (
                <div className="priority-skill" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  None
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
