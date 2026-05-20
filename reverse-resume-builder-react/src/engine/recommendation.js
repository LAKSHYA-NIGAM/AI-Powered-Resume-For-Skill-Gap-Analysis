/**
 * recommendation.js — Learning Paths, Project Suggestions & Resume Tips
 * Port of Python's recommendation.py to JavaScript
 */

// ============================================================
// LEARNING RESOURCES DATABASE
// ============================================================
const LEARNING_PATHS = {
  python: {
    resources: ['Python.org Official Tutorial', 'Automate the Boring Stuff with Python', 'CS50 Python (Harvard)'],
    platforms: ['Codecademy', 'freeCodeCamp', 'Coursera'],
    estimated_time: '4-6 weeks',
    steps: ['Learn basics (variables, loops, functions)', 'Practice OOP concepts', 'Build small projects', 'Learn popular libraries (pandas, flask)'],
  },
  java: {
    resources: ['Java Programming MOOC (University of Helsinki)', 'Head First Java', 'Java Brains YouTube'],
    platforms: ['Udemy', 'Coursera', 'Codecademy'],
    estimated_time: '6-8 weeks',
    steps: ['Master OOP fundamentals', 'Learn collections framework', 'Practice with Java projects', 'Explore Spring Boot'],
  },
  javascript: {
    resources: ['JavaScript.info', 'Eloquent JavaScript (free book)', 'The Odin Project'],
    platforms: ['freeCodeCamp', 'Scrimba', 'Codecademy'],
    estimated_time: '4-6 weeks',
    steps: ['Learn ES6+ syntax', 'Understand DOM manipulation', 'Practice async/await', 'Build interactive web pages'],
  },
  react: {
    resources: ['React Official Docs', 'Full Stack Open (University of Helsinki)', 'React Tutorial by Net Ninja'],
    platforms: ['Scrimba', 'Udemy', 'freeCodeCamp'],
    estimated_time: '4-5 weeks',
    steps: ['Learn JSX and components', 'Master state and props', 'Learn React hooks', 'Build a full project with React Router'],
  },
  'node.js': {
    resources: ['Node.js Official Docs', 'The Odin Project (Node path)', 'Node.js Design Patterns book'],
    platforms: ['Udemy', 'Coursera', 'freeCodeCamp'],
    estimated_time: '3-4 weeks',
    steps: ['Understand event-driven architecture', 'Build REST APIs with Express', 'Learn middleware patterns', 'Connect with databases'],
  },
  sql: {
    resources: ['SQLBolt (interactive tutorial)', 'W3Schools SQL', 'Mode Analytics SQL Tutorial'],
    platforms: ['Khan Academy', 'Codecademy', 'DataCamp'],
    estimated_time: '2-3 weeks',
    steps: ['Master SELECT queries and JOINs', 'Learn aggregation functions', 'Practice subqueries', 'Study database design and normalization'],
  },
  'machine learning': {
    resources: ['Andrew Ng ML Course (Coursera)', 'Hands-On ML with Scikit-Learn (book)', 'Google ML Crash Course'],
    platforms: ['Coursera', 'Kaggle Learn', 'Fast.ai'],
    estimated_time: '8-12 weeks',
    steps: ['Learn linear algebra and statistics basics', 'Study supervised learning algorithms', 'Practice with scikit-learn', 'Build end-to-end ML projects'],
  },
  'deep learning': {
    resources: ['Deep Learning Specialization (Andrew Ng)', 'Fast.ai Practical Deep Learning', 'Deep Learning book by Ian Goodfellow'],
    platforms: ['Coursera', 'Fast.ai', 'Kaggle'],
    estimated_time: '10-14 weeks',
    steps: ['Understand neural network fundamentals', 'Learn CNNs and RNNs', 'Practice with TensorFlow/PyTorch', 'Implement research papers'],
  },
  docker: {
    resources: ['Docker Official Getting Started', 'Docker for Beginners (free course)', 'Docker Deep Dive (book)'],
    platforms: ['Udemy', 'KodeKloud', 'Play with Docker'],
    estimated_time: '2-3 weeks',
    steps: ['Understand containers vs VMs', 'Learn Dockerfile creation', 'Practice Docker Compose', 'Deploy multi-container apps'],
  },
  aws: {
    resources: ['AWS Free Tier + Official Training', 'AWS Certified Cloud Practitioner prep', 'Stephane Maarek Udemy courses'],
    platforms: ['AWS Skill Builder', 'Udemy', 'A Cloud Guru'],
    estimated_time: '6-8 weeks',
    steps: ['Learn core services (EC2, S3, RDS)', 'Practice with free tier', 'Study IAM and security', 'Build a cloud-deployed project'],
  },
  git: {
    resources: ['Git Official Book (Pro Git)', 'Learn Git Branching (interactive)', 'GitHub Skills courses'],
    platforms: ['GitHub', 'Codecademy', 'Atlassian Git Tutorials'],
    estimated_time: '1-2 weeks',
    steps: ['Master basic commands (add, commit, push)', 'Learn branching and merging', 'Practice pull requests', 'Understand Git workflows'],
  },
  'data structures': {
    resources: ['GeeksforGeeks DSA', 'MIT OpenCourseWare 6.006', 'Striver A2Z DSA Sheet'],
    platforms: ['LeetCode', 'HackerRank', 'Codeforces'],
    estimated_time: '8-12 weeks',
    steps: ['Master arrays and strings', 'Learn linked lists and trees', 'Study graphs and dynamic programming', 'Practice 100+ problems'],
  },
  algorithms: {
    resources: ['Introduction to Algorithms (CLRS)', 'Algorithm Design Manual', 'MIT OCW 6.006'],
    platforms: ['LeetCode', 'Codeforces', 'HackerRank'],
    estimated_time: '8-12 weeks',
    steps: ['Learn sorting and searching', 'Master greedy and divide-conquer', 'Study dynamic programming', 'Practice competitive programming'],
  },
  tensorflow: {
    resources: ['TensorFlow Official Tutorials', 'TF Developer Certificate prep', 'Hands-on ML book (Ch. 10+)'],
    platforms: ['Coursera', 'Udemy', 'TensorFlow.org'],
    estimated_time: '4-6 weeks',
    steps: ['Learn tensor operations', 'Build sequential models', 'Practice CNNs and RNNs', 'Deploy models with TF Serving'],
  },
  pytorch: {
    resources: ['PyTorch Official Tutorials', 'PyTorch Lightning docs', 'Deep Learning with PyTorch (book)'],
    platforms: ['Fast.ai', 'Udemy', 'Coursera'],
    estimated_time: '4-6 weeks',
    steps: ['Understand autograd and tensors', 'Build custom datasets and dataloaders', 'Train neural networks', 'Implement transfer learning'],
  },
  kubernetes: {
    resources: ['Kubernetes Official Docs', 'KodeKloud CKA course', 'Kubernetes Up & Running (book)'],
    platforms: ['KodeKloud', 'Udemy', 'Linux Foundation'],
    estimated_time: '4-6 weeks',
    steps: ['Learn Pod, Service, Deployment concepts', 'Practice with Minikube', 'Study networking and storage', 'Deploy multi-tier applications'],
  },
  'rest api': {
    resources: ['RESTful API Design Guide', 'REST API Tutorial', 'Postman Learning Center'],
    platforms: ['Udemy', 'freeCodeCamp', 'Codecademy'],
    estimated_time: '2-3 weeks',
    steps: ['Understand HTTP methods and status codes', 'Design RESTful endpoints', 'Implement authentication (JWT)', 'Test APIs with Postman'],
  },
  mongodb: {
    resources: ['MongoDB University (free)', 'MongoDB Manual', 'The MongoDB Definitive Guide'],
    platforms: ['MongoDB University', 'Udemy', 'Coursera'],
    estimated_time: '2-3 weeks',
    steps: ['Learn document model vs relational', 'Master CRUD operations', 'Practice aggregation pipeline', 'Build a full-stack app with MongoDB'],
  },
  linux: {
    resources: ['Linux Journey (interactive)', 'The Linux Command Line (book)', 'Linux Upskill Challenge'],
    platforms: ['edX', 'Udemy', 'Linux Foundation'],
    estimated_time: '3-4 weeks',
    steps: ['Learn file system navigation', 'Master common commands', 'Understand permissions and processes', 'Practice shell scripting'],
  },
  cybersecurity: {
    resources: ['TryHackMe Learning Paths', 'OWASP Top 10', 'CompTIA Security+ Study Guide'],
    platforms: ['TryHackMe', 'HackTheBox', 'Cybrary'],
    estimated_time: '8-12 weeks',
    steps: ['Learn networking fundamentals', 'Study common vulnerabilities', 'Practice on CTF platforms', 'Get certified (CompTIA Security+)'],
  },
  'natural language processing': {
    resources: ['Stanford NLP Course (CS224N)', 'Speech and Language Processing (book)', 'Hugging Face NLP Course'],
    platforms: ['Coursera', 'Hugging Face', 'Kaggle'],
    estimated_time: '6-8 weeks',
    steps: ['Learn text preprocessing', 'Study word embeddings', 'Master transformers architecture', 'Build NLP applications'],
  },
  flutter: {
    resources: ['Flutter Official Docs', 'Flutter Apprentice (book)', 'Angela Yu Flutter Course'],
    platforms: ['Udemy', 'Coursera', 'Google Codelabs'],
    estimated_time: '4-6 weeks',
    steps: ['Learn Dart programming basics', 'Master widget tree concepts', 'Build multi-screen apps', 'Integrate APIs and databases'],
  },
};

