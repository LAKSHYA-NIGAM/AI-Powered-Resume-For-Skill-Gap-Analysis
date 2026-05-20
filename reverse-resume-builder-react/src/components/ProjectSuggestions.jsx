import React from 'react';

export default function ProjectSuggestions({ suggestions }) {
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="result-card" id="projects-card">
        <div className="card-header">
          <span className="card-icon">🚀</span>
          <h3>Recommended Projects</h3>
        </div>
        <div className="projects-list">
          <div className="no-data">No project suggestions needed 🎉</div>
        </div>
      </div>
    );
  }

  const displayed = suggestions.slice(0, 6);

  return (
    <div className="result-card" id="projects-card">
      <div className="card-header">
        <span className="card-icon">🚀</span>
        <h3>Recommended Projects</h3>
      </div>
      <div className="projects-list" id="projects-list">
        {displayed.map((group) => (
          <div className="project-group" key={group.skill}>
            <h4>🛠 {group.skill}</h4>
            {group.projects.map((p, i) => (
              <div className="project-item" key={i}>
                <div className="project-name">{p.name}</div>
                <div className="project-desc">{p.description}</div>
                <span className={`project-difficulty ${p.difficulty.toLowerCase()}`}>
                  {p.difficulty}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
