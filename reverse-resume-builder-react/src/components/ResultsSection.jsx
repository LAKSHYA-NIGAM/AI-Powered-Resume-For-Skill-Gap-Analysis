import React from 'react';
import ScoreCards from './ScoreCards';
import ATSBreakdown from './ATSBreakdown';
import SkillsDisplay from './SkillsDisplay';
import PriorityRanking from './PriorityRanking';
import LearningPath from './LearningPath';
import ProjectSuggestions from './ProjectSuggestions';
import ResumeTips from './ResumeTips';

export default function ResultsSection({ data, onNewAnalysis }) {
  return (
    <section className="results-section" id="results-section">
      <div className="results-divider">
        <div className="divider-line"></div>
        <span className="divider-label">📊 Analysis Results</span>
        <div className="divider-line"></div>
      </div>

      <ScoreCards data={data} />
      <ATSBreakdown atsScore={data.ats_score} />
      <SkillsDisplay data={data} />
      <PriorityRanking ranking={data.skill_ranking} />
      <LearningPath paths={data.learning_path} />
      <ProjectSuggestions suggestions={data.project_suggestions} />
      <ResumeTips tips={data.resume_tips} />

      <div className="action-area">
        <button className="analyze-btn secondary" id="new-analysis-btn" onClick={onNewAnalysis}>
          🔄 New Analysis
        </button>
      </div>
    </section>
  );
}
