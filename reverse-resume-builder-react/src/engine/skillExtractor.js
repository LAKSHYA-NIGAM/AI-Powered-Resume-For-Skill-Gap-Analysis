/**
 * skillExtractor.js — Skill Extraction & Categorization
 * Port of Python's skill_extractor.py to JavaScript
 */

import { SKILLS_DB, JOB_ROLES } from '../data/skillsData';

/**
 * Extract skills from text by matching against the master skill list.
 */
export function extractSkills(text, skillsDb = SKILLS_DB) {
  const textLower = text.toLowerCase();
  const foundSkills = [];

  for (const row of skillsDb) {
    const skill = row.skill.toLowerCase().trim();

    if (skill.length <= 2) {
      // For very short skills (C, R), require exact word match
      const words = textLower.split(/\s+/);
      if (words.includes(skill)) {
        foundSkills.push(skill);
      }
    } else {
      // For longer skills, check substring presence
      if (textLower.includes(skill)) {
        foundSkills.push(skill);
      }
    }
  }

  // Remove duplicates while preserving order
  const seen = new Set();
  const unique = [];
  for (const s of foundSkills) {
    if (!seen.has(s)) {
      seen.add(s);
      unique.push(s);
    }
  }

  return unique;
}

/**
 * Get the category of a given skill.
 */
export function getSkillCategory(skill, skillsDb = SKILLS_DB) {
  const found = skillsDb.find(
    (row) => row.skill.toLowerCase() === skill.toLowerCase()
  );
  return found ? found.category : 'Other';
}

/**
 * Group a list of skills by their categories.
 */
export function categorizeSkills(skillsList, skillsDb = SKILLS_DB) {
  const categorized = {};

  for (const skill of skillsList) {
    const category = getSkillCategory(skill, skillsDb);
    if (!categorized[category]) {
      categorized[category] = [];
    }
    categorized[category].push(skill);
  }

  return categorized;
}

/**
 * Get skills for a specific job role with priorities.
 */
export function getRoleSkills(roleName) {
  const roleData = JOB_ROLES.filter(
    (row) => row.role.toLowerCase() === roleName.toLowerCase()
  );

  const prioritized = { High: [], Medium: [], Low: [] };

  for (const row of roleData) {
    const priority = row.priority;
    if (prioritized[priority]) {
      prioritized[priority].push(row.skill.toLowerCase());
    }
  }

  return prioritized;
}

/**
 * Get a list of all available job roles.
 */
export function getAllRoles() {
  const roles = [...new Set(JOB_ROLES.map((row) => row.role))];
  return roles.sort();
}
