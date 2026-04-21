import React, { useEffect, useState, useRef } from 'react';
import { api } from '../api/supabase';
import { useAppContext } from '../context/AppContext';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

export default function TaskTracker() {
  const { user, addStats } = useAppContext();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animatingId, setAnimatingId] = useState(null);
  const [responseId, setResponseId] = useState(null);
  const prevResponseId = useRef(null);

  // Fetch tasks and detect new responses
  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      const result = await api.getTasks(user);
      if (cancelled) return;

      const { responseId: newId, tasks: newTasks } = result;

      // If the Supabase row changed, reset everything
      if (newId !== prevResponseId.current) {
        prevResponseId.current = newId;
        setResponseId(newId);
        setTasks(newTasks);        // freshly normalized with completed: false
        setAnimatingId(null);
      } else {
        // Same row — merge in any new data but keep local completion state
        setTasks(prev => {
          const completedIds = new Set(prev.filter(t => t.completed).map(t => t.id));
          return newTasks.map(t => ({
            ...t,
            completed: completedIds.has(t.id) ? true : t.completed,
          }));
        });
      }

      setLoading(false);
    }

    fetchData();

    // Poll every 30s so new form submissions are picked up automatically
    const interval = setInterval(fetchData, 30_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [user]);

  // Reset completion state explicitly whenever responseId changes
  useEffect(() => {
    if (responseId === null) return;
    setTasks(prev => prev.map(t => ({ ...t, completed: false })));
    setAnimatingId(null);
  }, [responseId]);

  const toggleTask = async (task) => {
    if (task.completed) return; // Prevent un-checking

    const expReward = task.expReward ?? 50;

    // Optimistic Update
    setTasks(prev => prev.map(t => 
      t.id === task.id ? { ...t, completed: true } : t
    ));
    setAnimatingId(task.id);
    
    // Persist to health_responses (marks task completed in that row)
    await api.completeTask(user, task.id);

    // Persist lifetime stats to user_profiles via context
    await addStats(expReward, 1);
    
    setTimeout(() => {
      setAnimatingId(null);
    }, 500);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-brand-primary" size={48} />
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex-col gap-6 animate-fade-in">
        <header style={{ marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Daily Habits & Tasks</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            No tasks yet. Submit a health check to get personalized tasks!
          </p>
        </header>
      </div>
    );
  }

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="flex-col gap-6 animate-fade-in">
      <header className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Daily Habits & Tasks</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Complete tasks to increase your wellness EXP.</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{completedCount} / {tasks.length}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Completed Today</div>
        </div>
      </header>

      <div className="flex-col gap-4">
        {tasks.map((task) => {
          const isAnimating = animatingId === task.id;

          return (
            <div 
              key={task.id} 
              className={`card flex items-center justify-between ${isAnimating ? 'animate-pulse-once' : ''}`}
              style={{ 
                cursor: task.completed ? 'default' : 'pointer',
                opacity: task.completed ? 0.6 : 1,
                transition: 'all var(--transition-normal)',
                transform: task.completed ? 'scale(0.98)' : 'scale(1)'
              }}
              onClick={() => toggleTask(task)}
            >
              <div className="flex items-center gap-4">
                <button 
                  className="btn" 
                  style={{ padding: 0, color: task.completed ? 'var(--status-success)' : 'var(--text-muted)' }}
                >
                  {task.completed ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                </button>
                <div>
                  <h3 style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: 600, 
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)'
                  }}>
                    {task.name}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="badge badge-purple" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                  +{task.expReward} EXP
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
