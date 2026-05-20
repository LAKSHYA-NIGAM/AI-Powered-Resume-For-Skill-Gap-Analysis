/**
 * script.js — SkillSync AI Frontend Logic
 * 
 * Handles:
 * 1. PDF file upload with drag-and-drop
 * 2. Form submission to /analyze API
 * 3. Dynamic rendering of all analysis results
 * 4. Animated score rings and progress bars
 */

// ============================================================
// DOM Element References
// ============================================================

const form = document.getElementById('analyze-form');
const analyzeBtn = document.getElementById('analyze-btn');
const btnText = analyzeBtn.querySelector('.btn-text');
const btnLoading = analyzeBtn.querySelector('.btn-loading');
const resumeFileInput = document.getElementById('resume-file');
const resumeTextInput = document.getElementById('resume-text');
const jdTextInput = document.getElementById('jd-text');
const uploadArea = document.getElementById('upload-area');
const fileSelected = document.getElementById('file-selected');
const fileNameSpan = document.getElementById('file-name');
const removeFileBtn = document.getElementById('remove-file');
const errorMessage = document.getElementById('error-message');
const resultsSection = document.getElementById('results-section');
const newAnalysisBtn = document.getElementById('new-analysis-btn');


// ============================================================
// File Upload Handling
// ============================================================

// Click to upload
uploadArea.addEventListener('click', () => {
    resumeFileInput.click();
});

// File selected
resumeFileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        showSelectedFile(e.target.files[0].name);
    }
});

// Drag and drop support
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].name.toLowerCase().endsWith('.pdf')) {
        resumeFileInput.files = files;
        showSelectedFile(files[0].name);
    } else {
        showError('Please upload a PDF file.');
    }
});

// Show the selected file name
function showSelectedFile(name) {
    fileNameSpan.textContent = name;
    fileSelected.style.display = 'flex';
    uploadArea.querySelector('.upload-content').style.display = 'none';
}

// Remove selected file
removeFileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    resumeFileInput.value = '';
    fileSelected.style.display = 'none';
    uploadArea.querySelector('.upload-content').style.display = 'block';
});


// ============================================================
// Form Submission
// ============================================================

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate inputs
    const jdText = jdTextInput.value.trim();
    const resumeText = resumeTextInput.value.trim();
    const hasFile = resumeFileInput.files.length > 0;
    
    if (!jdText) {
        showError('Please enter a job description.');
        return;
    }
    
    if (!resumeText && !hasFile) {
        showError('Please upload a PDF resume or paste your resume text.');
        return;
    }
    
    // Show loading state
    setLoading(true);
    hideError();
    
    try {
        // Build form data
        const formData = new FormData();
        formData.append('jd_text', jdText);
        
        if (hasFile) {
            formData.append('resume_file', resumeFileInput.files[0]);
        }
        if (resumeText) {
            formData.append('resume_text', resumeText);
        }
        
        // Send request to API
        const response = await fetch('/analyze', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            showError(data.error || 'Something went wrong. Please try again.');
            return;
        }
        
        if (data.success) {
            renderResults(data);
        } else {
            showError(data.error || 'Analysis failed.');
        }
        
    } catch (err) {
        console.error('Error:', err);
        showError('Failed to connect to the server. Make sure the Flask backend is running.');
    } finally {
        setLoading(false);
    }
});


// ============================================================
// New Analysis Button
// ============================================================

