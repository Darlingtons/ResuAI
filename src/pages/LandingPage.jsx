import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, CheckCircle2, ChevronRight, FileText, ArrowRight, Star, ArrowDown, Check } from 'lucide-react';
import { Dialog } from '../components/Dialog';
import { ResumeTemplateRenderer } from '../templates/ResumeTemplateRenderer';
import './LandingPage.css';

const mockPreviewData = {
  personalInfo: {
    name: 'Sarah Jenkins',
    title: 'Lead Full-Stack Engineer',
    email: 'sarah.jenkins@dev.com',
    phone: '+1 (555) 489-0192',
    website: 'sarahj.dev',
    github: 'github.com/sarahj',
    linkedin: 'linkedin.com/in/sarahj',
    location: 'San Francisco, CA',
    summary: 'Passionate and results-driven Software Engineer with 8+ years of expertise designing secure, scalable web applications. Proven track record of leading agile engineering teams, optimizing microservices performance, and deploying cloud infrastructures in AWS.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
  },
  experience: [
    {
      id: 'mock_exp_1',
      company: 'TechCorp Solutions',
      position: 'Lead Software Engineer',
      startDate: '2022-03-01',
      endDate: '',
      current: true,
      description: '• Led migration of legacy React architecture to Next.js, boosting core web vitals and startup performance by 45%.\n• Designed and deployed scalable Node.js microservices handling 10k+ concurrent requests.\n• Mentored 6 junior engineers and established automated CI/CD testing workflows, cutting delivery cycles by 30%.',
      location: 'San Francisco, CA'
    },
    {
      id: 'mock_exp_2',
      company: 'DataStream Systems',
      position: 'Senior Frontend Developer',
      startDate: '2019-06-01',
      endDate: '2022-02-28',
      current: false,
      description: '• Built state-of-the-art interactive charts and dashboards using React, Redux, and D3.js.\n• Optimized database query speeds by 35% through indexing and Redis caching integrations.\n• Coordinated closely with product designers to implement a custom unified design system.',
      location: 'Boston, MA'
    }
  ],
  education: [
    {
      id: 'mock_edu_1',
      institution: 'Stanford University',
      degree: 'M.S. in Computer Science',
      fieldOfStudy: 'Distributed Systems & Web Tech',
      startDate: '2017-09-01',
      endDate: '2019-05-30',
      current: false,
      gpa: '3.9 / 4.0',
      description: 'Focus areas: High-performance computing, security protocols, and advanced database engineering.',
      location: 'Stanford, CA'
    }
  ],
  skills: [
    { id: 'mock_sk_1', name: 'React / Next.js', level: 'Expert' },
    { id: 'mock_sk_2', name: 'Node.js / Express', level: 'Expert' },
    { id: 'mock_sk_3', name: 'TypeScript / Go', level: 'Expert' },
    { id: 'mock_sk_4', name: 'Docker / Kubernetes', level: 'Intermediate' },
    { id: 'mock_sk_5', name: 'AWS / CI/CD Pipelines', level: 'Expert' }
  ],
  projects: [
    {
      id: 'mock_proj_1',
      name: 'ResuAI - Intelligent Builder Platform',
      description: 'Developed an automated resume builder and ATS optimizer featuring side-by-side printing simulations and cover letter drafts.',
      technologies: 'React, Vite, CSS Variables, LocalStorage',
      link: 'github.com/sarahj/resuai',
      role: 'Sole Creator',
      startDate: '2023-01-01',
      endDate: '2023-08-01'
    }
  ],
  certifications: [],
  achievements: [
    {
      id: 'mock_ach_1',
      title: 'First Place Winner - SF Global Hackathon 2025',
      date: 'Oct 2025',
      description: 'Competed with 200+ teams to design and build an AI-driven disaster response system with real-time geolocation support.'
    },
    {
      id: 'mock_ach_2',
      title: 'Outstanding Technical Leadership Award',
      date: 'Dec 2024',
      description: 'Awarded by TechCorp Solutions for guiding the zero-downtime database overhaul and system refactoring.'
    }
  ],
  hobbies: [
    { id: 'mock_hob_1', name: 'Open Source Development' },
    { id: 'mock_hob_2', name: 'Landscape Photography' },
    { id: 'mock_hob_3', name: 'Marathon Running' }
  ]
};

