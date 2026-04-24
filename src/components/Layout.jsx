import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, History, CheckCircle, LogOut, Sun, Moon, Activity } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Layout() {
  const { user, logout, theme, toggleTheme } = useAppContext();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'History', path: '/history', icon: History },
    { name: 'Tasks', path: '/tasks', icon: CheckCircle },

  ];

  return (
    <div className="flex h-screen w-full" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside className="card flex-col justify-between" style={{ 
        width: '260px', height: '100vh', borderRadius: 0, borderRight: '1px solid var(--border-color)', borderLeft: 'none', borderTop: 'none', borderBottom: 'none', boxShadow: 'none'
      }}>
        <div className="flex-col gap-6">
          <div className="flex items-center gap-3" style={{ padding: '0.5rem' }}>
            <Activity className="text-brand-primary" style={{ color: 'var(--brand-primary)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Health Quest</h2>
          </div>
          
          <nav className="flex-col gap-2">
            {navItems.map((item) => (
              <NavLink 
                key={item.name} 
                to={item.path}
                className={({ isActive }) => `flex items-center gap-3 w-full btn ${isActive ? 'btn-primary' : 'btn-outline'}`}
                style={({ isActive }) => ({
                  justifyContent: 'flex-start',
                  backgroundColor: isActive ? 'var(--brand-primary)' : 'transparent',
                  borderColor: 'transparent',
                  color: isActive ? 'white' : 'var(--text-secondary)'
                })}
              >
                <item.icon size={20} />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex-col gap-4">
          <button className="btn btn-outline w-full justify-start gap-3" onClick={toggleTheme} style={{ borderColor: 'transparent', color: 'var(--text-secondary)' }}>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
          
          <div style={{ height: '1px', backgroundColor: 'var(--border-color)' }} />
          
          <div className="flex items-center justify-between">
            <div className="flex-col">
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.split('@')[0]}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }} title={user}>{user?.length > 18 ? user.substring(0, 15) + '...' : user}</span>
            </div>
            <button className="btn" style={{ padding: '0.5rem', color: 'var(--status-error)' }} onClick={logout} title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-col" style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '2rem 3rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
