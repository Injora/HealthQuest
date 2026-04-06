import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Activity, ArrowRight } from 'lucide-react';
import '../index.css'; // Just in case, normally in main.jsx

export default function Login() {
  const { login } = useAppContext();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      login(email);
    }
  };

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

        <form onSubmit={handleSubmit} className="flex-col gap-4">
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Email Address</label>
            <input 
              type="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full" style={{ marginTop: '0.5rem' }}>
            Continue <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
