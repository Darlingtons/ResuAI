import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart2, CheckCircle2, AlertTriangle, AlertOctagon, Loader2, UploadCloud, FileText as FileTextIcon, Lock } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { useAuth } from '../context/authContext';
import './AtsCheckerPage.css';

// Configure PDF.js worker for Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

export const AtsCheckerPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const hasReachedLimit = !user && localStorage.getItem('ats_checked_once') === 'true';

  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  
  // File upload states
  const [fileName, setFileName] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Analysis result states
  const [sectionBreakdown, setSectionBreakdown] = useState([]);
  const [wordCount, setWordCount] = useState(0);

  const extractTextFromPdf = async (file) => {
    try {
      setIsExtracting(true);
      setUploadError('');
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + ' \n';
      }
      
      if (!fullText.trim()) {
        setUploadError('No text could be found. Please ensure this is a text-based PDF, not a scanned image.');
        setResumeText('');
      } else {
        const textLower = fullText.toLowerCase();

        // 1. Page count validation: Resumes are typically 1-3 pages. Catching multi-page manuals/guides.
        if (pdf.numPages > 3) {
          setUploadError(`This document has too many pages (${pdf.numPages}). A standard professional CV/Resume should be between 1 to 3 pages. Please upload a condensed resume.`);
          setResumeText('');
          setFileName('');
          return;
        }

        // 2. Resume Structure Pillars validation (Requires at least 2 key headings)
        const hasEducation = textLower.includes('education') || textLower.includes('academic') || textLower.includes('university') || textLower.includes('degree');
        const hasExperience = textLower.includes('experience') || textLower.includes('employment') || textLower.includes('work history') || textLower.includes('professional history');
        const hasSkills = textLower.includes('skills') || textLower.includes('expertise') || textLower.includes('technologies') || textLower.includes('technical expertise');
        
        const pillarScore = (hasEducation ? 1 : 0) + (hasExperience ? 1 : 0) + (hasSkills ? 1 : 0);

        // 3. Dense Resume vocabulary validation
        const cvKeywords = [
          'experience', 'education', 'skills', 'projects', 'employment', 
          'work history', 'achievements', 'certifications', 'curriculum vitae', 'resume',
          'developed', 'implemented', 'designed', 'managed', 'led', 'degree', 'qualification', 'contact'
        ];
        const matchCount = cvKeywords.filter(keyword => textLower.includes(keyword)).length;

        if (pillarScore < 2 || matchCount < 6) {
          setUploadError('This file does not appear to be a valid CV/Resume. Please upload a standard professional resume (including headings like Experience, Education, and Skills).');
          setResumeText('');
          setFileName('');
        } else {
          setResumeText(fullText);
          setFileName(file.name);
        }
      }
    } catch (error) {
      console.error('Error extracting PDF text:', error);
      setUploadError('Failed to read PDF. Please try a different file or ensure it is a valid text-based PDF.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      const isPdfExtension = file.name.toLowerCase().endsWith('.pdf');
      if (file.type !== 'application/pdf' && !isPdfExtension) {
        setUploadError('Please upload a valid PDF file. No other formats are allowed.');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setUploadError('File size must be under 2 MB.');
        return;
      }
      extractTextFromPdf(file);
    }
  };

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (!resumeText.trim()) return;

    setIsAnalyzing(true);
    setShowResults(false);
    setUploadError('');

    // Mark as used for anonymous users
    if (!user) {
      localStorage.setItem('ats_checked_once', 'true');
    }

    // Mock analysis calculation delay to show loading state
    setTimeout(() => {
      let totalScore = 0;
      const breakdowns = [];
      const normalizedResume = resumeText.toLowerCase();
      
      // 1. Length & Word Count (10 points max)
      const words = resumeText.trim().split(/\s+/).filter(word => word.length > 1);
      const wCount = words.length;
      setWordCount(wCount);
      let lengthScore = 10;
      
      if (wCount < 400) {
        lengthScore = Math.max(0, 10 - Math.floor((400 - wCount) / 40));
      } else if (wCount > 600) {
        lengthScore = Math.max(0, 10 - Math.floor((wCount - 600) / 40));
      }
      
      let lengthFeedback = '';
      if (lengthScore < 6) {
        lengthFeedback = `Your resume has ${wCount} words. Aim for the sweet spot of 400-600 words for optimal readability.`;
      } else if (lengthScore < 9) {
        lengthFeedback = `Your resume has ${wCount} words. Good length, but could be slightly closer to 400-600 words.`;
      } else {
        lengthFeedback = `Perfect length (${wCount} words)! You have a solid amount of detail without being overwhelming.`;
      }
      
      totalScore += lengthScore * 10; // 10% weight (score is out of 10)
      
      breakdowns.push({
        name: 'Word Count & Length',
        score: lengthScore * 10,
        feedback: lengthFeedback
      });

      // 2. Contact Information (20 points max)
      let contactScore = 0;
      const missingContacts = [];
      
      const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(normalizedResume);
      if (hasEmail) contactScore += 7;
      else missingContacts.push('Email');
      
      const hasPhone = /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/.test(resumeText) || /\+\d{1,3}/.test(resumeText);
      if (hasPhone) contactScore += 7;
      else missingContacts.push('Phone Number');
      
      const hasLinkedIn = normalizedResume.includes('linkedin.com');
      if (hasLinkedIn) contactScore += 6;
      else missingContacts.push('LinkedIn Profile');
      
      totalScore += contactScore * (20/20) * 10; // 20% weight
      
      breakdowns.push({
        name: 'Contact Details',
        score: contactScore * 5, // out of 20 * 5 = 100
        feedback: missingContacts.length === 0 
          ? 'All essential contact details found.' 
          : `Missing standard contact info: ${missingContacts.join(', ')}.`
      });

      // 3. Quantifiable Achievements (30 points max)
      // Look for percentages, currencies, and non-year numbers (1-999)
      const percentages = resumeText.match(/\d+%/g) || resumeText.match(/percent/gi) || [];
      const currencies = resumeText.match(/\$\d+/g) || resumeText.match(/USD/g) || [];
      const smallNumbers = resumeText.match(/\b(?:[1-9]|[1-9]\d|[1-9]\d{2})\b/g) || [];
      
      // Weight explicit metrics heavily
      const metricsWeight = (percentages.length * 2) + (currencies.length * 2) + smallNumbers.length;
      
      // Max 30 points. Require a metrics weight of ~15 for perfect score.
      let metricScore = Math.min(30, metricsWeight * 2); 
      
      totalScore += metricScore * (30/30) * 10; // 30% weight
      
      breakdowns.push({
        name: 'Quantifiable Metrics',
        score: Math.round((metricScore / 30) * 100),
        feedback: metricScore >= 24 
          ? `Strong use of numbers! Found ~${percentages.length + currencies.length + smallNumbers.length} quantifiable metrics.` 
          : 'Try to add more numbers, percentages, or dollar amounts to prove your impact.'
      });

      // 4. Action Verbs (25 points max)
      const commonActionVerbs = [
        'managed', 'developed', 'led', 'created', 'improved', 'increased', 
        'achieved', 'delivered', 'designed', 'implemented', 'orchestrated', 
        'launched', 'optimized', 'spearheaded', 'collaborated', 'reduced',
        'negotiated', 'streamlined', 'transformed', 'executed', 'resolved',
        'coordinated', 'facilitated', 'maximized', 'pioneered', 'directed'
      ];
      
      const foundVerbs = commonActionVerbs.filter(verb => normalizedResume.includes(verb));
      
      // Need 12 unique strong action verbs for a perfect score (25 pts)
      let verbScore = Math.min(25, Math.round((foundVerbs.length / 12) * 25));
      
      totalScore += verbScore * (25/25) * 10; // 25% weight
      
      breakdowns.push({
        name: 'Action Verbs',
        score: Math.round((verbScore / 25) * 100),
        feedback: verbScore >= 20 
          ? `Excellent. Found ${foundVerbs.length} strong action verbs.` 
          : `Found ${foundVerbs.length} strong action verbs. Use more punchy verbs (e.g. Developed, Managed) to start bullet points.`
      });

      // 5. Structure & Formatting (15 points max)
      let structScore = 0;
      const missingSections = [];
      
      if (normalizedResume.includes('experience') || normalizedResume.includes('work history')) structScore += 5;
      else missingSections.push('Experience');
      
      if (normalizedResume.includes('education')) structScore += 5;
      else missingSections.push('Education');
      
      if (normalizedResume.includes('skills')) structScore += 5;
      else missingSections.push('Skills');
      
      totalScore += structScore * (15/15) * 10; // 15% weight
      
      breakdowns.push({
        name: 'Standard Sections',
        score: Math.round((structScore / 15) * 100),
        feedback: missingSections.length === 0 
          ? 'Standard resume sections detected.' 
          : `Ensure you clearly label missing sections: ${missingSections.join(', ')}.`
      });

      setScore(Math.round(totalScore / 10)); // Normalize out of 100
      setSectionBreakdown(breakdowns);

      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  return (
    <div className="ats-checker-page">
      <header className="page-header">
        <h2>General Resume Health Scanner</h2>
        <p>Check if your resume follows industry best practices to pass ATS filters and impress recruiters.</p>
      </header>

      {!showResults && !isAnalyzing ? (
        <form onSubmit={handleAnalyze} className="ats-inputs-container glassmorphism" style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          {/* PDF Upload Section */}
          <div className="ats-input-pane" style={{ width: '100%' }}>
            <label>Upload Your Resume (PDF)</label>
            <div className={`pdf-upload-dropzone ${resumeText ? 'has-file' : ''}`}>
              <input 
                type="file" 
                accept=".pdf,application/pdf" 
                onChange={handleFileChange} 
                className="pdf-file-input"
                id="pdf-upload"
              />
              <label htmlFor="pdf-upload" className="pdf-upload-label">
                {isExtracting ? (
                  <>
                    <Loader2 className="spinner" size={32} />
                    <span>Extracting text from PDF...</span>
                  </>
                ) : fileName ? (
                  <>
                    <FileTextIcon size={32} className="success-icon" />
                    <span className="file-name-text">{fileName}</span>
                    <span className="upload-hint">Click to replace file</span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={32} />
                    <span>Click to upload PDF or drag and drop</span>
                    <span className="upload-hint">We will analyze it against industry standards</span>
                    <span className="upload-hint" style={{ color: 'var(--danger-color)', marginTop: '4px', fontSize: '0.8rem' }}>Max file size: 2MB</span>
                  </>
                )}
              </label>
            </div>
            
            {hasReachedLimit && (
              <div className="upload-error-box">
                <AlertTriangle size={16} />
                <span>You have reached your free scan limit. Please log in to scan another resume.</span>
                <button type="button" onClick={() => navigate('/auth')} className="inline-login-btn">
                  Log in now
                </button>
              </div>
            )}

            {uploadError && !hasReachedLimit && (
              <div className="upload-error-box">
                <AlertTriangle size={16} />
                <span>{uploadError}</span>
              </div>
            )}
            
          </div>

          <div className="ats-submit-wrapper" style={{ width: '100%', marginTop: '1rem' }}>
            <button 
              type="submit" 
              className="glow-btn analyze-btn"
              disabled={!resumeText.trim() || hasReachedLimit}
              style={{ width: '100%', padding: '16px' }}
            >
              <BarChart2 size={18} /> Analyze Resume Health
            </button>
          </div>
        </form>
      ) : null}

      {isAnalyzing && (
        <div className="ats-scanning-overlay glassmorphism">
          <Loader2 className="spinner loading-icon" size={48} />
          <h3>Scanning Resume</h3>
          <p>Analyzing word count, action verbs, quantifiable metrics, and structure...</p>
        </div>
      )}

      {showResults && (
        <div className="ats-results-container">
          <button className="back-btn no-print" onClick={() => { setShowResults(false); setResumeText(''); setFileName(''); }}>
            Scan Another Resume
          </button>

          <div className="results-grid">
            <div className="results-left-col" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Radial score card */}
              <div className="score-summary-card glassmorphism">
                <h3>Overall Resume Health</h3>
                <div className="radial-progress-container">
                  <svg viewBox="0 0 100 100" className="radial-svg">
                    <circle cx="50" cy="50" r="40" className="circle-bg" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      className="circle-progress"
                      style={{ strokeDashoffset: 251.2 - (251.2 * score) / 100 }}
                    />
                  </svg>
                  <div className="circle-text-overlay">{score}%</div>
                </div>

                <div className="score-verdict">
                  {score >= 80 ? (
                    <p className="success-txt"><CheckCircle2 size={16} /> Great Resume!</p>
                  ) : score >= 60 ? (
                    <p className="warning-txt"><AlertTriangle size={16} /> Needs Improvement</p>
                  ) : (
                    <p className="danger-txt"><AlertOctagon size={16} /> Critical Issues Found</p>
                  )}
                  <span>A score of 80%+ indicates a strong, well-formatted resume.</span>
                </div>
              </div>
              
              {/* Resume Builder CTA */}
              <div className="ats-cta-card glassmorphism" style={{ padding: '24px', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>Make it ATS-Friendly</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
                  Use our templates that are guaranteed to pass Applicant Tracking Systems.
                </p>
                <button 
                  className="glow-btn" 
                  style={{ width: '100%', padding: '12px' }} 
                  onClick={() => {
                    navigate('/');
                    setTimeout(() => {
                      const el = document.getElementById('templates');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                >
                  Go to Resume Builder
                </button>
              </div>
            </div>

            {/* Section breakdowns */}
            <div className="section-breakdowns-card glassmorphism" style={{ padding: '32px' }}>
              <h3 style={{ marginBottom: '24px', fontSize: '18px', fontWeight: '700' }}>Detailed Health Breakdown</h3>
              <div className="breakdown-list">
                {sectionBreakdown.map((sec, idx) => {
                  // Determine if we should blur this section (if score < 100 and user is not pro)
                  const isLocked = sec.score < 100 && (!user || !user.isPro);

                  return (
                    <div className="breakdown-item" key={idx}>
                      <div className="breakdown-item-header">
                        <h4>{sec.name}</h4>
                        <span className={`breakdown-score-label ${sec.score >= 80 ? 'green' : sec.score >= 50 ? 'yellow' : 'red'}`}>
                          {sec.score}/100
                        </span>
                      </div>
                      <div className="progress-bar-track">
                        <div 
                          className={`progress-bar-fill ${sec.score >= 80 ? 'green' : sec.score >= 50 ? 'yellow' : 'red'}`}
                          style={{ width: `${sec.score}%` }}
                        />
                      </div>
                      
                      <div className={`breakdown-feedback-container ${isLocked ? 'locked-feedback' : ''}`}>
                        <p className={`breakdown-feedback ${isLocked ? 'blurred-text' : ''}`}>
                          {sec.feedback}
                        </p>
                        
                        {isLocked && (
                          <div className="locked-overlay">
                            <Lock size={16} className="lock-icon" />
                            <p>Detailed feedback is locked</p>
                            <button className="unlock-btn" onClick={() => navigate('/pricing')}>
                              Unlock Full Report
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
