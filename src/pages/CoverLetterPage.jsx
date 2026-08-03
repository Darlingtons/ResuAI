import React, { useState } from 'react';
import { Sparkles, Loader2, Copy, Download, Check, File, Briefcase, Landmark, RefreshCw, UploadCloud, FileText as FileTextIcon, ArrowRight, ArrowLeft } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import './CoverLetterPage.css';

// Configure PDF.js worker for Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

export const CoverLetterPage = () => {
  // Wizard Steps state: 1 = CV Upload, 2 = Job Details, 3 = Tone & Style, 4 = Preview/Output
  const [activeStep, setActiveStep] = useState(1);

  // Step 1: CV Upload States
  const [fileName, setFileName] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Step 2: Job Details States
  const [jobTitle, setJobTitle] = useState('');
  const [selectedJobTitle, setSelectedJobTitle] = useState('');
  const [customJobTitle, setCustomJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jdValidationError, setJdValidationError] = useState('');

  // Step 3: Style Settings States
  const [experienceLevel, setExperienceLevel] = useState('Mid-Level');
  const [tone, setTone] = useState('Professional');
  const [customFocus, setCustomFocus] = useState('');

  // Step 4: Output States
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [copied, setCopied] = useState(false);
  const [matchedSkills, setMatchedSkills] = useState([]);

  // Quick Demo Presets
  const presets = [
    {
      title: "Frontend Engineer",
      company: "Stripe",
      jd: "Looking for an engineer experienced in building user-centric interfaces. Strong experience in React, TypeScript, CSS, and API integrations required.",
      level: "Senior",
      tone: "Confident",
      skills: "React, TypeScript, CSS Grid, Stripe API"
    },
    {
      title: "Product Designer",
      company: "Airbnb",
      jd: "Needs an experienced visual designer to craft next-generation booking flows. Proficient in Figma, UX Research, and building component design systems.",
      level: "Mid-Level",
      tone: "Creative",
      skills: "Figma, UX Research, Design Systems"
    }
  ];

  const handleApplyPreset = (preset) => {
    // Fill in mock resume text to simulate having uploaded a resume
    setResumeText("John Doe. Software Developer with expertise in React, TypeScript, Node.js, Next.js, CSS, Figma, SQL, and database optimization. 3+ years experience building web applications and collaborating in product design sprints.");
    setFileName("sample_resume_johndoe.pdf");
    
    // Fill in job details
    const standardTitles = ["Frontend Engineer", "Backend Developer", "Full Stack Developer", "Product Designer", "Data Scientist", "Product Manager"];
    if (standardTitles.includes(preset.title)) {
      setSelectedJobTitle(preset.title);
    } else {
      setSelectedJobTitle('Other');
      setCustomJobTitle(preset.title);
    }
    setJobTitle(preset.title);
    setCompanyName(preset.company);
    setJobDescription(preset.jd);
    setExperienceLevel(preset.level);
    setTone(preset.tone);
    setCustomFocus(preset.skills);
    setJdValidationError('');
    
    // Auto advance to Step 3 for quick-flow
    setActiveStep(3);
  };

  const handleNextStep2 = () => {
    const jdLower = jobDescription.toLowerCase();
    const jdKeywords = [
      'skills', 'experience', 'role', 'team', 'responsibilities', 'requirements', 'develop', 'design', 
      'manage', 'build', 'create', 'support', 'qualification', 'candidate', 'proficient', 'knowledge', 
      'ability', 'work', 'technology', 'react', 'node', 'python', 'java', 'sql', 'css', 'html', 'figma', 
      'ui', 'ux', 'database', 'cloud', 'aws', 'software', 'engineer', 'developer', 'designer', 'manager'
    ];
    
    const matchCount = jdKeywords.filter(keyword => jdLower.includes(keyword)).length;
    
    if (jobDescription.trim().length < 30 || matchCount < 2) {
      setJdValidationError('This text does not appear to be a valid job description. Please provide a description describing the role responsibilities or required technical skills.');
      return;
    }
    
    setJdValidationError('');
    setActiveStep(3);
  };

  // PDF Text Extraction Logic
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
          // Automatically advance to Step 2 upon successful upload
          setTimeout(() => setActiveStep(2), 600);
        }
      }
    } catch (error) {
      console.error('Error extracting PDF text:', error);
      setUploadError('Failed to read PDF. Please ensure it is a valid text-based PDF under 2MB.');
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

  const handleGenerate = (e) => {
    if (e) e.preventDefault();
    setIsGenerating(true);
    setActiveStep(4);

    // Mock AI text generation & skill matching
    setTimeout(() => {
      // Simple word match between CV and JD to show matching capability
      const resumeWords = resumeText.toLowerCase().split(/[\s,]+/);
      const jdWords = jobDescription.toLowerCase().split(/[\s,]+/);
      
      const skillKeywords = ['react', 'typescript', 'node.js', 'css', 'figma', 'sql', 'next.js', 'aws', 'docker', 'python'];
      const matched = skillKeywords.filter(skill => 
        resumeWords.includes(skill) && jdWords.includes(skill)
      );
      
      setMatchedSkills(matched.length > 0 ? matched : ['System Design', 'Communication', 'Collaborative Development']);

      const date = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
      
      let openingParagraph = "";
      let midParagraph = "";
      let closingParagraph = "";

      const primarySkills = matched.length > 0 ? matched.slice(0, 3).join(', ') : (customFocus || 'software development');

      if (tone === 'Enthusiastic') {
        openingParagraph = `I am absolutely thrilled to submit my application for the ${jobTitle} position at ${companyName}. As an admirer of your company's culture and product ecosystem, I was excited to see this opening. With my background as a ${experienceLevel} professional and my hands-on experience in ${primarySkills}, I am eager to bring my passion and engineering drive directly to your team.`;
        midParagraph = `In reviewing your job specifications, I noticed a strong emphasis on scaling user-centric products. In my previous work, I leveraged skills in ${primarySkills} to design responsive web interfaces and optimize server-side architectures. I thrive in collaborative environments and love solving complex, open-ended problems that directly impact the customer journey.`;
        closingParagraph = `I would love the opportunity to share how my background and alignment with ${companyName}'s roadmap can deliver value. Thank you so much for your time, consideration, and the opportunity to apply!`;
      } else if (tone === 'Creative') {
        openingParagraph = `Every successful team needs builders who can bridge the gap between abstract design and technical execution. It is with this mindset that I am applying for the ${jobTitle} role at ${companyName}. Bringing a ${experienceLevel} toolkit enriched with expertise in ${primarySkills}, I am excited to help craft the next chapter of your digital experiences.`;
        midParagraph = `I view code as an art form. Over the course of my career, I have dedicated myself to creating fluid interactions and robust database structures. I enjoy experimenting with modern frameworks and solving complex problems that require out-of-the-box thinking. Joining a forward-looking product team like ${companyName} feels like the perfect environment to execute these goals.`;
        closingParagraph = `I would welcome a conversation to discuss how my creative approach to software development can contribute to the team. Thank you for reviewing my profile!`;
      } else if (tone === 'Confident') {
        openingParagraph = `I am writing to express my interest in the ${jobTitle} position at ${companyName}. Based on my track record as a ${experienceLevel} developer and my expertise in ${primarySkills}, I am confident that I can step into this role and deliver measurable results from day one.`;
        midParagraph = `Throughout my career, I have focused on building high-performance systems and refining clean developer workflows. I have successfully led engineering milestones, collaborated across functional teams, and shipped scalable applications. I admire ${companyName}'s market leadership and am excited to bring my technical standard of excellence to your products.`;
        closingParagraph = `I look forward to discussing how my experience can support ${companyName}'s immediate roadmap. Thank you for your time and consideration.`;
      } else { // Professional (Default)
        openingParagraph = `I am writing to express my strong interest in the ${jobTitle} position at ${companyName}. With a solid foundation in software development and specialized expertise in ${primarySkills}, I am confident in my ability to make an immediate, positive impact on your engineering department as a ${experienceLevel} developer.`;
        midParagraph = `In my previous role, I specialized in architecting responsive web applications and designing robust backend frameworks. I thrive in collaborative environments where I can leverage my problem-solving skills to build scalable, high-performance software. What excites me most about ${companyName} is your dedication to engineering excellence and user-centric designs.`;
        closingParagraph = `I would welcome the opportunity to discuss my qualifications further in an interview. Thank you for your time, consideration, and review of my application documents.`;
      }

      const letter = `John Doe
123 Tech Way, San Francisco, CA 94107
(555) 019-2831 | john.doe@email.com

${date}

Hiring Manager
${companyName}

Subject: Application for ${jobTitle} Position

Dear Hiring Manager,

${openingParagraph}

${midParagraph}

${closingParagraph}

Sincerely,

John Doe`;

      setGeneratedLetter(letter);
      setIsGenerating(false);
    }, 1800);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printContent = document.getElementById('letter-print-content')?.innerHTML || '';
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Cover Letter - ${jobTitle} at ${companyName}</title>
          <style>
            body {
              font-family: 'Georgia', serif;
              line-height: 1.6;
              padding: 40px;
              color: #1a1a1a;
              max-width: 800px;
              margin: 0 auto;
              white-space: pre-line;
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="cover-letter-page">
      <header className="page-header">
        <span className="pricing-tag">AI Assistant</span>
        <h2>Tailored Cover Letter Builder</h2>
        <p>Upload your CV, specify company needs, and let the AI compile a customized, highly relevant cover letter.</p>
      </header>

      {/* Preset Pills */}
      <div className="presets-container no-print">
        <span className="presets-label"><RefreshCw size={14} /> Quick Demo Presets:</span>
        <div className="preset-pills">
          {presets.map((preset, index) => (
            <button
              key={index}
              className="preset-pill-btn"
              onClick={() => handleApplyPreset(preset)}
            >
              {preset.title} @ {preset.company}
            </button>
          ))}
        </div>
      </div>

      {/* Wizard Progress Steps */}
      <div className="wizard-progress-bar no-print">
        {[
          { step: 1, label: "Upload CV" },
          { step: 2, label: "Job Essentials" },
          { step: 3, label: "Style & Focus" },
          { step: 4, label: "Preview & Print" }
        ].map((item) => (
          <div 
            key={item.step} 
            className={`progress-step-item ${activeStep === item.step ? 'active' : ''} ${activeStep > item.step ? 'completed' : ''}`}
            onClick={() => activeStep > item.step && setActiveStep(item.step)}
          >
            <div className="step-circle">{activeStep > item.step ? "✓" : item.step}</div>
            <span className="step-label">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="cover-letter-container">
        {/* WIZARD PANEL (LEFT) */}
        <section className="form-panel glassmorphism no-print">
          
          {/* STEP 1: UPLOAD CV */}
          {activeStep === 1 && (
            <div className="wizard-step-content animate-fade-in">
              <h3>Upload Your Resume/CV</h3>
              <p className="panel-desc">We will parse the text of your CV to extract your experience and matched skills.</p>
              
              <div className="upload-container-letter">
                <label className="drag-drop-zone-letter">
                  <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={handleFileChange} 
                    className="file-hidden-input"
                  />
                  <UploadCloud size={40} className="upload-icon" />
                  <span>{isExtracting ? 'Extracting Text...' : 'Click to Upload Resume PDF'}</span>
                  <span className="file-limits">PDF only (Max 2MB)</span>
                </label>
              </div>

              {uploadError && <p className="error-alert-letter">{uploadError}</p>}
              
              {fileName && (
                <div className="upload-success-badge">
                  <FileTextIcon size={16} />
                  <span className="success-filename">{fileName}</span>
                  <Check size={16} className="green" />
                </div>
              )}

              <div className="wizard-actions">
                <button 
                  type="button" 
                  className="glow-btn step-next-btn"
                  disabled={!resumeText}
                  onClick={() => setActiveStep(2)}
                >
                  Next <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: JOB DETAILS */}
          {activeStep === 2 && (
            <div className="wizard-step-content animate-fade-in">
              <h3>Job Details & Essentials</h3>
              <p className="panel-desc">Enter details about the company and their key candidate requirements.</p>

              <div className="letter-form">
                <div className="form-group">
                  <label htmlFor="job-t">Target Job Title</label>
                  <div className="input-wrapper">
                    <Briefcase size={16} className="input-icon" />
                    <select 
                      id="job-t"
                      className="standalone-input dropdown-select"
                      value={selectedJobTitle}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedJobTitle(val);
                        if (val !== 'Other') {
                          setJobTitle(val);
                        } else {
                          setJobTitle(customJobTitle);
                        }
                      }}
                      required
                    >
                      <option value="" disabled>-- Select Job Title --</option>
                      <option value="Frontend Engineer">Frontend Engineer</option>
                      <option value="Backend Developer">Backend Developer</option>
                      <option value="Full Stack Developer">Full Stack Developer</option>
                      <option value="Product Designer">Product Designer</option>
                      <option value="Data Scientist">Data Scientist</option>
                      <option value="Product Manager">Product Manager</option>
                      <option value="Other">Other (Type custom title)</option>
                    </select>
                  </div>
                </div>

                {selectedJobTitle === 'Other' && (
                  <div className="form-group animate-fade-in">
                    <label htmlFor="custom-job-t">Custom Job Title</label>
                    <input 
                      type="text" 
                      id="custom-job-t"
                      className="standalone-input"
                      placeholder="e.g. iOS Developer, Devops Lead"
                      value={customJobTitle}
                      onChange={(e) => {
                        setCustomJobTitle(e.target.value);
                        setJobTitle(e.target.value);
                      }}
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="comp-n">Company Name</label>
                  <div className="input-wrapper">
                    <Landmark size={16} className="input-icon" />
                    <input 
                      type="text" 
                      id="comp-n"
                      placeholder="e.g. Stripe"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="job-desc">Essentials / Job Description (What the company needs)</label>
                  <textarea 
                    id="job-desc"
                    className="standalone-input"
                    placeholder="Paste the job description, required skills, or key specifications here..."
                    value={jobDescription}
                    onChange={(e) => {
                      setJobDescription(e.target.value);
                      if (jdValidationError) setJdValidationError('');
                    }}
                    rows={4}
                    required
                  />
                  {jdValidationError && <p className="error-alert-letter">{jdValidationError}</p>}
                </div>

                <div className="wizard-actions">
                  <button 
                    type="button" 
                    className="glow-btn step-next-btn"
                    disabled={!jobTitle.trim() || !companyName.trim() || !jobDescription.trim()}
                    onClick={handleNextStep2}
                  >
                    Next <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: TONE & STYLE */}
          {activeStep === 3 && (
            <div className="wizard-step-content animate-fade-in">
              <h3>Tone & Focus Configuration</h3>
              <p className="panel-desc">Refine the writing tone and focus areas for your cover letter.</p>

              <div className="letter-form">
                <div className="form-group">
                  <label>Experience Level</label>
                  <div className="toggle-segment">
                    {['Entry-Level', 'Mid-Level', 'Senior'].map((level) => (
                      <button
                        key={level}
                        type="button"
                        className={`segment-btn ${experienceLevel === level ? 'active' : ''}`}
                        onClick={() => setExperienceLevel(level)}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Writing Tone</label>
                  <div className="toggle-segment">
                    {['Professional', 'Creative', 'Enthusiastic', 'Confident'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        className={`segment-btn ${tone === t ? 'active' : ''}`}
                        onClick={() => setTone(t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="skills-list">Extra Custom Focus (e.g. key projects/special skills)</label>
                  <input 
                    type="text" 
                    id="skills-list"
                    className="standalone-input"
                    placeholder="e.g. payment platforms, serverless, database queries"
                    value={customFocus}
                    onChange={(e) => setCustomFocus(e.target.value)}
                  />
                </div>

                <div className="wizard-actions">
                  <button 
                    type="button" 
                    className="glow-btn step-next-btn"
                    onClick={handleGenerate}
                  >
                    Next <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: GENERATION DETAILS */}
          {activeStep === 4 && (
            <div className="wizard-step-content animate-fade-in">
              <h3>Letter Compiled Successfully!</h3>
              <p className="panel-desc">We analyzed your CV and aligned it with the job requirements.</p>

              {/* Match Card */}
              <div className="match-card-letter">
                <h4>🎯 Alignment Summary</h4>
                <p>We parsed your CV and matched your profile with the company's needs.</p>
                <div className="match-tags-container">
                  <span className="match-tag-label">Matched Skills:</span>
                  <div className="matched-skills-pills">
                    {matchedSkills.map((skill, index) => (
                      <span key={index} className="skill-match-pill">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>


            </div>
          )}
        </section>

        {/* DOCUMENT PREVIEW PANEL (RIGHT) */}
        <section className="preview-panel glassmorphism">
          <div className="preview-header no-print">
            <h3>Document Preview</h3>
            {generatedLetter && activeStep === 4 && (
              <div className="action-buttons">
                <button className="icon-action-btn" onClick={handleCopy} title="Copy to Clipboard">
                  {copied ? <Check size={16} className="green" /> : <Copy size={16} />}
                </button>
                <button className="icon-action-btn" onClick={handlePrint} title="Download/Print PDF">
                  <Download size={16} />
                </button>
              </div>
            )}
          </div>

          {isGenerating ? (
            <div className="generating-placeholder animate-pulse">
              <Loader2 className="spinner loading-icon" size={36} />
              <p>AI is matching your CV qualifications with the target job essentials and writing custom paragraphs...</p>
            </div>
          ) : generatedLetter && activeStep === 4 ? (
            <div className="letter-editor-container">
              {/* Premium A4 Paper view */}
              <div className="a4-document-paper">
                <textarea 
                  className="letter-textarea-paper"
                  value={generatedLetter}
                  onChange={(e) => setGeneratedLetter(e.target.value)}
                  rows={22}
                />
              </div>
              <div id="letter-print-content" className="hidden-print-div">
                {generatedLetter}
              </div>
            </div>
          ) : (
            <div className="empty-placeholder">
              <File size={48} className="empty-icon" />
              <h4>A4 Print Layout</h4>
              <p>Complete the wizard on the left (Upload CV &rarr; Essentials &rarr; Compile) to display your live printed cover letter layout here.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

