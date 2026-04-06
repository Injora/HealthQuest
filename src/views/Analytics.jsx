import React, { useEffect, useState } from 'react';
import { api } from '../api/mock';
import { useAppContext } from '../context/AppContext';
import { Loader2 } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

export default function Analytics() {
  const { user, theme } = useAppContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const analyticsInfo = await api.getAnalytics(user);
      setData(analyticsInfo);
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

  const textColor = theme === 'dark' ? '#cbd5e1' : '#64748b';
  const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';

  return (
    <div className="flex-col gap-6 animate-fade-in">
      <header style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Analytics & Trends</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Visualize your health metrics over the past week.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        
        {/* Sleep & Stress Trends (Line Chart) */}
        <div className="card flex-col gap-4">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Sleep vs Stress</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Comparing hours of sleep with stress levels (1-10).</p>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="name" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" name="Sleep (Hrs)" dataKey="sleep" stroke="var(--brand-primary)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" name="Stress Level" dataKey="stress" stroke="var(--status-error)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Patterns (Bar Chart) */}
        <div className="card flex-col gap-4">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Activity Patterns</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Daily active minutes recorded.</p>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="name" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  cursor={{ fill: 'var(--bg-accent)' }}
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}
                />
                <Bar dataKey="activity" name="Active Minutes" fill="var(--brand-secondary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
