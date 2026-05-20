/**
 * model.js — ML Module (TF-IDF + Cosine Similarity)
 * Port of Python's model.py (scikit-learn) to pure JavaScript
 *
 * Implements:
 * 1. TF-IDF vectorization
 * 2. Cosine similarity
 * 3. ATS score calculation
 * 4. Skill importance ranking
 */

import { extractSections } from './resumeParser';

// ============================================================
// TF-IDF Implementation
// ============================================================

/**
 * Tokenize text into words (simple whitespace tokenizer).
 */
function tokenize(text) {
  return text.toLowerCase().split(/\s+/).filter(Boolean);
}

/**
 * Compute term frequency for tokens.
 */
function computeTF(tokens) {
  const tf = {};
  for (const token of tokens) {
    tf[token] = (tf[token] || 0) + 1;
  }
  // Normalize by total tokens
  const totalTokens = tokens.length;
  for (const key in tf) {
    tf[key] = tf[key] / totalTokens;
  }
  return tf;
}

/**
 * Compute IDF given an array of documents (each is an array of tokens).
 */
function computeIDF(documents) {
  const idf = {};
  const N = documents.length;

  // Build vocabulary
  const vocab = new Set();
  for (const doc of documents) {
    for (const token of doc) {
      vocab.add(token);
    }
  }

  for (const term of vocab) {
    let count = 0;
    for (const doc of documents) {
      if (doc.includes(term)) {
        count++;
      }
    }
    // smooth IDF: log((N + 1) / (count + 1)) + 1
    idf[term] = Math.log((N + 1) / (count + 1)) + 1;
  }

  return idf;
}

/**
 * Build a TF-IDF vector for given tokens using precomputed IDF.
 */
function buildTFIDFVector(tokens, idf, vocab) {
  const tf = computeTF(tokens);
  const vector = {};
  for (const term of vocab) {
    vector[term] = (tf[term] || 0) * (idf[term] || 0);
  }
  return vector;
}

/**
 * Compute cosine similarity between two vectors (objects).
 */
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let magA = 0;
  let magB = 0;

  const allKeys = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);

  for (const key of allKeys) {
    const a = vecA[key] || 0;
    const b = vecB[key] || 0;
    dotProduct += a * b;
    magA += a * a;
    magB += b * b;
  }

  magA = Math.sqrt(magA);
  magB = Math.sqrt(magB);

  if (magA === 0 || magB === 0) return 0;

  return dotProduct / (magA * magB);
}

// ============================================================
// Public API
// ============================================================

/**
 * Calculate cosine similarity between resume and JD using TF-IDF.
 * Equivalent to Python's calculate_similarity()
 */
export function calculateSimilarity(resumeText, jdText) {
  if (!resumeText.trim() || !jdText.trim()) return 0.0;

  const resumeTokens = tokenize(resumeText);
  const jdTokens = tokenize(jdText);

  // Build IDF from both documents
  const idf = computeIDF([resumeTokens, jdTokens]);
  const vocab = new Set([...resumeTokens, ...jdTokens]);

  // Build TF-IDF vectors
  const resumeVec = buildTFIDFVector(resumeTokens, idf, vocab);
  const jdVec = buildTFIDFVector(jdTokens, idf, vocab);

  // Calculate cosine similarity
  const similarity = cosineSimilarity(resumeVec, jdVec);
  return Math.round(similarity * 10000) / 10000;
}

/**
 * Calculate ATS compatibility score.
 * Equivalent to Python's calculate_ats_score()
 */
export function calculateAtsScore(resumeText, jdSkills, resumeSkills) {
  const scores = {};

  // 1. Keyword Match Score (40 points)
  if (jdSkills.length > 0) {
    const resumeSet = new Set(resumeSkills);
    const matched = jdSkills.filter((s) => resumeSet.has(s)).length;
    const keywordRatio = matched / jdSkills.length;
    scores.keyword_match = Math.round(keywordRatio * 40 * 10) / 10;
  } else {
    scores.keyword_match = 0;
  }

  // 2. Section Presence Score (30 points)
  const sections = extractSections(resumeText);
  const importantSections = ['education', 'experience', 'skills', 'projects', 'summary', 'contact'];
  const sectionCount = importantSections.filter((s) => sections[s]).length;
  scores.section_score = Math.round((sectionCount / importantSections.length) * 30 * 10) / 10;

  // 3. Resume Length Score (15 points)
  const wordCount = resumeText.split(/\s+/).filter(Boolean).length;
  if (wordCount >= 300 && wordCount <= 1500) {
    scores.length_score = 15.0;
  } else if ((wordCount >= 150 && wordCount < 300) || (wordCount > 1500 && wordCount <= 2500)) {
    scores.length_score = 10.0;
  } else if (wordCount >= 50 && wordCount < 150) {
    scores.length_score = 5.0;
  } else {
    scores.length_score = 2.0;
  }

  // 4. Skill Coverage Score (15 points)
  if (resumeSkills.length > 0) {
    const coverage = Math.min(resumeSkills.length / 8, 1.0);
    scores.skill_coverage = Math.round(coverage * 15 * 10) / 10;
  } else {
    scores.skill_coverage = 0;
  }

  // Total
  scores.total = Math.round(
    (scores.keyword_match + scores.section_score + scores.length_score + scores.skill_coverage) * 10
  ) / 10;

  // Rating
  if (scores.total >= 80) {
    scores.rating = 'Excellent';
  } else if (scores.total >= 60) {
    scores.rating = 'Good';
  } else if (scores.total >= 40) {
    scores.rating = 'Average';
  } else {
    scores.rating = 'Needs Improvement';
  }

  // Info
  scores.sections_found = Object.entries(sections)
    .filter(([, found]) => found)
    .map(([name]) => name);
  scores.word_count = wordCount;

  return scores;
}

/**
 * Rank skills by importance using TF-IDF weights.
 * Equivalent to Python's rank_skill_importance()
 */
export function rankSkillImportance(skillsList, jdText) {
  if (!skillsList.length || !jdText.trim()) {
    return { High: [], Medium: [], Low: [] };
  }

  try {
    const jdTokens = tokenize(jdText);
    const jdTF = computeTF(jdTokens);

    // Score each skill by its TF in the JD
    const skillScores = skillsList.map((skill) => {
      const skillTokens = tokenize(skill);
      let score = 0;
      for (const token of skillTokens) {
        score += jdTF[token] || 0;
      }
      return { skill, score };
    });

    // Sort by score descending
    skillScores.sort((a, b) => b.score - a.score);

    // Categorize into priority levels
    const ranked = { High: [], Medium: [], Low: [] };
    const total = skillScores.length;

    skillScores.forEach(({ skill }, i) => {
      if (i < total / 3) {
        ranked.High.push(skill);
      } else if (i < (2 * total) / 3) {
        ranked.Medium.push(skill);
      } else {
        ranked.Low.push(skill);
      }
    });

    return ranked;
  } catch {
    // Fallback: distribute evenly
    const third = Math.max(1, Math.floor(skillsList.length / 3));
    return {
      High: skillsList.slice(0, third),
      Medium: skillsList.slice(third, 2 * third),
      Low: skillsList.slice(2 * third),
    };
  }
}
