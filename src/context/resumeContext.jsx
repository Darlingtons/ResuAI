import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './authContext';

const ResumeContext = createContext(undefined);

const initialResumeData = () => ({
  personalInfo: {
    name: '', title: '', email: '', phone: '',
    website: '', github: '', linkedin: '', location: '', summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  achievements: [],
  hobbies: [],
});

export const ResumeProvider = ({ children }) => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [activeResume, setActiveResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAutosaving, setIsAutosaving] = useState(false);
  const autosaveRef = useRef(null);

  // ─── Fetch resumes from Firestore ──────────────────────────────────────────
  const fetchResumes = useCallback(async () => {
    if (!user) {
      setResumes([]);
      setActiveResume(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const q = query(
        collection(db, 'resumes'),
        where('userId', '==', user.id)
      );
      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setResumes(fetched);
    } catch (err) {
      console.error('Failed to fetch resumes:', err);
      setResumes([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  // Autosave every 30 seconds when activeResume changes
  useEffect(() => {
    if (!activeResume) return;
    if (autosaveRef.current) clearInterval(autosaveRef.current);
    autosaveRef.current = setInterval(() => autosave(), 30000);
    return () => clearInterval(autosaveRef.current);
  }, [activeResume]);

  // ─── Create resume in Firestore ────────────────────────────────────────────
  const createResume = useCallback(async (title, template) => {
    if (!user) throw new Error('Must be logged in to create a resume');
    const resumeData = {
      userId: user.id,
      title: title || 'Untitled Resume',
      template: template || 'classic',
      color: '#6366f1',
      font: 'Plus Jakarta Sans',
      data: initialResumeData(),
      atsScore: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, 'resumes'), resumeData);
    const newResume = { id: docRef.id, ...resumeData };
    setResumes(prev => [...prev, newResume]);
    setActiveResume(newResume);
    return newResume;
  }, [user]);

  const getResumeById = useCallback((id) => {
    return resumes.find(r => r.id === id);
  }, [resumes]);

  // ─── Update active resume data locally (saved on autosave / manual save) ──
  const updateResumeData = useCallback((updatedData) => {
    if (!activeResume) return;
    setActiveResume(prev => {
      if (!prev) return null;
      const mergedData = { ...prev.data, ...updatedData };
      // Dynamic ATS score
      let score = 0;
      if (mergedData.personalInfo?.name?.trim()) score += 5;
      if (mergedData.personalInfo?.email?.trim()) score += 5;
      if (mergedData.personalInfo?.phone?.trim()) score += 5;
      if (mergedData.personalInfo?.summary?.trim().length > 20) score += 10;
      
      const validExps = (mergedData.experience || []).filter(e => e.company && e.description);
      score += Math.min(validExps.length * 15, 30);
      
      const validEdus = (mergedData.education || []).filter(e => e.institution && e.degree);
      score += Math.min(validEdus.length * 10, 20);
      
      const validSkills = (mergedData.skills || []).filter(s => s.name);
      score += Math.min(validSkills.length * 2, 10);
      
      const validProjs = (mergedData.projects || []).filter(p => p.name && p.description);
      score += Math.min(validProjs.length * 5, 15);

      return {
        ...prev,
        data: mergedData,
        atsScore: Math.min(score, 100),
        updatedAt: new Date().toISOString(),
      };
    });
  }, [activeResume]);

  const updateResumeSettings = useCallback((settings) => {
    if (!activeResume) return;
    setActiveResume(prev => prev ? { ...prev, ...settings, updatedAt: new Date().toISOString() } : null);
  }, [activeResume]);

  // ─── Save active resume to Firestore ──────────────────────────────────────
  const saveActiveResume = useCallback(async () => {
    if (!activeResume || !user) return;
    try {
      const { id, createdAt, ...updates } = activeResume;
      await updateDoc(doc(db, 'resumes', id), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      setResumes(prev => prev.map(r => r.id === id ? activeResume : r));
    } catch (err) {
      console.error('Save failed:', err);
    }
  }, [activeResume, user]);

  const autosave = useCallback(async () => {
    if (!activeResume || !user) return;
    setIsAutosaving(true);
    await saveActiveResume();
    setIsAutosaving(false);
  }, [activeResume, user, saveActiveResume]);

  // ─── Delete resume from Firestore ──────────────────────────────────────────
  const deleteResume = useCallback(async (id) => {
    await deleteDoc(doc(db, 'resumes', id));
    setResumes(prev => prev.filter(r => r.id !== id));
    if (activeResume?.id === id) setActiveResume(null);
  }, [activeResume]);

  // ─── Duplicate resume ──────────────────────────────────────────────────────
  const duplicateResume = useCallback(async (id) => {
    const target = resumes.find(r => r.id === id);
    if (!target || !user) return;
    const { id: _id, ...rest } = target;
    const docRef = await addDoc(collection(db, 'resumes'), {
      ...rest,
      title: `${rest.title} (Copy)`,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    setResumes(prev => [...prev, { id: docRef.id, ...rest, title: `${rest.title} (Copy)` }]);
  }, [resumes, user]);

  const setActiveResumeById = useCallback((id) => {
    if (id === null) { setActiveResume(null); return; }
    const matched = resumes.find(r => r.id === id);
    if (matched) setActiveResume(matched);
  }, [resumes]);

  return (
    <ResumeContext.Provider
      value={{
        resumes,
        activeResume,
        loading,
        fetchResumes,
        createResume,
        getResumeById,
        updateResumeData,
        updateResumeSettings,
        deleteResume,
        duplicateResume,
        saveActiveResume,
        setActiveResumeById,
        isAutosaving,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResumes = () => {
  const context = useContext(ResumeContext);
  if (!context) throw new Error('useResumes must be used within a ResumeProvider');
  return context;
};
