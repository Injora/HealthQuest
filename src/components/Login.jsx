import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Activity } from 'lucide-react';
import '../index.css'; // Just in case, normally in main.jsx

export default function Login() {
  const { login } = useAppContext();

  return (
    <div className="flex items-center justify-center h-screen w-full animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        <div className="flex-col items-center justify-center gap-4" style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div className="flex items-center justify-center" style={{ 
            width: '64px', height: '64px', borderRadius: 'var(--radius-full)', 
            backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--brand-primary)', margin: '0 auto' 
          }}>
            <Activity size={32} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '1rem' }}>AI Wellness Tracker</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Sign in to continue your health journey</p>
        </div>

        <button
          type="button"
          className="btn btn-primary w-full"
          style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
          onClick={login}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.0 24.0 0 0 0 0 21.56l7.98-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