export const LandingPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  
  // Interactive Typing Demo States
  const [demoName, setDemoName] = useState('');
  const [demoTitle, setDemoTitle] = useState('');
  const [demoSummary, setDemoSummary] = useState('');
  const [demoStep, setDemoStep] = useState(0);

  // Typing effect simulation
  useEffect(() => {
    const steps = [
      { text: 'Sarah Jenkins', setter: setDemoName, delay: 100 },
      { text: 'Senior Software Engineer', setter: setDemoTitle, delay: 120 },
      { text: 'Passionate full-stack developer with 8+ years of experience building secure React & Node.js microservices.', setter: setDemoSummary, delay: 40 },
    ];

    let currentStepIndex = 0;
    let currentCharIndex = 0;
    let currentText = '';
    let interval;

    const type = () => {
      const step = steps[currentStepIndex];
      if (currentCharIndex < step.text.length) {
        currentText += step.text[currentCharIndex];
        step.setter(currentText);
        currentCharIndex++;
        interval = setTimeout(type, step.delay);
      } else {
        // Step completed
        currentStepIndex++;
        if (currentStepIndex < steps.length) {
          currentCharIndex = 0;
          currentText = '';
          setDemoStep(currentStepIndex);
          interval = setTimeout(type, 1000); // pause between steps
        } else {
          // Loop restart after 6 seconds
          interval = setTimeout(() => {
            setDemoName('');
            setDemoTitle('');
            setDemoSummary('');
            setDemoStep(0);
            currentStepIndex = 0;
            currentCharIndex = 0;
            currentText = '';
            type();
          }, 6000);
        }
      }
    };

    interval = setTimeout(type, 1000);
    return () => clearTimeout(interval);
  }, []);

  const templates = [
    { name: 'Classic', value: 'classic', desc: 'Elegant traditional format for banking/finance.', color: '#334155' },
    { name: 'Modern Sidebar', value: 'modern', desc: 'Perfect balanced two-column format.', color: '#6366f1' },
    { name: 'Minimalist', value: 'minimal', desc: 'Tons of clean whitespace and styling.', color: '#10b981' },
    { name: 'Creative', value: 'creative', desc: 'Vibrant formats for designers and creators.', color: '#ec4899' },
    { name: 'Technical Dev', value: 'technical', desc: 'Markdown styling prioritizing code repos.', color: '#0b0f19' },
    { name: 'Fresher Basic', value: 'fresher', desc: 'Tailored for students and entry-level.', color: '#f59e0b' },
  ];

  const testimonials = [
    {
      quote: "ResuAI helped me update my resume in under 10 minutes. The real-time ATS scoring is a cheat code. Got a call from Google the next week!",
      author: "Alex Rivera",
      role: "Frontend Architect",
      stars: 5,
    },
    {
      quote: "The cover letter generator reads the job description and customizes a letter that actually sounds like me. Saved me hours of stress.",
      author: "Sophia Chen",
      role: "Product Manager",
      stars: 5,
    },
  ];

  const faqs = [
    {
      q: "what is a cover letter",
      a: "A cover letter is a one-page professional document submitted alongside your resume during a job application. Its purpose is to introduce you to the hiring manager, outline your career motivation, expand on key achievements from your resume, and explain why you are the best fit for the specific job role."
    },
    {
      q: "how to write a cover letter",
      a: "To write an effective cover letter, start with a professional header containing your contact details and the recipient's info. Address the hiring manager by name, open with a strong introduction highlighting your interest, write one or two body paragraphs showing relevant achievements matched to the job description, and close with a call-to-action requesting an interview."
    },
    {
      q: "how to build a resume",
      a: "To build a professional resume, start by choosing a clean, ATS-compliant online resume template. Fill in your contact info, write a concise professional summary, detail your work experience in reverse chronological order using action verbs and metrics, outline your education and certifications, and list your top technical and soft skills."
    },
    {
      q: "Is ResuAI free to use?",
      a: "Yes, ResuAI is free to use. You can build, customize, and download standard resumes using our Classic template layout completely free of charge. Premium templates, custom color/font configuration, and real-time AI optimizations are available through our Pro plan."
    },
    {
      q: "How does the ATS Checker compute scores?",
      a: "Our resume ATS check system scans your CV, parses the text structure, and cross-references it with your target job description. It rates your alignment score based on design format, chronological completeness, and matches of critical keywords and skills that applicant tracking systems look for."
    },
    {
      q: "Can I download my resume as a PDF?",
      a: "Yes, you can easily download your resume as a PDF. Our online resume builder uses professional A4 print styling. When you trigger the download, it formats the design into a clean vector print format which you can save as a PDF directly from your browser's print dialog."
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} className="hero-badge-icon" />
            <span>AI-Driven Resume Creation Platform</span>
          </div>
          <h1>
            Land Your Dream Job With <span className="gradient-text">ResuAI</span>
          </h1>
          <p className="hero-subtitle">
            Create professional, ATS-optimized resumes and personalized cover letters in minutes. Guided by AI. Built for developers and modern professionals.
          </p>
          <div className="hero-ctas">
            <Link to="/auth?mode=signup" className="glow-btn hero-cta-btn">
              Create My Resume <ArrowRight size={18} />
            </Link>
            <a href="#demo" className="secondary-cta-btn">
              Watch Live Demo <ArrowDown size={16} />
            </a>
          </div>
          <div className="hero-features-list">
            <div className="h-feat-item"><CheckCircle2 size={16} className="h-feat-icon" /> <span>ATS Friendly Layouts</span></div>
            <div className="h-feat-item"><CheckCircle2 size={16} className="h-feat-icon" /> <span>Instant PDF Export</span></div>
            <div className="h-feat-item"><CheckCircle2 size={16} className="h-feat-icon" /> <span>AI Content Optimization</span></div>
          </div>
        </div>
      </section>

      {/* Live Demo Typing Preview */}
      <section className="demo-section" id="demo">
        <div className="demo-container">
          <div className="demo-title-bar">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
            <span className="demo-url">resuai.app/builder</span>
          </div>
          <div className="demo-workspace">
            {/* Input Form Column */}
            <div className="demo-form glassmorphism">
              <h3>Form Input</h3>
              <div className="demo-input-group">
                <label>Full Name</label>
                <div className={`demo-input ${demoStep === 0 ? 'focused' : ''}`}>
                  {demoName || <span className="placeholder">e.g. John Doe</span>}
                  <span className="caret"></span>
                </div>
              </div>
              <div className="demo-input-group">
                <label>Professional Title</label>
                <div className={`demo-input ${demoStep === 1 ? 'focused' : ''}`}>
                  {demoTitle || <span className="placeholder">e.g. Developer</span>}
                  {demoStep >= 1 && <span className="caret"></span>}
                </div>
              </div>
              <div className="demo-input-group">
                <label>Professional Summary</label>
                <div className={`demo-input text-area ${demoStep === 2 ? 'focused' : ''}`}>
                  {demoSummary || <span className="placeholder">Describe your background...</span>}
                  {demoStep >= 2 && <span className="caret"></span>}
                </div>
              </div>
            </div>

            {/* Live Preview Column */}
            <div className="demo-preview">
              <div className="preview-paper">
                <div className="preview-header" style={{ borderLeft: '4px solid #6366f1' }}>
                  <h2 className="preview-name">{demoName || 'Name'}</h2>
                  <p className="preview-title">{demoTitle || 'Title'}</p>
                </div>
                <div className="preview-body">
                  <div className="preview-section">
                    <h4>Professional Summary</h4>
                    <p className="preview-summary">{demoSummary || 'Summary content...'}</p>
                  </div>
                  <div className="preview-section">
                    <h4>Experience</h4>
                    <div className="preview-job-item">
                      <div className="job-meta">
                        <strong>TechCorp Solutions</strong>
                        <span>2022 - Present</span>
                      </div>
                      <p className="job-role">Software Engineer</p>
                      <ul>
                        <li>Led migration of React architecture, boosting performance by 35%.</li>
                        <li>Implemented dynamic web previews and PDF export structures.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="features-section">
        <div className="section-header">
          <h2>Product Capabilities</h2>
          <p>Everything you need to write professional resumes that beat the screening bots.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card glassmorphism">
            <div className="feat-icon-box"><Sparkles className="feat-icon" /></div>
            <h3>AI Resume Optimizer</h3>
            <p>Stuck on writing achievements? Click the AI button in any section to generate bullet points tailored to your role.</p>
          </div>
          <div className="feature-card glassmorphism">
            <div className="feat-icon-box"><CheckCircle2 className="feat-icon" /></div>
            <h3>Interactive ATS Scorer</h3>
            <p>Scan your resume text against any job posting. Get a score out of 100 with list of missing high-impact keywords.</p>
          </div>
          <div className="feature-card glassmorphism">
            <div className="feat-icon-box"><FileText className="feat-icon" /></div>
            <h3>Cover Letter Generator</h3>
            <p>Generate matching cover letters in seconds by writing your target company name, title, and key expertise points.</p>
          </div>
        </div>
      </section>

      {/* Template Gallery Slider */}
      <section className="templates-section" id="templates">
        <div className="section-header">
          <h2>Resume Designs</h2>
          <p>Switch templates in one click without losing your text content.</p>
        </div>
        <div className="templates-carousel">
          {templates.map((tpl, i) => (
            <div 
              className="template-card glassmorphism" 
              key={i}
              onClick={() => setPreviewTemplate(tpl)}
              style={{ cursor: 'pointer' }}
            >
              <div className="template-thumbnail">
                {tpl.value === 'classic' && (
                  <div className="mini-preview classic-mini">
                    <div className="mini-header-center">
                      <div className="mini-line name"></div>
                      <div className="mini-line sub"></div>
                      <div className="mini-contact-row">
                        <span className="dot"></span><span className="dot"></span><span className="dot"></span>
                      </div>
                    </div>
                    <hr className="mini-divider" />
                    <div className="mini-section" style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div className="mini-line text-long"></div>
                      <div className="mini-line text-short"></div>
                    </div>
                  </div>
                )}
                {tpl.value === 'modern' && (
                  <div className="mini-preview modern-mini">
                    <div className="mini-sidebar" style={{ backgroundColor: tpl.color }}>
                      <div className="mini-circle"></div>
                      <div className="mini-line side-item"></div>
                      <div className="mini-line side-item"></div>
                    </div>
                    <div className="mini-body">
                      <div className="mini-line name"></div>
                      <div className="mini-line sub"></div>
                      <div className="mini-section" style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '6px' }}>
                        <div className="mini-line text-long"></div>
                        <div className="mini-line text-medium"></div>
                      </div>
                    </div>
                  </div>
                )}
                {tpl.value === 'minimal' && (
                  <div className="mini-preview minimal-mini">
                    <div className="mini-header-left">
                      <div className="mini-line name" style={{ backgroundColor: tpl.color }}></div>
                      <div className="mini-line sub"></div>
                    </div>
                    <div className="mini-section" style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '10px', width: '100%' }}>
                      <div className="mini-line text-long"></div>
                      <div className="mini-line text-medium"></div>
                      <div className="mini-line text-short"></div>
                    </div>
                  </div>
                )}
                {tpl.value === 'creative' && (
                  <div className="mini-preview creative-mini">
                    <div className="mini-banner" style={{ backgroundColor: tpl.color }}>
                      <div className="mini-line name"></div>
                      <div className="mini-line sub"></div>
                    </div>
                    <div className="mini-columns">
                      <div className="mini-col-left" style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <div className="mini-line text-long"></div>
                        <div className="mini-line text-medium"></div>
                      </div>
                      <div className="mini-col-right" style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <div className="mini-circle-bar"></div>
                        <div className="mini-circle-bar"></div>
                      </div>
                    </div>
                  </div>
                )}
                {tpl.value === 'technical' && (
                  <div className="mini-preview technical-mini">
                    <div className="mini-header-tech">
                      <span className="code-symbol">&lt;/&gt;</span>
                      <div className="mini-line name"></div>
                    </div>
                    <div className="mini-code-block" style={{ marginTop: '8px' }}>
                      <div><span className="code-kw">const</span> <span className="code-var">skills</span> = [</div>
                      <div className="mini-line skill-item"></div>
                      <div className="mini-line skill-item"></div>
                      <div>];</div>
                    </div>
                  </div>
                )}
                {tpl.value === 'fresher' && (
                  <div className="mini-preview fresher-mini">
                    <div className="mini-header-center">
                      <div className="mini-line name"></div>
                      <div className="mini-line sub"></div>
                    </div>
                    <div className="mini-section" style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '6px' }}>
                      <span className="fresher-badge" style={{ backgroundColor: `${tpl.color}15`, color: tpl.color }}>NEW GRAD</span>
                      <div className="mini-line text-long"></div>
                      <div className="mini-line text-medium"></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="template-info">
                <h3>{tpl.name}</h3>
                <p>{tpl.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2>What Users Say</h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, idx) => (
            <div className="testimonial-card glassmorphism" key={idx}>
              <div className="stars-row">
                {[...Array(t.stars)].map((_, s) => (
                  <Star key={s} size={16} className="star-filled" />
                ))}
              </div>
              <p className="testimonial-quote">"{t.quote}"</p>
              <div className="testimonial-author">
                <strong>{t.author}</strong>
                <span>{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Comparison Teaser */}
      <section className="pricing-teaser">
        <div className="pricing-box glassmorphism">
          <div className="pricing-teaser-header">
            <h3>Get Professional Access</h3>
            <p>Upgrade to Pro to unlock all templates, custom coloring, and unlimited AI assistant credits.</p>
          </div>
          <div className="pricing-options">
            <div className="pricing-teaser-card">
              <h4>Free Plan</h4>
              <p className="price">$0</p>
              <ul>
                <li><Check size={14} /> Classic Template</li>
                <li><Check size={14} /> Manual Resume Editing</li>
                <li><Check size={14} /> Basic Print Exports</li>
              </ul>
            </div>
            <div className="pricing-teaser-card pro">
              <div className="card-badge">RECOMMENDED</div>
              <h4>Pro Plan</h4>
              <p className="price">$2 <span>/ mo</span></p>
              <ul>
                <li><Check size={14} /> All 6 Premium Templates</li>
                <li><Check size={14} /> Live AI Bullet Generator</li>
                <li><Check size={14} /> Dynamic ATS Match Optimizer</li>
                <li><Check size={14} /> Custom Color & Font Selectors</li>
              </ul>
            </div>
          </div>
          <div className="teaser-cta">
            <Link to="/pricing" className="glow-btn pricing-cta-btn">
              View Detailed Pricing Plans
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Accordions */}
      <section className="faq-section">
        <div className="section-header">
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="faq-list">
          {faqs.map((f, idx) => (
            <div 
              className={`faq-item glassmorphism ${activeFaq === idx ? 'open' : ''}`} 
              key={idx}
              onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
            >
              <div className="faq-question">
                <span>{f.q}</span>
                <ChevronRight size={18} className="faq-arrow" />
              </div>
              {activeFaq === idx && <p className="faq-answer">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* SEO ARTICLE SECTION */}
      <section className="seo-article-section">
        <div className="seo-article-container glassmorphism" style={{ padding: '40px', borderRadius: 'var(--radius-lg)' }}>
          <h2>The Ultimate Online Resume Builder for Modern Job Seekers</h2>
          <p>
            In today's highly competitive job market, standing out to recruiters requires more than just listing your work history. You need a fast, reliable, and intelligent <strong>online resume builder</strong> to present your qualifications effectively. ResuAI is designed to be the <strong>best online resume builder</strong>, combining modern design elements with advanced AI features. It functions not only as a state-of-the-art <strong>online resume maker</strong> but also as an integrated career suite.
          </p>

          <h3>Select the Perfect Online Resume Template</h3>
          <p>
            The visual appeal of your CV is a recruiter's first impression. ResuAI offers a curated selection of premium <strong>online resume template</strong> layouts tailored for different industries, including technology, business, design, and entry-level positions. Every <strong>online resume template</strong> in our library is engineered to follow professional typesetting principles, ensuring readability and correct font hierarchy. If you are just starting your career or want to test our editor, you can access our <strong>online resume builder free</strong> tier, which offers classic designs to get you hired without any upfront cost.
          </p>

          <h3>Secure Your Interview with a Built-in ATS Check</h3>
          <p>
            Did you know that over 70% of resumes are filtered out by Applicant Tracking Systems (ATS) before a human recruiter even sees them? That's why ResuAI integrates a comprehensive <strong>resume ats check</strong> directly into the builder. Our tool scans your text, maps it against target job descriptions, and provides an instant <strong>ats check resume</strong> score with specific keyword recommendations. 
          </p>
          <p>
            Using our <strong>ats check</strong> suite, you can run a <strong>free ats check</strong> to highlight missing skills, adjust formatting flaws, and optimize your CV to rank highly. This real-time <strong>ats check resume</strong> system gives you the diagnostic insight needed to bypass automated filters and land your resume in the hands of hiring managers.
          </p>

          <h3>Draft a Tailored Cover Letter in Minutes</h3>
          <p>
            A strong resume is only half the battle. To maximize your callback rate, pairing your application with a customized <strong>cover letter</strong> is essential. ResuAI provides a state-of-the-art AI cover letter generator that analyzes your resume achievements alongside the job description. 
          </p>
          <p>
            You can choose from our professional <strong>cover letter templates</strong> to ensure that your header and style align perfectly with your resume. Each <strong>cover letter template</strong> is built to follow the recommended <strong>cover letter format</strong>, including formal headings, opening hooks, key achievements, and a strong call-to-action. By using our structured <strong>cover letter templates</strong>, you save hours of writing while maintaining a consistent and highly professional design across all application documents.
          </p>

          <h3>Elevate Your Job Search with ResuAI</h3>
          <p>
            Creating a resume is historically a tedious chore, but it does not have to be. By utilizing our <strong>best online resume builder</strong>, you gain access to an intuitive workspace that walks you through compiling your personal details, work history, education, certifications, and projects. As you type, the layout renders dynamically in an A4 paper layout preview, showing you exactly how the final printed PDF will look. Our templates are responsive and respect white-space rules, ensuring your content never overflows awkwardly to a second page.
          </p>
          <p>
            Our <strong>online resume maker</strong> also takes care of margins, line heights, and padding automatically, allowing you to focus purely on writing high-impact bullet points. Combined with a professional <strong>cover letter format</strong>, your application files will look cohesive and polished. Start building today and unlock your potential with our robust <strong>online resume builder free</strong> features, and take control of your career trajectory.
          </p>
        </div>
      </section>

      {/* TEMPLATE PREVIEW DIALOG */}
      <Dialog
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        title={`Template Preview: ${previewTemplate?.name}`}
        size="xl"
        actions={
          <Link to="/auth?mode=signup" className="glow-btn" style={{ padding: '10px 24px' }}>
            Use This Template
          </Link>
        }
      >
        {previewTemplate && (
          <div className="landing-template-preview-box">
            <ResumeTemplateRenderer 
              data={mockPreviewData}
              template={previewTemplate.value}
              color={previewTemplate.color}
              font="Plus Jakarta Sans"
            />
          </div>
        )}
      </Dialog>

      {/* JSON-LD FAQ SEO SCHEMA */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is a cover letter?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "<p>A cover letter is a one-page professional document submitted alongside your resume during a job application. Its purpose is to introduce you to the hiring manager, outline your career motivation, expand on key achievements from your resume, and explain why you are the best fit for the specific job role.</p>"
              }
            },
            {
              "@type": "Question",
              "name": "How to write a cover letter?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "<p>To write an effective cover letter, start with a professional header containing your contact details and the recipient's info. Address the hiring manager by name, open with a strong introduction highlighting your interest, write one or two body paragraphs showing relevant achievements matched to the job description, and close with a call-to-action requesting an interview.</p>"
              }
            },
            {
              "@type": "Question",
              "name": "How to build a resume?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "<p>To build a professional resume, start by choosing a clean, ATS-compliant online resume template. Fill in your contact info, write a concise professional summary, detail your work experience in reverse chronological order using action verbs and metrics, outline your education and certifications, and list your top technical and soft skills.</p>"
              }
            },
            {
              "@type": "Question",
              "name": "Is ResuAI free to use?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "<p>Yes, ResuAI is free to use. You can build, customize, and download standard resumes using our Classic template layout completely free of charge. Premium templates, custom color/font configuration, and real-time AI optimizations are available through our Pro plan.</p>"
              }
            },
            {
              "@type": "Question",
              "name": "How does the ATS Checker compute scores?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "<p>Our resume ATS check system scans your CV, parses the text structure, and cross-references it with your target job description. It rates your alignment score based on design format, chronological completeness, and matches of critical keywords and skills that applicant tracking systems look for.</p>"
              }
            },
            {
              "@type": "Question",
              "name": "Can I download my resume as a PDF?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "<p>Yes, you can easily download your resume as a PDF. Our online resume builder uses professional A4 print styling. When you trigger the download, it formats the design into a clean vector print format which you can save as a PDF directly from your browser's print dialog.</p>"
              }
            }
          ]
        })}
      </script>
    </div>
  );
};
