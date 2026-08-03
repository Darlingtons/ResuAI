import React from 'react';
import './ResumeTemplates.css';

export const ResumeTemplateRenderer = ({
  data,
  template,
  color,
  font,
}) => {
  const { 
    personalInfo = {}, 
    experience = [], 
    education = [], 
    skills = [], 
    projects = [], 
    certifications = [] 
  } = data || {};
  const achievements = data?.achievements || [];
  const hobbies = data?.hobbies || [];

  const serifFonts = ['Georgia', 'Merriweather', 'Playfair Display', 'Lora'];
  const fontStyle = {
    fontFamily: serifFonts.includes(font) ? `"${font}", serif` : `"${font}", sans-serif`,
  };

  const accentColorStyle = {
    color: color,
  };

  const accentBgStyle = {
    backgroundColor: color,
  };

  const borderLeftAccentStyle = {
    borderLeft: `4px solid ${color}`,
  };

  const borderBottomAccentStyle = {
    borderBottom: `2px solid ${color}`,
  };

  // Helper: Format Date Ranges
  const formatDateRange = (item) => {
    if (!item.startDate) return '';
    const start = new Date(item.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
    const end = item.current ? 'Present' : item.endDate ? new Date(item.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : '';
    return `${start} - ${end}`;
  };

  // 1. CLASSIC TEMPLATE
  const renderClassic = () => (
    <div className="template-classic" style={fontStyle}>
      <header className="classic-header">
        <h1 style={accentColorStyle}>{personalInfo.name || 'John Doe'}</h1>
        <p className="classic-subtitle">{personalInfo.title || 'Professional Title'}</p>
        <div className="classic-contact">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
          {personalInfo.github && <span>GitHub: {personalInfo.github}</span>}
          {personalInfo.linkedin && <span>LinkedIn: {personalInfo.linkedin}</span>}
        </div>
      </header>

      {personalInfo.summary && (
        <section className="classic-section">
          <h2 style={accentColorStyle}>Professional Summary</h2>
          <hr style={borderBottomAccentStyle} />
          <p className="classic-summary-text">{personalInfo.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="classic-section">
          <h2 style={accentColorStyle}>Work Experience</h2>
          <hr style={borderBottomAccentStyle} />
          <div className="classic-list">
            {experience.map((exp) => (
              <div key={exp.id} className="classic-item">
                <div className="classic-item-header">
                  <strong>{exp.position} at {exp.company}</strong>
                  <span>{formatDateRange(exp)}</span>
                </div>
                {exp.location && <span className="item-loc">{exp.location}</span>}
                <p className="item-desc">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="classic-section">
          <h2 style={accentColorStyle}>Education</h2>
          <hr style={borderBottomAccentStyle} />
          <div className="classic-list">
            {education.map((edu) => (
              <div key={edu.id} className="classic-item">
                <div className="classic-item-header">
                  <strong>{edu.degree} in {edu.fieldOfStudy}</strong>
                  <span>{formatDateRange(edu)}</span>
                </div>
                <div className="classic-item-header">
                  <span>{edu.institution} {edu.location && `| ${edu.location}`}</span>
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                </div>
                {edu.description && <p className="item-desc">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section className="classic-section">
          <h2 style={accentColorStyle}>Skills</h2>
          <hr style={borderBottomAccentStyle} />
          <div className="classic-skills-grid">
            {skills.map((skill) => (
              <div key={skill.id} className="classic-skill-tag">
                <strong>{skill.name}</strong> ({skill.level})
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="classic-section">
          <h2 style={accentColorStyle}>Projects</h2>
          <hr style={borderBottomAccentStyle} />
          <div className="classic-list">
            {projects.map((proj) => (
              <div key={proj.id} className="classic-item">
                <div className="classic-item-header">
                  <strong>{proj.name} ({proj.role})</strong>
                  <span>{formatDateRange(proj)}</span>
                </div>
                {proj.technologies && <span className="item-tech">Tech: {proj.technologies}</span>}
                <p className="item-desc">{proj.description}</p>
                {proj.link && <a href={proj.link} className="classic-link" target="_blank" rel="noreferrer">Project Link</a>}
              </div>
            ))}
          </div>
        </section>
      )}

      {achievements.length > 0 && (
        <section className="classic-section">
          <h2 style={accentColorStyle}>Achievements</h2>
          <hr style={borderBottomAccentStyle} />
          <div className="classic-list">
            {achievements.map((ach) => (
              <div key={ach.id} className="classic-item">
                <div className="classic-item-header">
                  <strong>{ach.title}</strong>
                  <span>{ach.date}</span>
                </div>
                {ach.description && <p className="item-desc">{ach.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {hobbies.length > 0 && (
        <section className="classic-section">
          <h2 style={accentColorStyle}>Hobbies & Interests</h2>
          <hr style={borderBottomAccentStyle} />
          <div className="classic-skills-grid">
            {hobbies.map((hob) => (
              <div key={hob.id} className="classic-skill-tag">
                <strong>{hob.name}</strong>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  // 2. MODERN TEMPLATE
  const renderModern = () => (
    <div className="template-modern" style={fontStyle}>
      <aside className="modern-sidebar" style={accentBgStyle}>
        <div className="modern-avatar-container">
          {personalInfo.avatarUrl ? (
            <img src={personalInfo.avatarUrl} alt={personalInfo.name} className="modern-avatar" />
          ) : (
            <div className="modern-avatar-fallback">{personalInfo.name ? personalInfo.name.charAt(0).toUpperCase() : 'U'}</div>
          )}
        </div>
        
        <h2 className="modern-sidebar-name">{personalInfo.name || 'John Doe'}</h2>
        <p className="modern-sidebar-title">{personalInfo.title || 'Professional Title'}</p>

        <div className="modern-sidebar-contact">
          <h3>Contact Details</h3>
          {personalInfo.email && <p>{personalInfo.email}</p>}
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {personalInfo.location && <p>{personalInfo.location}</p>}
          {personalInfo.website && <p>{personalInfo.website}</p>}
        </div>

        {skills.length > 0 && (
          <div className="modern-sidebar-skills">
            <h3>Key Skills</h3>
            {skills.map((skill) => (
              <div key={skill.id} className="modern-skill-item">
                <span>{skill.name}</span>
                <span className="skill-level">{skill.level}</span>
              </div>
            ))}
          </div>
        )}

        {hobbies.length > 0 && (
          <div className="modern-sidebar-skills" style={{ marginTop: '20px' }}>
            <h3>Hobbies</h3>
            {hobbies.map((hob) => (
              <div key={hob.id} className="modern-skill-item">
                <span>{hob.name}</span>
              </div>
            ))}
          </div>
        )}
      </aside>

      <main className="modern-main">
        {personalInfo.summary && (
          <section className="modern-section">
            <h2 className="modern-section-title" style={borderLeftAccentStyle}>Profile</h2>
            <p className="modern-summary-text">{personalInfo.summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="modern-section">
            <h2 className="modern-section-title" style={borderLeftAccentStyle}>Experience</h2>
            <div className="modern-list">
              {experience.map((exp) => (
                <div key={exp.id} className="modern-item">
                  <div className="modern-item-meta">
                    <strong>{exp.position}</strong>
                    <span>{formatDateRange(exp)}</span>
                  </div>
                  <p className="company-label">{exp.company} {exp.location && `| ${exp.location}`}</p>
                  <p className="modern-item-desc">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section className="modern-section">
            <h2 className="modern-section-title" style={borderLeftAccentStyle}>Education</h2>
            <div className="modern-list">
              {education.map((edu) => (
                <div key={edu.id} className="modern-item">
                  <div className="modern-item-meta">
                    <strong>{edu.degree} in {edu.fieldOfStudy}</strong>
                    <span>{formatDateRange(edu)}</span>
                  </div>
                  <p className="institution-label">{edu.institution} {edu.gpa && `| GPA: ${edu.gpa}`}</p>
                  {edu.description && <p className="modern-item-desc">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section className="modern-section">
            <h2 className="modern-section-title" style={borderLeftAccentStyle}>Projects</h2>
            <div className="modern-list">
              {projects.map((proj) => (
                <div key={proj.id} className="modern-item">
                  <div className="modern-item-meta">
                    <strong>{proj.name}</strong>
                    <span>{formatDateRange(proj)}</span>
                  </div>
                  <p className="company-label">{proj.role} {proj.technologies && `| Tech: ${proj.technologies}`}</p>
                  <p className="modern-item-desc">{proj.description}</p>
                  {proj.link && <a href={proj.link} className="classic-link" style={accentColorStyle} target="_blank" rel="noreferrer">Project Link</a>}
                </div>
              ))}
            </div>
          </section>
        )}

        {achievements.length > 0 && (
          <section className="modern-section">
            <h2 className="modern-section-title" style={borderLeftAccentStyle}>Achievements</h2>
            <div className="modern-list">
              {achievements.map((ach) => (
                <div key={ach.id} className="modern-item">
                  <div className="modern-item-meta">
                    <strong>{ach.title}</strong>
                    <span>{ach.date}</span>
                  </div>
                  {ach.description && <p className="modern-item-desc">{ach.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );

  // 3. MINIMAL TEMPLATE
  const renderMinimal = () => (
    <div className="template-minimal" style={fontStyle}>
      <header className="minimal-header">
        <div className="minimal-brand">
          <h1>{personalInfo.name || 'John Doe'}</h1>
          <p className="minimal-title" style={accentColorStyle}>{personalInfo.title || 'Professional Title'}</p>
        </div>
        <div className="minimal-contact">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </header>

      {personalInfo.summary && (
        <section className="minimal-section">
          <p className="minimal-summary">{personalInfo.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="minimal-section">
          <h3 className="minimal-sec-title">Experience</h3>
          {experience.map((exp) => (
            <div key={exp.id} className="minimal-item">
              <div className="minimal-item-header">
                <strong>{exp.position} — {exp.company}</strong>
                <span>{formatDateRange(exp)}</span>
              </div>
              <p className="minimal-desc">{exp.description}</p>
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="minimal-section">
          <h3 className="minimal-sec-title">Education</h3>
          {education.map((edu) => (
            <div key={edu.id} className="minimal-item">
              <div className="minimal-item-header">
                <strong>{edu.degree}, {edu.fieldOfStudy}</strong>
                <span>{formatDateRange(edu)}</span>
              </div>
              <p className="minimal-item-sub">{edu.institution} {edu.gpa && `(GPA: ${edu.gpa})`}</p>
            </div>
          ))}
        </section>
      )}

      {projects.length > 0 && (
        <section className="minimal-section">
          <h3 className="minimal-sec-title">Projects</h3>
          {projects.map((proj) => (
            <div key={proj.id} className="minimal-item">
              <div className="minimal-item-header">
                <strong>{proj.name} — {proj.role}</strong>
                <span>{formatDateRange(proj)}</span>
              </div>
              {proj.technologies && <p className="minimal-item-sub">Tech: {proj.technologies}</p>}
              <p className="minimal-desc">{proj.description}</p>
              {proj.link && <a href={proj.link} className="classic-link" target="_blank" rel="noreferrer" style={{ fontSize: '11px', textDecoration: 'underline', color: color }}>Link</a>}
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section className="minimal-section">
          <h3 className="minimal-sec-title">Core Skills</h3>
          <div className="minimal-skills">
            {skills.map((skill) => (
              <span key={skill.id} className="minimal-skill-badge" style={{ border: `1px solid ${color}40` }}>
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {achievements.length > 0 && (
        <section className="minimal-section">
          <h3 className="minimal-sec-title">Achievements</h3>
          {achievements.map((ach) => (
            <div key={ach.id} className="minimal-item">
              <div className="minimal-item-header">
                <strong>{ach.title}</strong>
                <span>{ach.date}</span>
              </div>
              {ach.description && <p className="minimal-desc">{ach.description}</p>}
            </div>
          ))}
        </section>
      )}

      {hobbies.length > 0 && (
        <section className="minimal-section">
          <h3 className="minimal-sec-title">Interests & Hobbies</h3>
          <div className="minimal-skills">
            {hobbies.map((hob) => (
              <span key={hob.id} className="minimal-skill-badge" style={{ border: `1px solid ${color}20`, background: `${color}05` }}>
                {hob.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  // 4. CREATIVE TEMPLATE
  const renderCreative = () => (
    <div className="template-creative" style={fontStyle}>
      <header className="creative-header" style={accentBgStyle}>
        <div className="creative-header-content">
          <h1>{personalInfo.name || 'John Doe'}</h1>
          <p>{personalInfo.title || 'Professional Title'}</p>
        </div>
        <div className="creative-header-contact">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </header>

      <div className="creative-layout">
        <main className="creative-main-col">
          {personalInfo.summary && (
            <section className="creative-section">
              <h3 style={accentColorStyle}>About Me</h3>
              <p className="creative-summary">{personalInfo.summary}</p>
            </section>
          )}

          {experience.length > 0 && (
            <section className="creative-section">
              <h3 style={accentColorStyle}>Professional Journey</h3>
              {experience.map((exp) => (
                <div key={exp.id} className="creative-item">
                  <div className="creative-item-header">
                    <strong>{exp.position}</strong>
                    <span>{formatDateRange(exp)}</span>
                  </div>
                  <span className="creative-item-company">{exp.company}</span>
                  <p className="creative-desc">{exp.description}</p>
                </div>
              ))}
            </section>
          )}

          {projects.length > 0 && (
            <section className="creative-section">
              <h3 style={accentColorStyle}>Key Projects</h3>
              {projects.map((proj) => (
                <div key={proj.id} className="creative-item">
                  <div className="creative-item-header">
                    <strong>{proj.name}</strong>
                    <span>{formatDateRange(proj)}</span>
                  </div>
                  <span className="creative-item-company">{proj.role} {proj.technologies && `| ${proj.technologies}`}</span>
                  <p className="creative-desc">{proj.description}</p>
                </div>
              ))}
            </section>
          )}

          {achievements.length > 0 && (
            <section className="creative-section">
              <h3 style={accentColorStyle}>Key Achievements</h3>
              {achievements.map((ach) => (
                <div key={ach.id} className="creative-item">
                  <div className="creative-item-header">
                    <strong>{ach.title}</strong>
                    <span>{ach.date}</span>
                  </div>
                  {ach.description && <p className="creative-desc">{ach.description}</p>}
                </div>
              ))}
            </section>
          )}
        </main>

        <aside className="creative-sidebar-col">
          {skills.length > 0 && (
            <section className="creative-section">
              <h3 style={accentColorStyle}>Core Competencies</h3>
              <div className="creative-skills">
                {skills.map((skill) => (
                  <div key={skill.id} className="creative-skill-bar">
                    <span>{skill.name}</span>
                    <span className="creative-skill-level">{skill.level}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section className="creative-section">
              <h3 style={accentColorStyle}>Education</h3>
              {education.map((edu) => (
                <div key={edu.id} className="creative-sidebar-item">
                  <strong>{edu.degree}</strong>
                  <span>{edu.institution}</span>
                  <span className="date-badge">{formatDateRange(edu)}</span>
                </div>
              ))}
            </section>
          )}

          {hobbies.length > 0 && (
            <section className="creative-section">
              <h3 style={accentColorStyle}>Interests & Hobbies</h3>
              <div className="creative-skills">
                {hobbies.map((hob) => (
                  <div key={hob.id} className="creative-sidebar-item" style={{ paddingBottom: '4px' }}>
                    <strong>{hob.name}</strong>
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );

  // 5. TECHNICAL TEMPLATE
  const renderTechnical = () => (
    <div className="template-technical" style={fontStyle}>
      <header className="tech-header">
        <div className="tech-title-block">
          <h2>{personalInfo.name || 'John Doe'}</h2>
          <p className="tech-role" style={accentColorStyle}>{personalInfo.title || 'Technical Specialist'}</p>
        </div>
        <div className="tech-contact-block">
          {personalInfo.email && <span>Email: {personalInfo.email}</span>}
          {personalInfo.phone && <span>Phone: {personalInfo.phone}</span>}
          {personalInfo.location && <span>Loc: {personalInfo.location}</span>}
          {personalInfo.github && <span>GitHub: {personalInfo.github}</span>}
          {personalInfo.linkedin && <span>LinkedIn: {personalInfo.linkedin}</span>}
        </div>
      </header>

      {personalInfo.summary && (
        <section className="tech-section">
          <h3 className="tech-heading" style={borderLeftAccentStyle}>Technical Summary</h3>
          <p className="tech-summary-p">{personalInfo.summary}</p>
        </section>
      )}

      {skills.length > 0 && (
        <section className="tech-section">
          <h3 className="tech-heading" style={borderLeftAccentStyle}>Skills Inventory</h3>
          <div className="tech-skills-wrap">
            {skills.map((skill) => (
              <span key={skill.id} className="tech-skill-tag" style={{ borderLeft: `3px solid ${color}` }}>
                {skill.name} <span className="lvl">({skill.level})</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {experience.length > 0 && (
        <section className="tech-section">
          <h3 className="tech-heading" style={borderLeftAccentStyle}>Engineering Work Experience</h3>
          {experience.map((exp) => (
            <div key={exp.id} className="tech-item">
              <div className="tech-item-meta">
                <strong>{exp.position} @ {exp.company}</strong>
                <span>{formatDateRange(exp)}</span>
              </div>
              <p className="tech-desc">{exp.description}</p>
            </div>
          ))}
        </section>
      )}

      {projects.length > 0 && (
        <section className="tech-section">
          <h3 className="tech-heading" style={borderLeftAccentStyle} >Core Repositories & Projects</h3>
          {projects.map((proj) => (
            <div key={proj.id} className="tech-item">
              <div className="tech-item-meta">
                <strong>{proj.name} ({proj.role})</strong>
                <span>{formatDateRange(proj)}</span>
              </div>
              {proj.technologies && <span className="tech-languages">Tech Stack: {proj.technologies}</span>}
              <p className="tech-desc">{proj.description}</p>
              {proj.link && <a href={proj.link} className="tech-link-url" style={accentColorStyle} target="_blank" rel="noreferrer">{proj.link}</a>}
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="tech-section">
          <h3 className="tech-heading" style={borderLeftAccentStyle}>Education</h3>
          {education.map((edu) => (
            <div key={edu.id} className="tech-item">
              <div className="tech-item-meta">
                <strong>{edu.degree} in {edu.fieldOfStudy}</strong>
                <span>{formatDateRange(edu)}</span>
              </div>
              <p className="tech-desc">{edu.institution} {edu.gpa && `| GPA: ${edu.gpa}`} {edu.location && `| ${edu.location}`}</p>
            </div>
          ))}
        </section>
      )}

      {achievements.length > 0 && (
        <section className="tech-section">
          <h3 className="tech-heading" style={borderLeftAccentStyle}>Achievements</h3>
          {achievements.map((ach) => (
            <div key={ach.id} className="tech-item">
              <div className="tech-item-meta">
                <strong>{ach.title}</strong>
                <span>{ach.date}</span>
              </div>
              {ach.description && <p className="tech-desc">{ach.description}</p>}
            </div>
          ))}
        </section>
      )}

      {hobbies.length > 0 && (
        <section className="tech-section">
          <h3 className="tech-heading" style={borderLeftAccentStyle}>Hobbies & Interests</h3>
          <div className="tech-skills-wrap">
            {hobbies.map((hob) => (
              <span key={hob.id} className="tech-skill-tag" style={{ borderLeft: `3px solid ${color}40` }}>
                {hob.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  // 6. FRESHER TEMPLATE
  const renderFresher = () => (
    <div className="template-fresher" style={fontStyle}>
      <header className="fresher-header">
        <h1 style={accentColorStyle}>{personalInfo.name || 'Your Name'}</h1>
        <p className="fresher-subtitle">{personalInfo.title || 'Aspirational Title'}</p>
        <div className="fresher-contact">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </header>

      {personalInfo.summary && (
        <section className="fresher-section">
          <h3 style={accentColorStyle}>Career Objective</h3>
          <hr className="fresher-divider" />
          <p className="fresher-text">{personalInfo.summary}</p>
        </section>
      )}

      {skills.length > 0 && (
        <section className="fresher-section">
          <h3 style={accentColorStyle}>Skills & Abilities</h3>
          <hr className="fresher-divider" />
          <div className="fresher-skills-row">
            {skills.map((skill) => (
              <span key={skill.id} className="fresher-skill" style={{ border: `1px dashed ${color}` }}>
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {experience.length > 0 && (
        <section className="fresher-section">
          <h3 style={accentColorStyle}>Work & Internship Experience</h3>
          <hr className="fresher-divider" />
          {experience.map((exp) => (
            <div key={exp.id} className="fresher-item">
              <div className="fresher-item-header">
                <strong>{exp.position} at {exp.company}</strong>
                <span>{formatDateRange(exp)}</span>
              </div>
              {exp.location && <p className="fresher-item-institution">{exp.location}</p>}
              <p className="fresher-desc">{exp.description}</p>
            </div>
          ))}
        </section>
      )}

      {projects.length > 0 && (
        <section className="fresher-section">
          <h3 style={accentColorStyle}>Key Academic Projects</h3>
          <hr className="fresher-divider" />
          {projects.map((proj) => (
            <div key={proj.id} className="fresher-item">
              <div className="fresher-item-header">
                <strong>{proj.name}</strong>
                <span>{formatDateRange(proj)}</span>
              </div>
              <p className="fresher-item-tech">Technologies: {proj.technologies}</p>
              <p className="fresher-desc">{proj.description}</p>
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="fresher-section">
          <h3 style={accentColorStyle} >Academic History</h3>
          <hr className="fresher-divider" />
          {education.map((edu) => (
            <div key={edu.id} className="fresher-item">
              <div className="fresher-item-header">
                <strong>{edu.degree} in {edu.fieldOfStudy}</strong>
                <span>{formatDateRange(edu)}</span>
              </div>
              <p className="fresher-item-institution">{edu.institution} {edu.gpa && `| Cumulative GPA: ${edu.gpa}`}</p>
            </div>
          ))}
        </section>
      )}

      {achievements.length > 0 && (
        <section className="fresher-section">
          <h3 style={accentColorStyle}>Key Achievements</h3>
          <hr className="fresher-divider" />
          {achievements.map((ach) => (
            <div key={ach.id} className="fresher-item">
              <div className="fresher-item-header">
                <strong>{ach.title}</strong>
                <span>{ach.date}</span>
              </div>
              {ach.description && <p className="fresher-desc">{ach.description}</p>}
            </div>
          ))}
        </section>
      )}

      {hobbies.length > 0 && (
        <section className="fresher-section">
          <h3 style={accentColorStyle}>Hobbies & Interests</h3>
          <hr className="fresher-divider" />
          <div className="fresher-skills-row">
            {hobbies.map((hob) => (
              <span key={hob.id} className="fresher-skill" style={{ border: `1px dashed ${color}` }}>
                {hob.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  // 7. EXECUTIVE TEMPLATE (PRO)
  const renderExecutive = () => (
    <div className="template-executive" style={fontStyle}>
      <header className="executive-header" style={{ borderBottom: `4px solid ${color}` }}>
        <h1 style={accentColorStyle}>{personalInfo.name || 'John Doe'}</h1>
        <p className="executive-subtitle" style={{ letterSpacing: '2px', textTransform: 'uppercase' }}>{personalInfo.title || 'Executive Leader'}</p>
        <div className="executive-contact">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </header>

      <div className="executive-body">
        {personalInfo.summary && (
          <section className="executive-section">
            <h2 style={accentColorStyle}>Executive Summary</h2>
            <p className="executive-summary-text">{personalInfo.summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="executive-section">
            <h2 style={accentColorStyle}>Professional Experience</h2>
            <div className="executive-list">
              {experience.map((exp) => (
                <div key={exp.id} className="executive-item">
                  <div className="executive-item-header">
                    <strong style={{ fontSize: '1.1em' }}>{exp.position}</strong>
                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{formatDateRange(exp)}</span>
                  </div>
                  <div className="executive-company">
                    <span style={{ fontWeight: 700 }}>{exp.company}</span>
                    {exp.location && <span> | {exp.location}</span>}
                  </div>
                  <p className="item-desc">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section className="executive-section">
            <h2 style={accentColorStyle}>Education & Credentials</h2>
            <div className="executive-list">
              {education.map((edu) => (
                <div key={edu.id} className="executive-item">
                  <div className="executive-item-header">
                    <strong>{edu.degree} in {edu.fieldOfStudy}</strong>
                    <span>{formatDateRange(edu)}</span>
                  </div>
                  <div>
                    <span>{edu.institution}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section className="executive-section">
            <h2 style={accentColorStyle}>Core Competencies</h2>
            <div className="executive-skills-grid">
              {skills.map((skill) => (
                <div key={skill.id} className="executive-skill-tag" style={{ borderLeft: `2px solid ${color}` }}>
                  {skill.name}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );

  // 8. ACADEMIC TEMPLATE
  const renderAcademic = () => (
    <div className="template-academic" style={fontStyle}>
      <header className="academic-header">
        <h1 style={{ ...accentColorStyle, fontFamily: '"Times New Roman", serif' }}>{personalInfo.name || 'John Doe'}</h1>
        <div className="academic-contact">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </header>

      <div className="academic-body">
        {education.length > 0 && (
          <section className="academic-section">
            <h2 style={{ ...accentColorStyle, borderBottom: `1px solid ${color}` }}>Education</h2>
            <div className="academic-list">
              {education.map((edu) => (
                <div key={edu.id} className="academic-item">
                  <div className="academic-item-header">
                    <strong>{edu.institution}</strong>
                    <span>{formatDateRange(edu)}</span>
                  </div>
                  <div>
                    <i>{edu.degree} in {edu.fieldOfStudy}</i>
                  </div>
                  {edu.description && <p className="item-desc">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {experience.length > 0 && (
          <section className="academic-section">
            <h2 style={{ ...accentColorStyle, borderBottom: `1px solid ${color}` }}>Academic & Research Experience</h2>
            <div className="academic-list">
              {experience.map((exp) => (
                <div key={exp.id} className="academic-item">
                  <div className="academic-item-header">
                    <strong>{exp.company}</strong>
                    <span>{formatDateRange(exp)}</span>
                  </div>
                  <div><i>{exp.position}</i></div>
                  <p className="item-desc">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section className="academic-section">
            <h2 style={{ ...accentColorStyle, borderBottom: `1px solid ${color}` }}>Publications & Projects</h2>
            <div className="academic-list">
              {projects.map((proj) => (
                <div key={proj.id} className="academic-item">
                  <div className="academic-item-header">
                    <strong>{proj.name}</strong>
                    <span>{formatDateRange(proj)}</span>
                  </div>
                  <p className="item-desc">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );

  switch (template) {
    case 'executive':
      return renderExecutive();
    case 'academic':
      return renderAcademic();
    case 'modern':
      return renderModern();
    case 'minimal':
      return renderMinimal();
    case 'creative':
      return renderCreative();
    case 'technical':
      return renderTechnical();
    case 'fresher':
      return renderFresher();
    case 'classic':
    default:
      return renderClassic();
  }
};
export default ResumeTemplateRenderer;
