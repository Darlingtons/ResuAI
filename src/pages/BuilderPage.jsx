import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useResumes } from '../context/resumeContext';
import { useAuth } from '../context/authContext';
import { useTheme } from '../context/themeContext';
import { ResumeTemplateRenderer } from '../templates/ResumeTemplateRenderer';
import { 
  Sparkles, Download, Check, Save, ArrowLeft, Plus, Trash2, ChevronDown, 
  ChevronUp, User, Briefcase, GraduationCap, Code, FileCode, Loader2, CheckCircle2,
  Trophy, Heart, Lock, Sun, Moon, Eye, Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './BuilderPage.css';

const CustomDropdown = ({ value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="custom-dropdown-container">
      <button 
        type="button"
        className="custom-dropdown-trigger" 
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
      >
        <span>{options.find(o => o.value === value)?.label || value}</span>
        <ChevronDown size={14} />
      </button>
      
      {isOpen && (
        <div className="custom-dropdown-menu">
          {options.map(opt => (
            <div 
              key={opt.value} 
              className={`custom-dropdown-item ${value === opt.value ? 'active' : ''}`}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const BuilderPage = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { resumes, loading, activeResume, getResumeById, updateResumeData, updateResumeSettings, saveActiveResume, setActiveResumeById, isAutosaving } = useResumes();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resumeId = searchParams.get('id');

  const [activeSec, setActiveSec] = useState('personal');
  const [aiLoadingSec, setAiLoadingSec] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState({ isOpen: false, feature: '' });
  const [mobileView, setMobileView] = useState('editor'); // 'editor' | 'preview'

  // Styling selectors
  const colorsList = [
    '#6366f1', '#3b82f6', '#0ea5e9', '#10b981', 
    '#84cc16', '#eab308', '#f59e0b', '#f97316', 
    '#ef4444', '#ec4899', '#d946ef', '#8b5cf6', 
    '#0f172a', '#475569'
  ];
  const fontsList = [
    'Plus Jakarta Sans', 'Roboto', 'Inter', 'Open Sans', 
    'Lato', 'Montserrat', 'Merriweather', 'Georgia', 
    'Playfair Display', 'Oswald', 'Nunito', 'Raleway', 
    'Ubuntu', 'Lora'
  ];

  useEffect(() => {
    if (!resumeId) {
      navigate('/dashboard');
      return;
    }
    
    // Only attempt to set active resume if Firebase has finished loading
    if (!loading) {
      const match = resumes.find(r => r.id === resumeId);
      if (match) {
        setActiveResumeById(resumeId);
      } else {
        navigate('/dashboard'); // ID not found, bounce to dashboard
      }
    }
  }, [resumeId, resumes, loading, setActiveResumeById, navigate]);

  if (!activeResume) {
    return (
      <div className="builder-loading">
        <Loader2 className="spinner loading-icon" size={48} />
        <p>Loading your resume builder session...</p>
      </div>
    );
  }

  const { data, template, color, font, title } = activeResume;
  const { personalInfo, experience, education, skills, projects } = data;
  const achievements = data.achievements || [];
  const hobbies = data.hobbies || [];

  const toggleSection = (sec) => {
    setActiveSec(activeSec === sec ? '' : sec);
  };

  // 1. Personal Info handlers
  const proTemplates = ['modern', 'creative', 'executive'];
  const proFonts = ['Montserrat', 'Playfair Display', 'Oswald'];

  const handleTemplateChange = (val) => {
    if (proTemplates.includes(val) && (!user || !user.isPro)) {
      setShowUpgradeModal({ isOpen: true, feature: 'Premium Templates' });
      return;
    }
    updateResumeSettings({ template: val });
  };

  const handleFontChange = (val) => {
    if (proFonts.includes(val) && (!user || !user.isPro)) {
      setShowUpgradeModal({ isOpen: true, feature: 'Premium Fonts' });
      return;
    }
    updateResumeSettings({ font: val });
  };

  const handlePersonalChange = (field, val) => {
    updateResumeData({
      personalInfo: {
        ...personalInfo,
        [field]: val
      }
    });
  };

  // AI Summary generation mock
  const generateAISummary = () => {
    if (!personalInfo.title) {
      alert('Please fill out your Professional Title first so the AI knows your role.');
      return;
    }
    setAiLoadingSec('summary');
    setTimeout(() => {
      const summaries = {
        'software engineer': 'Driven software developer with experience crafting high-speed microservices, writing reusable frontend frameworks, and setting up automated CI/CD deployment sequences.',
        'developer': 'Full-stack software developer with deep expertise designing React architectures, optimizing database configurations, and writing clean, scalable TypeScript services.',
        'product manager': 'Strategic product manager with an analytical mind, skilled in mapping user journeys, coordinating cross-functional engineering processes, and tracking market engagement analytics.',
        'student': 'Aspirational computer science student specializing in frontend architectures, data structures, and team project cooperation. Eager to contribute fresh perspectives.',
      };

      const key = personalInfo.title.toLowerCase();
      const matched = Object.keys(summaries).find(k => key.includes(k));
      const aiText = matched ? summaries[matched] : `Accomplished ${personalInfo.title} with a track record of driving projects to successful completion, designing strategic processes, and writing structured, scalable documentation.`;

      handlePersonalChange('summary', aiText);
      setAiLoadingSec(null);
    }, 1500);
  };

  // 2. Experience Handlers
  const addExperience = () => {
    const newItem = {
      id: 'exp_' + Math.random().toString(36).substring(2, 9),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      location: ''
    };
    updateResumeData({ experience: [...experience, newItem] });
  };

  const updateExperience = (id, field, val) => {
    const list = experience.map(item => {
      if (item.id === id) {
        return { ...item, [field]: val };
      }
      return item;
    });
    updateResumeData({ experience: list });
  };

  const removeExperience = (id) => {
    updateResumeData({ experience: experience.filter(item => item.id !== id) });
  };

  const generateAIJobDesc = (id, position) => {
    if (!position) {
      alert('Please provide a Job Title/Position first to optimize context.');
      return;
    }
    setAiLoadingSec(id);

    setTimeout(() => {
      const bullets = {
        'software': `- Designed React application architectures using TypeScript, boosting responsiveness by 25%.
- Maintained REST APIs and SQL tables, reducing slow query execution delays by 40%.
- Managed Docker test cases, resolving development environment conflicts.`,
        'developer': `- Led development of mobile-first UI components, raising active sessions count.
- Configured Jest unit tests, saving 15 hours of manual QA checks weekly.
- Coordinated code review processes, boosting code deployment speed.`,
        'designer': `- Crafted interactive UX wireframes and user personas, decreasing customer drop rates by 12%.
- Styled UI graphics in Figma, implementing a complete custom design kit.
- Directed visual layout reviews alongside product managers.`,
      };

      const key = position.toLowerCase();
      const matched = Object.keys(bullets).find(k => key.includes(k));
      const aiText = matched ? bullets[matched] : `- Handled core deliverables for ${position} operations.
- Resolved technical issues, reducing project delivery delays.
- Teamed up with international departments, promoting code updates.`;

      updateExperience(id, 'description', aiText);
      setAiLoadingSec(null);
    }, 1500);
  };

  // 3. Education Handlers
  const addEducation = () => {
    const newItem = {
      id: 'edu_' + Math.random().toString(36).substring(2, 9),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
      description: '',
      location: ''
    };
    updateResumeData({ education: [...education, newItem] });
  };

  const updateEducation = (id, field, val) => {
    const list = education.map(item => {
      if (item.id === id) {
        return { ...item, [field]: val };
      }
      return item;
    });
    updateResumeData({ education: list });
  };

  const removeEducation = (id) => {
    updateResumeData({ education: education.filter(item => item.id !== id) });
  };

  // 4. Skills Handlers
  const addSkill = () => {
    const newItem = {
      id: 'sk_' + Math.random().toString(36).substring(2, 9),
      name: '',
      level: 'Intermediate',
      category: 'General'
    };
    updateResumeData({ skills: [...skills, newItem] });
  };

  const updateSkill = (id, field, val) => {
    const list = skills.map(item => {
      if (item.id === id) {
        return { ...item, [field]: val };
      }
      return item;
    });
    updateResumeData({ skills: list });
  };

  const removeSkill = (id) => {
    updateResumeData({ skills: skills.filter(item => item.id !== id) });
  };

  // 5. Projects Handlers
  const addProject = () => {
    const newItem = {
      id: 'proj_' + Math.random().toString(36).substring(2, 9),
      name: '',
      description: '',
      technologies: '',
      link: '',
      role: '',
      startDate: '',
      endDate: ''
    };
    updateResumeData({ projects: [...projects, newItem] });
  };

  const updateProject = (id, field, val) => {
    const list = projects.map(item => {
      if (item.id === id) {
        return { ...item, [field]: val };
      }
      return item;
    });
    updateResumeData({ projects: list });
  };

  const removeProject = (id) => {
    updateResumeData({ projects: projects.filter(item => item.id !== id) });
  };

  // 6. Achievements Handlers
  const addAchievement = () => {
    const newItem = {
      id: 'ach_' + Math.random().toString(36).substring(2, 9),
      title: '',
      date: '',
      description: ''
    };
    updateResumeData({ achievements: [...achievements, newItem] });
  };

  const updateAchievement = (id, field, val) => {
    const list = achievements.map(item => {
      if (item.id === id) {
        return { ...item, [field]: val };
      }
      return item;
    });
    updateResumeData({ achievements: list });
  };

  const removeAchievement = (id) => {
    updateResumeData({ achievements: achievements.filter(item => item.id !== id) });
  };

  // 7. Hobbies Handlers
  const addHobby = () => {
    const newItem = {
      id: 'hob_' + Math.random().toString(36).substring(2, 9),
      name: ''
    };
    updateResumeData({ hobbies: [...hobbies, newItem] });
  };

  const updateHobby = (id, field, val) => {
    const list = hobbies.map(item => {
      if (item.id === id) {
        return { ...item, [field]: val };
      }
      return item;
    });
    updateResumeData({ hobbies: list });
  };

  const removeHobby = (id) => {
    updateResumeData({ hobbies: hobbies.filter(item => item.id !== id) });
  };

  // PDF Download Window printing trigger
  const handlePrintDownload = () => {
    // Add print styles dynamically
    const style = document.createElement('style');
    style.id = 'print-style-rules';
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        #resume-print-target, #resume-print-target * {
          visibility: visible;
        }
        #resume-print-target {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
      }
    `;
    document.head.appendChild(style);
    window.print();
    // Cleanup afterwards
    setTimeout(() => {
      const sheet = document.getElementById('print-style-rules');
      if (sheet) sheet.remove();
    }, 1000);
  };

  const handleManualSave = () => {
    saveActiveResume();
    alert('Resume successfully saved!');
  };

  return (
    <div className="builder-page">
      {/* Top Header Status Bar */}
      <header className="builder-navbar no-print glassmorphism">
        <div className="builder-nav-left">
          <button className="back-to-dash" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={16} /> <span>Dashboard</span>
          </button>
          <div className="title-renamer">
            <input 
              type="text" 
              value={title} 
              onChange={(e) => updateResumeSettings({ title: e.target.value })}
              title="Click to rename resume title"
            />
          </div>
        </div>

        <div className="builder-nav-right">
          {/* Theme Toggle Button */}
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center' }}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Autosaving Indicator status */}
          <div className="autosave-status">
            {isAutosaving ? (
              <span className="saving"><Loader2 className="spinner" size={14} /> Saving...</span>
            ) : (
              <span className="saved"><CheckCircle2 size={14} /> Autosaved</span>
            )}
          </div>

          <button className="icon-btn-secondary" onClick={handleManualSave}>
            <Save size={16} /> <span>Save</span>
          </button>
          
          <button className="glow-btn download-pdf-btn" onClick={handlePrintDownload}>
            <Download size={16} /> <span>Download PDF</span>
          </button>
        </div>
      </header>

      <div className="builder-workspace">
        {/* LEFT FORM COLUMN */}
        <aside className={`editor-panel no-print ${mobileView === 'editor' ? 'mobile-active' : 'mobile-hidden'}`}>
          {/* 1. PERSONAL INFO SECTION */}
          <div className="editor-section">
            <button className="section-trigger" onClick={() => toggleSection('personal')}>
              <div className="trigger-left">
                <User size={18} />
                <span>Personal Information</span>
              </div>
              {activeSec === 'personal' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {activeSec === 'personal' && (
              <div className="section-body">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      value={personalInfo.name} 
                      onChange={(e) => handlePersonalChange('name', e.target.value)} 
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="form-group">
                    <label>Professional Title</label>
                    <input 
                      type="text" 
                      value={personalInfo.title} 
                      onChange={(e) => handlePersonalChange('title', e.target.value)} 
                      placeholder="Frontend Architect"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      value={personalInfo.email} 
                      onChange={(e) => handlePersonalChange('email', e.target.value)} 
                      placeholder="you@email.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input 
                      type="tel" 
                      value={personalInfo.phone} 
                      onChange={(e) => handlePersonalChange('phone', e.target.value)} 
                      placeholder="(555) 000-0000"
                    />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input 
                      type="text" 
                      value={personalInfo.location} 
                      onChange={(e) => handlePersonalChange('location', e.target.value)} 
                      placeholder="San Francisco, CA"
                    />
                  </div>
                  <div className="form-group">
                    <label>Website</label>
                    <input 
                      type="text" 
                      value={personalInfo.website} 
                      onChange={(e) => handlePersonalChange('website', e.target.value)} 
                      placeholder="johndoe.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>GitHub</label>
                    <input 
                      type="text" 
                      value={personalInfo.github} 
                      onChange={(e) => handlePersonalChange('github', e.target.value)} 
                      placeholder="github.com/username"
                    />
                  </div>
                  <div className="form-group">
                    <label>LinkedIn</label>
                    <input 
                      type="text" 
                      value={personalInfo.linkedin} 
                      onChange={(e) => handlePersonalChange('linkedin', e.target.value)} 
                      placeholder="linkedin.com/in/username"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="label-with-ai">
                    <label>Professional Summary</label>
                    <button 
                      type="button" 
                      className="ai-gen-btn"
                      onClick={generateAISummary}
                      disabled={aiLoadingSec === 'summary'}
                    >
                      {aiLoadingSec === 'summary' ? (
                        <Loader2 className="spinner" size={12} />
                      ) : (
                        <><Sparkles size={12} /> Auto-Write AI</>
                      )}
                    </button>
                  </div>
                  <textarea 
                    value={personalInfo.summary} 
                    onChange={(e) => handlePersonalChange('summary', e.target.value)}
                    placeholder="Briefly detail your core professional expertise and highlights..."
                    rows={4}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2. EXPERIENCE SECTION */}
          <div className="editor-section">
            <button className="section-trigger" onClick={() => toggleSection('experience')}>
              <div className="trigger-left">
                <Briefcase size={18} />
                <span>Work Experience</span>
              </div>
              {activeSec === 'experience' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {activeSec === 'experience' && (
              <div className="section-body">
                <AnimatePresence>
                  {experience.map((exp, index) => (
                    <motion.div 
                      key={exp.id} 
                      className="list-item-block"
                      layout
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20, height: 0, margin: 0, padding: 0, overflow: 'hidden' }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="item-block-header">
                        <h4>Job Entry #{index + 1}</h4>
                      <button className="remove-btn" onClick={() => removeExperience(exp.id)}>
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>Company</label>
                        <input 
                          type="text" 
                          value={exp.company} 
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          placeholder="e.g. Acme Inc"
                        />
                      </div>
                      <div className="form-group">
                        <label>Job Title / Position</label>
                        <input 
                          type="text" 
                          value={exp.position} 
                          onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                          placeholder="e.g. Lead Engineer"
                        />
                      </div>
                      <div className="form-group">
                        <label>Start Date</label>
                        <input 
                          type="date" 
                          value={exp.startDate} 
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>End Date</label>
                        <input 
                          type="date" 
                          value={exp.endDate} 
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          disabled={exp.current}
                        />
                      </div>
                      <div className="form-checkbox-group">
                        <input 
                          type="checkbox" 
                          id={`current-job-${exp.id}`}
                          checked={exp.current} 
                          onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                        />
                        <label htmlFor={`current-job-${exp.id}`}>I currently work here</label>
                      </div>
                      <div className="form-group">
                        <label>Location</label>
                        <input 
                          type="text" 
                          value={exp.location} 
                          onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                          placeholder="Remote / New York"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="label-with-ai">
                        <label>Job Description & Achievements</label>
                        <button 
                          type="button" 
                          className="ai-gen-btn"
                          onClick={() => generateAIJobDesc(exp.id, exp.position)}
                          disabled={aiLoadingSec === exp.id}
                        >
                          {aiLoadingSec === exp.id ? (
                            <Loader2 className="spinner" size={12} />
                          ) : (
                            <><Sparkles size={12} /> Optimize with AI</>
                          )}
                        </button>
                      </div>
                      <textarea 
                        value={exp.description} 
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        placeholder="Detail key projects, technologies managed, and metric accomplishments..."
                        rows={4}
                      />
                    </div>
                  </motion.div>
                ))}
                </AnimatePresence>
                
                <button className="add-btn-primary" onClick={addExperience}>
                  <Plus size={16} /> Add Experience
                </button>
              </div>
            )}
          </div>

          {/* 3. EDUCATION SECTION */}
          <div className="editor-section">
            <button className="section-trigger" onClick={() => toggleSection('education')}>
              <div className="trigger-left">
                <GraduationCap size={18} />
                <span>Education</span>
              </div>
              {activeSec === 'education' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {activeSec === 'education' && (
              <div className="section-body">
                <AnimatePresence>
                  {education.map((edu, idx) => (
                    <motion.div 
                      key={edu.id} 
                      className="list-item-block"
                      layout
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20, height: 0, margin: 0, padding: 0, overflow: 'hidden' }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="item-block-header">
                        <h4>Education Entry #{idx + 1}</h4>
                      <button className="remove-btn" onClick={() => removeEducation(edu.id)}>
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>Institution / University</label>
                        <input 
                          type="text" 
                          value={edu.institution} 
                          onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                          placeholder="e.g. Stanford University"
                        />
                      </div>
                      <div className="form-group">
                        <label>Degree / Certificate</label>
                        <input 
                          type="text" 
                          value={edu.degree} 
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          placeholder="e.g. Bachelor of Science"
                        />
                      </div>
                      <div className="form-group">
                        <label>Field of Study</label>
                        <input 
                          type="text" 
                          value={edu.fieldOfStudy} 
                          onChange={(e) => updateEducation(edu.id, 'fieldOfStudy', e.target.value)}
                          placeholder="e.g. Computer Science"
                        />
                      </div>
                      <div className="form-group">
                        <label>GPA</label>
                        <input 
                          type="text" 
                          value={edu.gpa} 
                          onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                          placeholder="3.8 / 4.0"
                        />
                      </div>
                      <div className="form-group">
                        <label>Start Date</label>
                        <input 
                          type="date" 
                          value={edu.startDate} 
                          onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>End Date</label>
                        <input 
                          type="date" 
                          value={edu.endDate} 
                          onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                          disabled={edu.current}
                        />
                      </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                <button className="add-btn-primary" onClick={addEducation}>
                  <Plus size={16} /> Add Education
                </button>
              </div>
            )}
          </div>

          {/* 4. SKILLS SECTION */}
          <div className="editor-section">
            <button className="section-trigger" onClick={() => toggleSection('skills')}>
              <div className="trigger-left">
                <Code size={18} />
                <span>Skills</span>
              </div>
              {activeSec === 'skills' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {activeSec === 'skills' && (
              <div className="section-body">
                <div className="skills-editor-grid">
                  <AnimatePresence>
                    {skills.map((skill) => (
                      <motion.div 
                        key={skill.id} 
                        className="skill-edit-item"
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, overflow: 'hidden' }}
                        transition={{ duration: 0.2 }}
                      >
                        <input 
                          type="text" 
                        value={skill.name} 
                        onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                        placeholder="React / SQL"
                        className="skill-input"
                      />
                      <select 
                        value={skill.level} 
                        onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                        className="skill-select"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert">Expert</option>
                      </select>
                      <button className="skill-remove-btn" onClick={() => removeSkill(skill.id)}>
                        <Trash2 size={14} />
                      </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                
                <button className="add-btn-primary" onClick={addSkill}>
                  <Plus size={16} /> Add Skill
                </button>
              </div>
            )}
          </div>

          {/* 5. PROJECTS SECTION */}
          <div className="editor-section">
            <button className="section-trigger" onClick={() => toggleSection('projects')}>
              <div className="trigger-left">
                <FileCode size={18} />
                <span>Projects</span>
              </div>
              {activeSec === 'projects' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {activeSec === 'projects' && (
              <div className="section-body">
                <AnimatePresence>
                  {projects.map((proj, i) => (
                    <motion.div 
                      key={proj.id} 
                      className="list-item-block"
                      layout
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20, height: 0, margin: 0, padding: 0, overflow: 'hidden' }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="item-block-header">
                        <h4>Project Entry #{i + 1}</h4>
                      <button className="remove-btn" onClick={() => removeProject(proj.id)}>
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>Project Name</label>
                        <input 
                          type="text" 
                          value={proj.name} 
                          onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                          placeholder="e.g. Chat App"
                        />
                      </div>
                      <div className="form-group">
                        <label>Role</label>
                        <input 
                          type="text" 
                          value={proj.role} 
                          onChange={(e) => updateProject(proj.id, 'role', e.target.value)}
                          placeholder="e.g. Sole Creator / Lead"
                        />
                      </div>
                      <div className="form-group">
                        <label>Technologies Used</label>
                        <input 
                          type="text" 
                          value={proj.technologies} 
                          onChange={(e) => updateProject(proj.id, 'technologies', e.target.value)}
                          placeholder="e.g. React, Firebase, CSS"
                        />
                      </div>
                      <div className="form-group">
                        <label>Project Link</label>
                        <input 
                          type="text" 
                          value={proj.link} 
                          onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                          placeholder="e.g. github.com/chat-app"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Project Description</label>
                      <textarea 
                        value={proj.description} 
                        onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                        placeholder="Detail the project goals, tech stack implementation and delivery outcomes..."
                        rows={3}
                      />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <button className="add-btn-primary" onClick={addProject}>
                  <Plus size={16} /> Add Project
                </button>
              </div>
            )}
          </div>

          {/* 6. ACHIEVEMENTS SECTION */}
          <div className="editor-section">
            <button className="section-trigger" onClick={() => toggleSection('achievements')}>
              <div className="trigger-left">
                <Trophy size={18} />
                <span>Achievements</span>
              </div>
              {activeSec === 'achievements' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {activeSec === 'achievements' && (
              <div className="section-body">
                <AnimatePresence>
                  {achievements.map((ach, idx) => (
                    <motion.div 
                      key={ach.id} 
                      className="list-item-block"
                      layout
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20, height: 0, margin: 0, padding: 0, overflow: 'hidden' }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="item-block-header">
                        <h4>Achievement Entry #{idx + 1}</h4>
                      <button className="remove-btn" onClick={() => removeAchievement(ach.id)}>
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>Achievement Title</label>
                        <input 
                          type="text" 
                          value={ach.title} 
                          onChange={(e) => updateAchievement(ach.id, 'title', e.target.value)}
                          placeholder="e.g. Winner of Hackathon"
                        />
                      </div>
                      <div className="form-group">
                        <label>Date</label>
                        <input 
                          type="text" 
                          value={ach.date} 
                          onChange={(e) => updateAchievement(ach.id, 'date', e.target.value)}
                          placeholder="e.g. May 2026"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <textarea 
                        value={ach.description} 
                        onChange={(e) => updateAchievement(ach.id, 'description', e.target.value)}
                        placeholder="Detail the recognition, parameters of success, or results..."
                        rows={2}
                      />
                    </div>
                  </motion.div>
                ))}
                </AnimatePresence>

                <button className="add-btn-primary" onClick={addAchievement}>
                  <Plus size={16} /> Add Achievement
                </button>
              </div>
            )}
          </div>

          {/* 7. HOBBIES SECTION */}
          <div className="editor-section">
            <button className="section-trigger" onClick={() => toggleSection('hobbies')}>
              <div className="trigger-left">
                <Heart size={18} />
                <span>Hobbies & Interests</span>
              </div>
              {activeSec === 'hobbies' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {activeSec === 'hobbies' && (
              <div className="section-body">
                <div className="skills-editor-grid">
                  <AnimatePresence>
                    {hobbies.map((hob) => (
                      <motion.div 
                        key={hob.id} 
                        className="skill-edit-item"
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, overflow: 'hidden' }}
                        transition={{ duration: 0.2 }}
                      >
                        <input 
                          type="text" 
                        value={hob.name} 
                        onChange={(e) => updateHobby(hob.id, 'name', e.target.value)}
                        placeholder="e.g. Photography / Traveling"
                        className="skill-input"
                        style={{ flex: 1 }}
                      />
                      <button className="skill-remove-btn" onClick={() => removeHobby(hob.id)}>
                        <Trash2 size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <button className="add-btn-primary" onClick={addHobby} style={{ marginTop: '10px' }}>
                  <Plus size={16} /> Add Hobby
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT PREVIEW PANEL */}
        <main className={`preview-panel-container ${mobileView === 'preview' ? 'mobile-active' : 'mobile-hidden'}`}>
          {/* Style Toolbar customization toolbar */}
          <div className="style-customizer-toolbar no-print glassmorphism">
            {/* Template type switch */}
            <div className="customizer-group">
              <label>Template</label>
              <CustomDropdown
                value={template}
                onChange={handleTemplateChange}
                options={[
                  { value: 'classic', label: 'Classic' },
                  { value: 'modern', label: 'Modern 👑' },
                  { value: 'minimal', label: 'Minimal' },
                  { value: 'creative', label: 'Creative 👑' },
                  { value: 'executive', label: 'Executive 👑' },
                  { value: 'technical', label: 'Technical' },
                  { value: 'fresher', label: 'Fresher' },
                ]}
              />
            </div>

            {/* Font selector */}
            <div className="customizer-group">
              <label>Font</label>
              <CustomDropdown
                value={font}
                onChange={handleFontChange}
                options={fontsList.map(f => ({
                  value: f,
                  label: `${f} ${proFonts.includes(f) ? '👑' : ''}`
                }))}
              />
            </div>

            {/* Color accent selection */}
            <div className="customizer-group">
              <label>Color Theme</label>
              <div className="color-palette-picker">
                {colorsList.map((c) => (
                  <button 
                    key={c} 
                    className={`palette-color-btn ${color === c ? 'active' : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => updateResumeSettings({ color: c })}
                    title={`Accent ${c}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Core Target paper container */}
          <div className="resume-paper-scroller">
            <div id="resume-print-target" className="resume-paper-boundary">
              <AnimatePresence mode="wait">
                <motion.div
                  key={template}
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                >
                  <ResumeTemplateRenderer data={data} template={template} color={color} font={font} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="mobile-nav-bar glassmorphism no-print">
        <button 
          className={`mobile-nav-btn ${mobileView === 'editor' ? 'active' : ''}`}
          onClick={() => setMobileView('editor')}
        >
          <Edit2 size={20} />
          <span>Editor</span>
        </button>
        <button 
          className={`mobile-nav-btn ${mobileView === 'preview' ? 'active' : ''}`}
          onClick={() => setMobileView('preview')}
        >
          <Eye size={20} />
          <span>Preview</span>
        </button>
      </div>
      
      {/* Upgrade Modal */}
      {showUpgradeModal.isOpen && (
        <div className="modal-overlay glassmorphism" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="upgrade-modal glassmorphism" style={{ padding: '40px', textAlign: 'center', maxWidth: '400px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <Lock size={48} style={{ color: 'var(--primary-color)', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>Unlock {showUpgradeModal.feature}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: '1.5' }}>
              Upgrade to ResuAI Pro to access premium templates, fonts, and advanced AI features. Stand out from the crowd!
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="icon-btn-secondary" onClick={() => setShowUpgradeModal({ isOpen: false, feature: '' })}>
                Cancel
              </button>
              <button className="glow-btn" onClick={() => navigate('/pricing')} style={{ padding: '8px 24px' }}>
                View Pricing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