// ============================================================
// PROJECT SUGGESTIONS DATABASE
// ============================================================
const PROJECT_SUGGESTIONS = {
  python: [
    { name: 'Personal Budget Tracker', description: 'CLI app to track expenses and generate reports using pandas', difficulty: 'Beginner' },
    { name: 'Web Scraper Dashboard', description: 'Scrape data from websites and visualize with matplotlib', difficulty: 'Intermediate' },
    { name: 'File Organizer Tool', description: 'Automate organizing files in directories by type/date', difficulty: 'Beginner' },
  ],
  java: [
    { name: 'Student Management System', description: 'CRUD app with file/database storage', difficulty: 'Beginner' },
    { name: 'Chat Application', description: 'Socket-based messaging application', difficulty: 'Intermediate' },
    { name: 'Library Management System', description: 'Desktop app using JavaFX with database', difficulty: 'Intermediate' },
  ],
  javascript: [
    { name: 'Interactive Quiz App', description: 'Dynamic quiz with score tracking and timer', difficulty: 'Beginner' },
    { name: 'Weather Dashboard', description: 'Fetch weather data from API and display with charts', difficulty: 'Beginner' },
    { name: 'Kanban Board', description: 'Drag-and-drop task management board', difficulty: 'Intermediate' },
  ],
  react: [
    { name: 'E-commerce Product Page', description: 'Product listing with cart functionality', difficulty: 'Intermediate' },
    { name: 'Movie Search App', description: 'Search and bookmark movies using TMDB API', difficulty: 'Beginner' },
    { name: 'Social Media Dashboard', description: 'Dashboard with real-time data and charts', difficulty: 'Intermediate' },
  ],
  sql: [
    { name: 'Employee Database System', description: 'Design schema and write complex queries for HR data', difficulty: 'Beginner' },
    { name: 'E-commerce Analytics', description: 'Analyze sales data with advanced SQL queries', difficulty: 'Intermediate' },
    { name: 'Hospital Management DB', description: 'Design normalized database for hospital operations', difficulty: 'Intermediate' },
  ],
  'machine learning': [
    { name: 'House Price Predictor', description: 'Regression model to predict house prices using scikit-learn', difficulty: 'Beginner' },
    { name: 'Spam Email Classifier', description: 'NLP-based email classification with Naive Bayes', difficulty: 'Beginner' },
    { name: 'Customer Churn Prediction', description: 'Predict customer churn using classification algorithms', difficulty: 'Intermediate' },
  ],
  'deep learning': [
    { name: 'Digit Recognizer', description: 'CNN model to recognize handwritten digits (MNIST)', difficulty: 'Beginner' },
    { name: 'Image Classifier', description: 'Classify images using transfer learning (ResNet/VGG)', difficulty: 'Intermediate' },
    { name: 'Sentiment Analyzer', description: 'LSTM-based sentiment analysis on movie reviews', difficulty: 'Intermediate' },
  ],
  docker: [
    { name: 'Containerized Web App', description: 'Dockerize a full-stack application with docker-compose', difficulty: 'Beginner' },
    { name: 'Multi-Service Architecture', description: 'Build a microservices app with multiple containers', difficulty: 'Intermediate' },
    { name: 'CI/CD Pipeline with Docker', description: 'Automate build and deploy using Docker + GitHub Actions', difficulty: 'Intermediate' },
  ],
  git: [
    { name: 'Open Source Contribution', description: 'Fork, fix bugs, and submit PRs to open source projects', difficulty: 'Beginner' },
    { name: 'Portfolio Website', description: 'Build and deploy a portfolio site using GitHub Pages', difficulty: 'Beginner' },
    { name: 'Team Project Workflow', description: 'Simulate team workflow with branches, PRs, and reviews', difficulty: 'Beginner' },
  ],
  'data structures': [
    { name: 'Custom Data Structure Library', description: 'Implement stack, queue, linked list, and BST from scratch', difficulty: 'Intermediate' },
    { name: 'Maze Solver', description: 'Use BFS/DFS to solve mazes with visualization', difficulty: 'Intermediate' },
    { name: 'LRU Cache Implementation', description: 'Build an efficient LRU cache with hashmap + doubly linked list', difficulty: 'Intermediate' },
  ],
  'rest api': [
    { name: 'Task Management API', description: 'Build a RESTful API for managing tasks with CRUD operations', difficulty: 'Beginner' },
    { name: 'Blog API with Authentication', description: 'REST API with JWT auth, pagination, and search', difficulty: 'Intermediate' },
    { name: 'URL Shortener Service', description: 'Build a URL shortening API with analytics', difficulty: 'Beginner' },
  ],
  mongodb: [
    { name: 'Notes Application', description: 'CRUD app for storing notes with tags and search', difficulty: 'Beginner' },
    { name: 'Social Feed API', description: 'Build a social media feed with MongoDB aggregation', difficulty: 'Intermediate' },
  ],
  aws: [
    { name: 'Serverless TODO App', description: 'Build with Lambda, API Gateway, and DynamoDB', difficulty: 'Intermediate' },
    { name: 'Static Website on S3', description: 'Deploy a website using S3 + CloudFront', difficulty: 'Beginner' },
  ],
  'natural language processing': [
    { name: 'Text Summarizer', description: 'Extractive text summarization using NLP techniques', difficulty: 'Intermediate' },
    { name: 'Chatbot', description: 'Rule-based chatbot with intent classification', difficulty: 'Intermediate' },
  ],
  cybersecurity: [
    { name: 'Password Strength Checker', description: 'Analyze password strength and suggest improvements', difficulty: 'Beginner' },
    { name: 'Port Scanner', description: 'Build a network port scanner tool in Python', difficulty: 'Intermediate' },
  ],
};

