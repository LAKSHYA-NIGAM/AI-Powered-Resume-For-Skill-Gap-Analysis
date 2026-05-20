/**
 * resumeParser.js — Text Preprocessing & Section Detection
 * Port of Python's resume_parser.py (NLTK-based) to pure JavaScript
 */

// Common English stopwords (equivalent to NLTK's stopwords.words('english'))
const STOPWORDS = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're",
  "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves',
  'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself',
  'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves',
  'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those',
  'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if',
  'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with',
  'about', 'against', 'between', 'through', 'during', 'before', 'after', 'above',
  'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under',
  'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
  'how', 'all', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
  'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's',
  't', 'can', 'will', 'just', 'don', "don't", 'should', "should've", 'now', 'd',
  'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't",
  'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't",
  'haven', "haven't", 'isn', "isn't", 'ma', 'mightn', "mightn't", 'mustn',
  "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't",
  'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"
]);

/**
 * Preprocess text for NLP analysis.
 * Equivalent to Python's preprocess_text()
 */
export function preprocessText(text) {
  // Convert to lowercase
  let processed = text.toLowerCase();

  // Remove URLs
  processed = processed.replace(/https?:\/\/\S+|www\.\S+/g, '');

  // Remove email addresses
  processed = processed.replace(/\S+@\S+/g, '');

  // Remove special characters but keep letters, numbers, and some symbols
  processed = processed.replace(/[^a-z0-9\s/#+.]/g, ' ');

  // Tokenize (split on whitespace)
  const tokens = processed.split(/\s+/).filter(Boolean);

  // Remove stopwords and short tokens
  const filtered = tokens.filter(word => !STOPWORDS.has(word) && word.length > 1);

  return filtered.join(' ');
}

/**
 * Detect common resume sections for ATS scoring.
 * Equivalent to Python's extract_sections()
 */
export function extractSections(text) {
  const textLower = text.toLowerCase();

  const sections = {
    education: false,
    experience: false,
    skills: false,
    projects: false,
    certifications: false,
    summary: false,
    achievements: false,
    contact: false,
  };

  const sectionKeywords = {
    education: ['education', 'academic', 'university', 'college', 'degree', 'b.tech', 'b.e', 'btech', 'm.tech'],
    experience: ['experience', 'work history', 'employment', 'internship', 'work experience'],
    skills: ['skills', 'technical skills', 'technologies', 'proficiency', 'competencies'],
    projects: ['projects', 'project work', 'personal projects', 'academic projects'],
    certifications: ['certifications', 'certificates', 'certified', 'certification'],
    summary: ['summary', 'objective', 'about me', 'profile', 'professional summary'],
    achievements: ['achievements', 'awards', 'honors', 'accomplishments'],
    contact: ['email', 'phone', 'contact', 'linkedin', 'github'],
  };

  for (const [section, keywords] of Object.entries(sectionKeywords)) {
    for (const keyword of keywords) {
      if (textLower.includes(keyword)) {
        sections[section] = true;
        break;
      }
    }
  }

  return sections;
}