newAnalysisBtn.addEventListener('click', () => {
    resultsSection.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ============================================================
// Render Results
// ============================================================

function renderResults(data) {
    // Show results section
    resultsSection.style.display = 'block';
    
    // Scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    
    // Render each section
    renderScoreRings(data);
    renderStats(data.stats);
    renderATSBreakdown(data.ats_score);
    renderSkills(data);
    renderPriorityRanking(data.skill_ranking);
    renderLearningPath(data.learning_path);
    renderProjects(data.project_suggestions);
    renderTips(data.resume_tips);
}


// ---- Score Rings ----
function renderScoreRings(data) {
    const circumference = 2 * Math.PI * 52; // r=52
    
    // Skill Match Ring
    animateRing('match-ring', data.match_percentage, circumference);
    document.getElementById('match-percentage').textContent = data.match_percentage + '%';
    document.getElementById('match-subtitle').textContent = 
        `${data.stats.matching_count}/${data.stats.total_jd_skills} skills`;
    
    // Similarity Ring
    animateRing('similarity-ring', data.similarity_score, circumference);
    document.getElementById('similarity-score').textContent = data.similarity_score + '%';
    
    // ATS Ring
    animateRing('ats-ring', data.ats_score.total, circumference);
    document.getElementById('ats-score-value').textContent = data.ats_score.total;
    document.getElementById('ats-rating').textContent = data.ats_score.rating;
}

function animateRing(id, percentage, circumference) {
    const ring = document.getElementById(id);
    const offset = circumference - (percentage / 100) * circumference;
    
    // Reset first
    ring.style.strokeDashoffset = circumference;
    
    // Animate after a short delay
    setTimeout(() => {
        ring.style.strokeDashoffset = offset;
    }, 200);
}


// ---- Stats ----
function renderStats(stats) {
    animateNumber('stat-matched', stats.matching_count);
    animateNumber('stat-missing', stats.missing_count);
    animateNumber('stat-extra', stats.extra_count);
    animateNumber('stat-total', stats.total_jd_skills);
}

function animateNumber(id, target) {
    const el = document.getElementById(id);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 30));
    const interval = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(interval);
        }
        el.textContent = current;
    }, 30);
}


// ---- ATS Breakdown ----
function renderATSBreakdown(ats) {
    const container = document.getElementById('ats-bars');
    container.innerHTML = '';
    
    const bars = [
        { label: 'Keyword Match', value: ats.keyword_match, max: 40 },
        { label: 'Resume Sections', value: ats.section_score, max: 30 },
        { label: 'Resume Length', value: ats.length_score, max: 15 },
        { label: 'Skill Coverage', value: ats.skill_coverage, max: 15 }
    ];
    
    bars.forEach((bar, i) => {
        const percent = (bar.value / bar.max) * 100;
        const item = document.createElement('div');
        item.className = 'ats-bar-item';
        item.innerHTML = `
            <div class="ats-bar-label">
                <span>${bar.label}</span>
                <span>${bar.value}/${bar.max}</span>
            </div>
            <div class="ats-bar-track">
                <div class="ats-bar-fill" id="ats-bar-${i}"></div>
            </div>
        `;
        container.appendChild(item);
        
        // Animate bar fill
        setTimeout(() => {
            document.getElementById(`ats-bar-${i}`).style.width = percent + '%';
        }, 300 + i * 150);
    });
    
    // Add word count and sections info
    const infoDiv = document.createElement('div');
    infoDiv.style.cssText = 'grid-column: 1/-1; margin-top: 8px; font-size: 0.8rem; color: var(--text-secondary);';
    infoDiv.innerHTML = `📝 Word count: <strong>${ats.word_count}</strong> | 
        Sections found: <strong>${ats.sections_found.join(', ') || 'None'}</strong>`;
    container.appendChild(infoDiv);
}


// ---- Skills (Matching & Missing) ----
function renderSkills(data) {
    const matchingContainer = document.getElementById('matching-skills');
    const missingContainer = document.getElementById('missing-skills');
    
    matchingContainer.innerHTML = '';
    missingContainer.innerHTML = '';
    
    // Render matching skills by category
    if (data.matching_categorized && Object.keys(data.matching_categorized).length > 0) {
        renderCategorizedSkills(matchingContainer, data.matching_categorized, 'matched', '✔');
    } else {
        matchingContainer.innerHTML = '<div class="no-data">No matching skills found</div>';
    }
    
    // Render missing skills by category
    if (data.missing_categorized && Object.keys(data.missing_categorized).length > 0) {
        renderCategorizedSkills(missingContainer, data.missing_categorized, 'missing', '✘');
    } else {
        missingContainer.innerHTML = '<div class="no-data">No missing skills — great match! 🎉</div>';
    }
}

function renderCategorizedSkills(container, categorized, className, icon) {
    for (const [category, skills] of Object.entries(categorized)) {
        // Category label
        const label = document.createElement('div');
        label.className = 'category-label';
        label.textContent = category;
        container.appendChild(label);
        
        // Skill tags
        skills.forEach((skill, i) => {
            const tag = document.createElement('span');
            tag.className = `skill-tag ${className}`;
            tag.textContent = `${icon} ${skill}`;
            tag.style.animationDelay = `${i * 0.05}s`;
            container.appendChild(tag);
        });
    }
}


