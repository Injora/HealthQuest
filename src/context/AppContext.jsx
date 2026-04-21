import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { api } from '../api/supabase';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // email string (used by existing api calls)
  const [userId, setUserId] = useState(null);    // auth.uid() UUID (used for user_profiles)
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('aiHealthTheme') || 'light');

  // Persistent lifetime stats from user_profiles
  const [userProfile, setUserProfile] = useState({ totalExp: 0, tasksCompleted: 0 });

  // Handle Theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('aiHealthTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Fetch persistent profile whenever we have a valid userId + email
  useEffect(() => {
    if (!userId || !user) {
      setUserProfile({ totalExp: 0, tasksCompleted: 0 });
      return;
    }

    let cancelled = false;

    async function loadProfile() {
      const profile = await api.getUserProfile(userId, user);
      if (!cancelled) {
        setUserProfile(profile);
      }
    }

    loadProfile();

    return () => { cancelled = true; };
  }, [userId, user]);

  /**
   * Called by TaskTracker (or any component) after completing a task.
   * Persists the increment to Supabase and updates context in one shot.
   */
  const addStats = useCallback(async (expGained = 50, tasksGained = 1) => {
    if (!userId) return;

    // Optimistic local update
    setUserProfile(prev => ({
      totalExp: prev.totalExp + expGained,
      tasksCompleted: prev.tasksCompleted + tasksGained,
    }));

    // Persist to Supabase
    const result = await api.updateUserStats(userId, expGained, tasksGained);

    // If the server responded, reconcile with the canonical values
    if (result) {
      setUserProfile(result);
    }
  }, [userId]);

  // Helper to extract user info from a session object
  function applySession(session) {
    const email = session?.user?.email ?? null;
    const uid = session?.user?.id ?? null;
    setUser(email);
    setUserId(uid);
  }

  // Restore session on mount and listen for auth changes
  useEffect(() => {
    // If Supabase client failed to initialize, skip auth entirely
    if (!supabase) {
      console.error('[AppContext] Supabase client is null — skipping auth.');
      setLoading(false);
      return;
    }

    let isMounted = true;

    // 1. Check for existing session first
    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (error) {
          console.error('[AppContext] getSession error:', error.message);
        }
        if (isMounted) {
          applySession(data?.session);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('[AppContext] getSession unexpected error:', err);
        if (isMounted) {
          setUser(null);
          setUserId(null);
          setLoading(false);
        }
      });

    // 2. Listen for auth changes (login / logout / token refresh)
    let subscription;
    try {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        console.log('[AppContext] Auth event:', event);
        if (isMounted) {
          applySession(session);
          // Ensure loading is cleared on any auth event (handles OAuth redirect)
          setLoading(false);
        }
      });
      subscription = data?.subscription;
    } catch (err) {
      console.error('[AppContext] onAuthStateChange error:', err);
      if (isMounted) setLoading(false);
    }

    return () => {
      isMounted = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  // Google OAuth login
  const login = async () => {
    if (!supabase) {
      console.error('[AppContext] Cannot login — Supabase client not initialized');
      return;
    }
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) {
        console.error('[AppContext] OAuth login error:', error.message);
      }
    } catch (err) {
      console.error('[AppContext] OAuth login unexpected error:', err);
    }
  };

  // Sign out
  const logout = async () => {
    if (supabase) {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('[AppContext] Sign out error:', error.message);
        }
      } catch (err) {
        console.error('[AppContext] Sign out unexpected error:', err);
      }
    }
    setUser(null);
    setUserId(null);
    setUserProfile({ totalExp: 0, tasksCompleted: 0 });
  };

  // Show a visible loading spinner while resolving auth state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
        backgroundColor: 'var(--bg-primary, #0f172a)',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid rgba(99, 102, 241, 0.2)',
          borderTopColor: 'var(--brand-primary, #6366f1)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{
      user,
      userId,
      userProfile,
      addStats,
      login,
      logout,
      theme,
      toggleTheme,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
