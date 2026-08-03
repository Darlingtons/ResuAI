import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';

const AuthContext = createContext(undefined);

// ─── Helper: load extended profile from Firestore ─────────────────────────────
const loadUserProfile = async (firebaseUser) => {
  const ref = doc(db, 'users', firebaseUser.uid);
  const snap = await getDoc(ref);
  const extra = snap.exists() ? snap.data() : {};
  
  // Whitelisted emails for free lifetime PRO access
  const isWhitelisted = firebaseUser.email === 'sumontagarai2971@gmail.com';

  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || extra.name || '',
    email: firebaseUser.email,
    phone: extra.phone || '',
    picture: firebaseUser.photoURL || extra.picture || '',
    isPro: extra.isPro || isWhitelisted,
    subscriptionRenewal: isWhitelisted ? 'Lifetime Access' : (extra.subscriptionRenewal || null),
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── Auto-restore session via Firebase listener ────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await loadUserProfile(firebaseUser);
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ─── Auto-logout on 5 minutes of inactivity ────────────────────────────────
  useEffect(() => {
    let inactivityTimer;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      if (user) {
        // Set timer for 5 minutes (300,000 milliseconds)
        inactivityTimer = setTimeout(() => {
          signOut(auth).then(() => {
            setUser(null);
            // We don't force a reload here, just letting the protected routes redirect them if needed
          });
        }, 5 * 60 * 1000);
      }
    };

    // Attach event listeners to document
    const events = ['mousemove', 'mousedown', 'keypress', 'DOMMouseScroll', 'mousewheel', 'touchmove', 'MSPointerMove'];
    
    if (user) {
      resetTimer();
      events.forEach(event => {
        document.addEventListener(event, resetTimer, { passive: true });
      });
    }

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, { passive: true });
      });
    };
  }, [user]);

  // ─── Email / Password Sign Up ──────────────────────────────────────────────
  const signup = useCallback(async (name, email, phone, password) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const fbUser = credential.user;

    // Save display name to Firebase Auth profile
    await firebaseUpdateProfile(fbUser, { displayName: name });

    // Save extended profile (phone, etc.) in Firestore users collection
    await setDoc(doc(db, 'users', fbUser.uid), {
      name,
      email,
      phone: phone || '',
      picture: '',
      isPro: false,
      createdAt: serverTimestamp(),
    });

    // onAuthStateChanged will update state automatically
    return fbUser;
  }, []);

  // ─── Email / Password Login ────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  }, []);

  // ─── Google Sign-In (popup) ────────────────────────────────────────────────
  const loginWithGoogle = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      // Create Firestore profile doc if it doesn't exist yet (first Google login)
      const ref = doc(db, 'users', fbUser.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          name: fbUser.displayName || '',
          email: fbUser.email,
          phone: '',
          picture: fbUser.photoURL || '',
          isPro: false,
          createdAt: serverTimestamp(),
        });
      }
      return fbUser;
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') return null;
      throw err;
    }
  }, []);

  // ─── Forgot Password ───────────────────────────────────────────────────────
  const forgotPassword = useCallback(async (email) => {
    await sendPasswordResetEmail(auth, email);
  }, []);

  // ─── Sign Out ──────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  // ─── Update Profile ────────────────────────────────────────────────────────
  const updateProfile = useCallback(async (name, avatarUrl, phone) => {
    if (!auth.currentUser) return;
    await firebaseUpdateProfile(auth.currentUser, {
      displayName: name,
      photoURL: avatarUrl || auth.currentUser.photoURL,
    });
    // Update Firestore profile doc too
    await setDoc(doc(db, 'users', auth.currentUser.uid), {
      name,
      phone: phone || '',
      picture: avatarUrl || auth.currentUser.photoURL || '',
    }, { merge: true });

    setUser(prev => prev ? {
      ...prev,
      name,
      phone: phone || prev.phone,
      picture: avatarUrl || prev.picture,
    } : null);
  }, []);

  // ─── Pro subscription ──────────────────────────────────────────────────────
  const upgradeToPro = useCallback(() => {
    if (!user) return;
    const renewalDate = new Date();
    renewalDate.setFullYear(renewalDate.getFullYear() + 1);
    setUser(prev => ({
      ...prev,
      isPro: true,
      subscriptionRenewal: renewalDate.toLocaleDateString(),
    }));
  }, [user]);

  const cancelSubscription = useCallback(() => {
    if (!user) return;
    setUser(prev => ({ ...prev, isPro: false, subscriptionRenewal: undefined }));
  }, [user]);

  const deleteAccount = useCallback(async () => {
    if (!auth.currentUser) return;
    await auth.currentUser.delete();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        loginWithGoogle,
        forgotPassword,
        logout,
        updateProfile,
        upgradeToPro,
        cancelSubscription,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