// ============================================================
// PUBLIC API
// ============================================================

/**
 * Generate a personalized learning path for missing skills.
 */
export function generateLearningPath(missingSkills) {
  const learningPath = [];

  for (const skill of missingSkills) {
    const skillLower = skill.toLowerCase();

    if (LEARNING_PATHS[skillLower]) {
      const pathData = LEARNING_PATHS[skillLower];
      learningPath.push({
        skill,
        resources: pathData.resources,
        platforms: pathData.platforms,
        estimated_time: pathData.estimated_time,
        steps: pathData.steps,
      });
    } else {
      learningPath.push({
        skill,
        resources: [
          `Search "${skill} tutorial for beginners"`,
          `${skill} official documentation`,
          `YouTube: "${skill} crash course"`,
        ],
        platforms: ['Udemy', 'Coursera', 'YouTube'],
        estimated_time: '2-4 weeks',
        steps: [
          `Learn ${skill} fundamentals`,
          `Follow a ${skill} tutorial`,
          `Build a small project using ${skill}`,
          `Practice with real-world examples`,
        ],
      });
    }
  }

  return learningPath;
}

/**
 * Suggest beginner-friendly projects for missing skills.
 */
export function suggestProjects(missingSkills) {
  const suggestions = [];

  for (const skill of missingSkills) {
    const skillLower = skill.toLowerCase();

    if (PROJECT_SUGGESTIONS[skillLower]) {
      suggestions.push({
        skill,
        projects: PROJECT_SUGGESTIONS[skillLower],
      });
    } else {
      suggestions.push({
        skill,
        projects: [
          { name: `${skill} Portfolio Project`, description: `Build a project showcasing your ${skill} skills`, difficulty: 'Beginner' },
          { name: `${skill} Mini Tool`, description: `Create a useful tool or utility using ${skill}`, difficulty: 'Beginner' },
        ],
      });
    }
  }

  return suggestions;
}