// ---- Priority Ranking ----
function renderPriorityRanking(ranking) {
    const container = document.getElementById('priority-grid');
    container.innerHTML = '';
    
    const levels = [
        { key: 'High', label: 'High Priority', dotClass: 'high' },
        { key: 'Medium', label: 'Medium Priority', dotClass: 'medium' },
        { key: 'Low', label: 'Low Priority', dotClass: 'low' }
    ];
    
    levels.forEach(level => {
        const skills = ranking[level.key] || [];
        const column = document.createElement('div');
        column.className = 'priority-column';
        column.innerHTML = `
            <div class="priority-header">
                <div class="priority-dot ${level.dotClass}"></div>
                <span>${level.label}</span>
            </div>
            ${skills.length > 0 
                ? skills.map(s => `<div class="priority-skill">${s}</div>`).join('') 
                : '<div class="priority-skill" style="color: var(--text-muted); font-style: italic;">None</div>'}
        `;
        container.appendChild(column);
    });
}


// ---- Learning Path ----
function renderLearningPath(paths) {
    const container = document.getElementById('learning-list');
    container.innerHTML = '';
    
    if (!paths || paths.length === 0) {
        container.innerHTML = '<div class="no-data">No learning paths needed — you have all the skills! 🎉</div>';
        return;
    }
    
    // Show max 6 learning paths
    paths.slice(0, 6).forEach(path => {
        const item = document.createElement('div');
        item.className = 'learning-item';
        item.innerHTML = `
            <div class="learning-header">
                <h4>📖 ${path.skill}</h4>
                <span class="learning-time">⏱ ${path.estimated_time}</span>
            </div>
            <ol class="learning-steps">
                ${path.steps.map(s => `<li>${s}</li>`).join('')}
            </ol>
            <div class="learning-resources">
                ${path.resources.map(r => `<span class="resource-tag">${r}</span>`).join('')}
            </div>
        `;
        container.appendChild(item);
    });
    
    if (paths.length > 6) {
        const more = document.createElement('div');
        more.className = 'no-data';
        more.textContent = `+${paths.length - 6} more skills to learn`;
        container.appendChild(more);
    }
}


// ---- Project Suggestions ----
function renderProjects(suggestions) {
    const container = document.getElementById('projects-list');
    container.innerHTML = '';
    
    if (!suggestions || suggestions.length === 0) {
        container.innerHTML = '<div class="no-data">No project suggestions needed 🎉</div>';
        return;
    }
    
    // Show max 6 skill groups
    suggestions.slice(0, 6).forEach(group => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'project-group';
        groupDiv.innerHTML = `
            <h4>🛠 ${group.skill}</h4>
            ${group.projects.map(p => `
                <div class="project-item">
                    <div class="project-name">${p.name}</div>
                    <div class="project-desc">${p.description}</div>
                    <span class="project-difficulty ${p.difficulty.toLowerCase()}">${p.difficulty}</span>
                </div>
            `).join('')}
        `;
        container.appendChild(groupDiv);
    });
}


// ---- Resume Tips ----
function renderTips(tips) {
    const container = document.getElementById('tips-list');
    container.innerHTML = '';
    
    if (!tips || tips.length === 0) {
        container.innerHTML = '<div class="no-data">Your resume looks great! 🎉</div>';
        return;
    }
    
    tips.forEach(tip => {
        const item = document.createElement('div');
        item.className = 'tip-item';
        const priorityClass = tip.priority ? tip.priority.toLowerCase() : 'medium';
        item.innerHTML = `
            <span class="tip-priority ${priorityClass}">${tip.priority || 'Info'}</span>
            <div class="tip-content">
                <div class="tip-category">${tip.category || ''}</div>
                <div class="tip-text">${tip.tip}</div>
            </div>
        `;
        container.appendChild(item);
    });
}


// ============================================================
// Utility Functions
// ============================================================

function setLoading(loading) {
    if (loading) {
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        analyzeBtn.disabled = true;
        analyzeBtn.style.opacity = '0.8';
    } else {
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        analyzeBtn.disabled = false;
        analyzeBtn.style.opacity = '1';
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function hideError() {
    errorMessage.style.display = 'none';
}
