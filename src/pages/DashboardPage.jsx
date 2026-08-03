import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumes } from '../context/resumeContext';
import { useAuth } from '../context/authContext';
import { Plus, Edit2, Copy, Trash2, Calendar, FileText, BarChart, ChevronDown, Check } from 'lucide-react';
import { Dialog } from '../components/Dialog';
import './DashboardPage.css';

export const DashboardPage = () => {
  const { resumes, createResume, deleteResume, duplicateResume, setActiveResumeById } = useResumes();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Create Resume Modal states
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('classic');

  // Delete Confirmation Modal states
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Resume card action menu state
  const [menuOpenId, setMenuOpenId] = useState(null);

  const handleCreateResume = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newResume = createResume(newTitle, selectedTemplate);
    setCreateOpen(false);
    setNewTitle('');
    navigate(`/builder?id=${newResume.id}`);
  };

  const handleEditResume = (resumeId) => {
    setActiveResumeById(resumeId);
    navigate(`/builder?id=${resumeId}`);
  };

  const handleDuplicateResume = (resumeId, e) => {
    e.stopPropagation();
    duplicateResume(resumeId);
    setMenuOpenId(null);
  };

  const openDeleteDialog = (resumeId, e) => {
    e.stopPropagation();
    setDeleteId(resumeId);
    setDeleteOpen(true);
    setMenuOpenId(null);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteResume(deleteId);
      setDeleteOpen(false);
      setDeleteId(null);
    }
  };

  const formatDate = (timestampObj) => {
    if (!timestampObj) return 'Just now';
    let d;
    // Check if it's a Firestore Timestamp (has toDate function)
    if (timestampObj.toDate && typeof timestampObj.toDate === 'function') {
      d = timestampObj.toDate();
    } else {
      d = new Date(timestampObj);
    }
    
    if (isNaN(d.getTime())) return 'Just now';
    
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getScoreColorClass = (score) => {
    if (score >= 80) return 'ats-high';
    if (score >= 50) return 'ats-mid';
    return 'ats-low';
  };

  const templatesList = [
    { value: 'classic', label: 'Classic Traditional' },
    { value: 'modern', label: 'Modern Sidebar' },
    { value: 'minimal', label: 'Minimal Elegant' },
    { value: 'creative', label: 'Creative Designer' },
    { value: 'technical', label: 'Developer Technical' },
    { value: 'fresher', label: 'Fresher Student' },
  ];

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h2>Your Resumes</h2>
          <p className="subtitle">Manage and optimize your resumes for various job roles.</p>
        </div>
        <button className="glow-btn create-btn" onClick={() => setCreateOpen(true)}>
          <Plus size={18} /> New Resume
        </button>
      </header>

      {resumes.length === 0 ? (
        <div className="empty-dashboard glassmorphism">
          <div className="empty-icon-box">
            <FileText size={48} />
          </div>
          <h3>No Resumes Found</h3>
          <p>Create your first professional, AI-optimized resume in under a minute.</p>
          <button className="glow-btn" onClick={() => setCreateOpen(true)}>
            <Plus size={18} /> Create Resume
          </button>
        </div>
      ) : (
        <div className="resumes-grid">
          {resumes.map((resume) => (
            <div 
              key={resume.id} 
              className="resume-card glassmorphism"
              onClick={() => handleEditResume(resume.id)}
            >
              <div className="resume-card-body">
                <div className="resume-card-header">
                  <div className="resume-icon-box">
                    <FileText size={24} className="resume-doc-icon" />
                  </div>
                  
                  {/* Card Options Dropdown Trigger */}
                  <div className="card-menu-container" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="card-menu-trigger" 
                      onClick={() => setMenuOpenId(menuOpenId === resume.id ? null : resume.id)}
                    >
                      <ChevronDown size={16} />
                    </button>
                    {menuOpenId === resume.id && (
                      <div className="card-dropdown glassmorphism">
                        <button className="card-dropdown-item" onClick={() => handleEditResume(resume.id)}>
                          <Edit2 size={14} /> Edit Resume
                        </button>
                        <button className="card-dropdown-item" onClick={(e) => handleDuplicateResume(resume.id, e)}>
                          <Copy size={14} /> Duplicate
                        </button>
                        <hr className="dropdown-divider" />
                        <button className="card-dropdown-item delete-btn" onClick={(e) => openDeleteDialog(resume.id, e)}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="resume-title-label">{resume.title}</h3>
                <p className="resume-template-label">
                  Template: <span>{resume.template.charAt(0).toUpperCase() + resume.template.slice(1)}</span>
                </p>
              </div>

              <div className="resume-card-footer">
                <span className="last-edited">
                  <Calendar size={12} /> {formatDate(resume.updatedAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE DIALOG */}
      <Dialog 
        isOpen={createOpen} 
        onClose={() => setCreateOpen(false)} 
        title="Create New Resume"
        size="sm"
      >
        <form onSubmit={handleCreateResume} className="create-resume-form">
          <div className="form-group">
            <label htmlFor="resume-title">Resume Title</label>
            <input 
              type="text" 
              id="resume-title"
              placeholder="e.g. Frontend Engineer - Google"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Choose Resume Template</label>
            <div className="template-selectors">
              {templatesList.map((tpl) => (
                <button
                  type="button"
                  key={tpl.value}
                  className={`template-select-item ${selectedTemplate === tpl.value ? 'selected' : ''}`}
                  onClick={() => setSelectedTemplate(tpl.value)}
                >
                  <FileText size={16} />
                  <span>{tpl.label}</span>
                  {selectedTemplate === tpl.value && <Check size={14} className="check-icon" />}
                </button>
              ))}
            </div>
          </div>

          <div className="create-actions">
            <button type="button" className="cancel-btn" onClick={() => setCreateOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="glow-btn start-btn">
              Get Started
            </button>
          </div>
        </form>
      </Dialog>

      {/* DELETE CONFIRM DIALOG */}
      <Dialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete Resume"
        size="sm"
        actions={
          <>
            <button className="cancel-btn" onClick={() => setDeleteOpen(false)}>
              Cancel
            </button>
            <button className="danger-btn glow-btn" onClick={confirmDelete}>
              Delete Resume
            </button>
          </>
        }
      >
        <p>Are you sure you want to delete this resume? This action is permanent and cannot be undone.</p>
      </Dialog>
    </div>
  );
};
