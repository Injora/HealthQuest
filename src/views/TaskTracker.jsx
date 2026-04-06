import React, { useEffect, useState } from 'react';
import { api } from '../api/mock';
import { useAppContext } from '../context/AppContext';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

export default function TaskTracker() {
  const { user } = useAppContext();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animatingId, setAnimatingId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await api.getTasks(user);
      setTasks(data);
      setLoading(false);
    }
    fetchData();
  }, [user]);

  const toggleTask = async (task) => {
    if (task.completed) return; // Prevent un-checking mock

    // Optimistic Update
    setTasks(prev => prev.map(t => 
      t.id === task.id ? { ...t, completed: true } : t
    ));
    setAnimatingId(task.id);
    
    // Call backend API
    const result = await api.completeTask(user, task.id);
    
    // In a real app we'd dispatch updated EXP to context if we stored it globally here.
    // For now we just reset the animation flag after showing it.
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
