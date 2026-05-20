import React, { useState, useRef } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import { preprocessText } from './engine/resumeParser';
import { extractSkills, categorizeSkills } from './engine/skillExtractor';
import { calculateSimilarity, calculateAtsScore, rankSkillImportance } from './engine/model';
import { generateLearningPath, suggestProjects, generateResumeTips } from './engine/recommendation';

export default function App() {
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const resultsRef = useRef(null);

  const handleAnalyze = (resumeText, jdText) => {
    setError('');
    if (!jdText) { setError('Please enter a job description.'); return; }
    if (!resumeText) { setError('Please upload a PDF resume or paste your resume text.'); return; }

    setIsLoading(true);

    setTimeout(() => {
      try {
        const processedResume = preprocessText(resumeText);
        const processedJd = preprocessText(jdText);

        let resumeSkills = extractSkills(processedResume);
        const resumeSkillsRaw = extractSkills(resumeText.toLowerCase());
        let jdSkills = extractSkills(processedJd);
        const jdSkillsRaw = extractSkills(jdText.toLowerCase());

        resumeSkills = [...new Set([...resumeSkills, ...resumeSkillsRaw])];
        jdSkills = [...new Set([...jdSkills, ...jdSkillsRaw])];

        const resumeSet = new Set(resumeSkills);
        const jdSet = new Set(jdSkills);
        const matchingSkills = [...jdSet].filter((s) => resumeSet.has(s)).sort();
        const missingSkills = [...jdSet].filter((s) => !resumeSet.has(s)).sort();
        const extraSkills = [...resumeSet].filter((s) => !jdSet.has(s)).sort();

        const matchPercentage = jdSkills.length > 0
          ? Math.round((matchingSkills.length / jdSkills.length) * 1000) / 10 : 0;
        const similarityScore = calculateSimilarity(processedResume, processedJd);
        const atsScore = calculateAtsScore(resumeText, jdSkills, resumeSkills);
        const allJdSkills = [...matchingSkills, ...missingSkills];
        const skillRanking = rankSkillImportance(allJdSkills, jdText);
        const matchingCategorized = categorizeSkills(matchingSkills);
        const missingCategorized = categorizeSkills(missingSkills);
        const learningPath = generateLearningPath(missingSkills);
        const projectSuggestions = suggestProjects(missingSkills);
        const resumeTips = generateResumeTips(resumeText, missingSkills, atsScore);

        setResults({
          matching_skills: matchingSkills, missing_skills: missingSkills,
          extra_skills: extraSkills, match_percentage: matchPercentage,
          matching_categorized: matchingCategorized, missing_categorized: missingCategorized,
          similarity_score: Math.round(similarityScore * 100 * 10) / 10,
          ats_score: atsScore, skill_ranking: skillRanking, learning_path: learningPath,
          project_suggestions: projectSuggestions, resume_tips: resumeTips,
          stats: { total_jd_skills: jdSkills.length, total_resume_skills: resumeSkills.length,
            matching_count: matchingSkills.length, missing_count: missingSkills.length,
            extra_count: extraSkills.length },
        });
        setIsLoading(false);
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      } catch (err) {
        console.error('Analysis error:', err);
        setError(`An error occurred during analysis: ${err.message}`);
        setIsLoading(false);
      }
    }, 50);
  };

  const handleNewAnalysis = () => {
    setResults(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-wrapper">
      {/* Lightweight CSS-only ambient background */}
      <div className="ambient-bg">
        <div className="ambient-orb orb-1"></div>
        <div className="ambient-orb orb-2"></div>
        <div className="ambient-orb orb-3"></div>
        <div className="grid-overlay"></div>
      </div>

      <Header />
      <main className="main-content">
        <InputSection onAnalyze={handleAnalyze} isLoading={isLoading} />

        {error && <div className="error-toast" id="error-message">{error}</div>}

        {results && (
          <div ref={resultsRef}>
            <ResultsSection data={results} onNewAnalysis={handleNewAnalysis} />
          </div>
        )}
      </main>



    </div>
  );
}
