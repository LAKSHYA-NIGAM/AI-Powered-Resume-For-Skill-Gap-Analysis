import React from 'react';

function CategorizedSkills({ categorized, className, icon }) {
  return Object.entries(categorized).map(([category, skills]) => (
    <React.Fragment key={category}>
      <div className="category-label">{category}</div>
      {skills.map((skill, i) => (
        <span
          key={skill}
          className={`skill-tag ${className}`}
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          {icon} {skill}
        </span>
      ))}
    </React.Fragment>
  ));
}

export default function SkillsDisplay({ data }) {
  const { matching_categorized, missing_categorized } = data;
  const hasMatching = matching_categorized && Object.keys(matching_categorized).length > 0;
  const hasMissing = missing_categorized && Object.keys(missing_categorized).length > 0;

  return (
    <div className="skills-grid">
      {/* Matching Skills */}
      <div className="result-card matching-card" id="matching-card">
        <div className="card-header">
          <span className="card-icon">✅</span>
          <h3>Matching Skills</h3>
        </div>
        <div className="skills-list" id="matching-skills">
          {hasMatching ? (
            <CategorizedSkills categorized={matching_categorized} className="matched" icon="✔" />
          ) : (
            <div className="no-data">No matching skills found</div>
          )}
        </div>
      </div>

      {/* Missing Skills */}
      <div className="result-card missing-card" id="missing-card">
        <div className="card-header">
          <span className="card-icon">❌</span>
          <h3>Missing Skills</h3>
        </div>
        <div className="skills-list" id="missing-skills">
          {hasMissing ? (
            <CategorizedSkills categorized={missing_categorized} className="missing" icon="✘" />
          ) : (
            <div className="no-data">No missing skills — great match! 🎉</div>
          )}
        </div>
      </div>
    </div>
  );
}