/**
 * Generate actionable resume improvement suggestions.
 */
export function generateResumeTips(resumeText, missingSkills, atsScore = null) {
  const tips = [];
  const resumeLower = resumeText.toLowerCase();
  const wordCount = resumeText.split(/\s+/).filter(Boolean).length;

  // Keyword Tips
  if (missingSkills.length > 0) {
    const topMissing = missingSkills.slice(0, 5);
    tips.push({
      category: 'Keywords',
      tip: `Add these high-priority keywords to your resume: ${topMissing.join(', ')}`,
      priority: 'High',
    });
  }

  // Section Tips
  const sectionsToCheck = {
    projects: 'Add a "Projects" section to showcase hands-on experience',
    certifications: 'Include a "Certifications" section if you have relevant certifications',
    summary: 'Add a "Professional Summary" at the top of your resume (2-3 lines)',
    skills: 'Create a dedicated "Technical Skills" section with categorized skills',
    achievements: 'Add an "Achievements" section to highlight accomplishments',
  };

  for (const [section, tip] of Object.entries(sectionsToCheck)) {
    if (!resumeLower.includes(section)) {
      tips.push({ category: 'Sections', tip, priority: 'Medium' });
    }
  }

  // Length Tips
  if (wordCount < 200) {
    tips.push({
      category: 'Length',
      tip: 'Your resume is too short. Add more details about your experience and projects.',
      priority: 'High',
    });
  } else if (wordCount > 1500) {
    tips.push({
      category: 'Length',
      tip: 'Your resume is quite long. Try to keep it concise (1-2 pages).',
      priority: 'Medium',
    });
  }

  // Formatting Tips
  if (!resumeLower.includes('github') && !resumeLower.includes('github.com')) {
    tips.push({
      category: 'Links',
      tip: 'Add your GitHub profile link to showcase your code',
      priority: 'Medium',
    });
  }

  if (!resumeLower.includes('linkedin')) {
    tips.push({
      category: 'Links',
      tip: 'Include your LinkedIn profile URL',
      priority: 'Low',
    });
  }

  // Action Verb Tips
  const actionVerbs = ['developed', 'implemented', 'designed', 'built', 'created', 'managed', 'led', 'optimized'];
  const hasActionVerbs = actionVerbs.some((verb) => resumeLower.includes(verb));
  if (!hasActionVerbs) {
    tips.push({
      category: 'Language',
      tip: 'Use strong action verbs like "Developed", "Implemented", "Designed", "Optimized" to describe your experience',
      priority: 'High',
    });
  }

  // Quantification Tips
  const hasNumbers = /\d+%|\d+\s*(users|clients|projects|team)/i.test(resumeLower);
  if (!hasNumbers) {
    tips.push({
      category: 'Impact',
      tip: 'Quantify your achievements with numbers (e.g., "Improved performance by 30%", "Led a team of 5")',
      priority: 'High',
    });
  }

  return tips;
}
