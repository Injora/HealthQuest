import React, { useEffect, useState } from 'react';
import { api } from '../api/supabase';
import { useAppContext } from '../context/AppContext';
import { Award, Target, Activity as ActivityIcon, Loader2, Sparkles, AlertCircle } from 'lucide-react';

export default function DashboardOverview() {
  const { user, userProfile } = useAppContext();
  const [userData, setUserData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [uData, recs] = await Promise.all([
        api.getUserData(user),
        api.getAiRecommendations(user)
      ]);
      setUserData(uData);
      setRecommendations(recs);
      setLoading(false);
    }
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-brand-primary" size={48} />
      </div>
    );
  }

  // Use persistent lifetime stats from user_profiles (via context)
  const lifetimeExp = userProfile.totalExp ?? userData.exp;
  const lifetimeTasks = userProfile.tasksCompleted ?? userData.completedTasksCount;
  const lifetimeLevel = lifetimeExp >= 250 ? 'Pro' : lifetimeExp >= 100 ? 'Intermediate' : 'Beginner';

  // Calculate generic EXP logic for bar
  const expPercentage = Math.min((lifetimeExp / 2000) * 100, 100);

  return (
    <div className="flex-col gap-6 animate-fade-in">
      <header className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Welcome back!</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Here's your wellness summary for today.</p>
        </div>
        <div className="badge badge-purple" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
          <Sparkles size={16} style={{ marginRight: '0.5rem' }} /> {lifetimeLevel}
        </div>
      </header>

      {/* Grid for top metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        
        {/* EXP Card */}
        <div className="card flex-col gap-4">
          <div className="flex justify-between items-center">
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Total Experience</span>
            <div style={{ padding: '0.5rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--brand-primary)', borderRadius: 'var(--radius-md)' }}>
              <Award size={24} />
            </div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{lifetimeExp} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>EXP</span></div>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${expPercentage}%` }} />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Progress to next rank</p>
        </div>

        {/* Tasks Card */}
        <div className="card flex-col gap-4">
          <div className="flex justify-between items-center">
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Tasks Completed</span>
            <div style={{ padding: '0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--status-success)', borderRadius: 'var(--radius-md)' }}>
              <Target size={24} />
            </div>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{lifetimeTasks}</div>
          <p style={{ fontSize: '0.875rem', color: 'var(--status-success)' }}>Keep up the great work!</p>
        </div>

        {/* Condition Card */}
        <div className="card flex-col gap-4">
          <div className="flex justify-between items-center">
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Latest Prediction</span>
            <div style={{ padding: '0.5rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--status-warning)', borderRadius: 'var(--radius-md)' }}>
              <ActivityIcon size={24} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2 }}>{userData.latestCondition}</div>
          <div className="flex items-center gap-2" style={{ fontSize: '0.875rem', color: 'var(--status-warning)' }}>
            <AlertCircle size={16} /> Needs attention
          </div>
        </div>

      </div>

      {/* AI Recommendations Panel */}
      <div className="flex-col gap-4" style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>AI Recommendations Panel</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {recommendations.map(rec => (
            <div key={rec.id} className="card" style={{ borderLeft: '4px solid var(--brand-primary)' }}>
              <div className="badge badge-purple" style={{ marginBottom: '1rem' }}>{rec.category}</div>
              <p style={{ color: 'var(--text-primary)', lineHeight: 1.6 }}>{rec.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
