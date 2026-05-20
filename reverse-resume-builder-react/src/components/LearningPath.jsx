import React from 'react';

export default function LearningPath({ paths }) {
  if (!paths || paths.length === 0) {
    return (
      <div className="result-card" id="learning-card">
        <div className="card-header">
          <span className="card-icon">📚</span>
          <h3>Learning Path</h3>
        </div>
        <div className="learning-list">
          <div className="no-data">No learning paths needed — you have all the skills! 🎉</div>
        </div>
      </div>
    );
  }

  const displayed = paths.slice(0, 6);
  const remaining = paths.length - 6;

  return (
    <div className="result-card" id="learning-card">
      <div className="card-header">
        <span className="card-icon">📚</span>
        <h3>Learning Path</h3>
      </div>
      <div className="learning-list" id="learning-list">
        {displayed.map((path) => (
          <div className="learning-item" key={path.skill}>
            <div className="learning-header">
              <h4>📖 {path.skill}</h4>
              <span className="learning-time">⏱ {path.estimated_time}</span>
            </div>
            <ol className="learning-steps">
              {path.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
            <div className="learning-resources">
              {path.resources.map((r, i) => (
                <span className="resource-tag" key={i}>{r}</span>
              ))}
            </div>
          </div>
        ))}
        {remaining > 0 && (
          <div className="no-data">+{remaining} more skills to learn</div>
        )}
      </div>
    </div>
  );
}
