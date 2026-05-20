import React from 'react';

export default function ResumeTips({ tips }) {
  if (!tips || tips.length === 0) {
    return (
      <div className="result-card" id="tips-card">
        <div className="card-header">
          <span className="card-icon">💡</span>
          <h3>Resume Improvement Tips</h3>
        </div>
        <div className="tips-list">
          <div className="no-data">Your resume looks great! 🎉</div>
        </div>
      </div>
    );
  }

  return (
    <div className="result-card" id="tips-card">
      <div className="card-header">
        <span className="card-icon">💡</span>
        <h3>Resume Improvement Tips</h3>
      </div>
      <div className="tips-list" id="tips-list">
        {tips.map((tip, i) => {
          const priorityClass = tip.priority ? tip.priority.toLowerCase() : 'medium';
          return (
            <div className="tip-item" key={i}>
              <span className={`tip-priority ${priorityClass}`}>
                {tip.priority || 'Info'}
              </span>
              <div className="tip-content">
                <div className="tip-category">{tip.category || ''}</div>
                <div className="tip-text">{tip.tip}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
