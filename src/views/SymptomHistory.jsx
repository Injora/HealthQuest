import React, { useEffect, useState } from 'react';
import { api } from '../api/supabase';
import { useAppContext } from '../context/AppContext';
import { Loader2, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function SymptomHistory() {
  const { user } = useAppContext();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await api.getHealthLogs(user);
      setLogs(data);
      setLoading(false);
    }
    fetchData();
  }, [user]);

  const filteredLogs = logs.filter(log => 
    log.predictedCondition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.symptoms.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.date.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="animate-spin text-brand-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="flex-col gap-6 animate-fade-in">
      <header className="flex justify-between items-center flex-wrap gap-4" style={{ marginBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Symptom History</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Track your past logs, predictions, and remedies.</p>
        </div>
        
        <div className="flex items-center gap-2" style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="input" 
            placeholder="Search date, condition..." 
            style={{ paddingLeft: '2.5rem' }}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset page on search
            }}
          />
        </div>
      </header>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-accent)' }}>
                <th>Date</th>
                <th>Symptoms</th>
                <th>Predicted Condition</th>
                <th>Confidence</th>
                <th>Remedy</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ whiteSpace: 'nowrap', fontWeight: 500 }}>{log.date}</td>
                  <td>{log.symptoms}</td>
                  <td>
                    <span className="badge badge-warning">{log.predictedCondition}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div style={{ flex: 1, backgroundColor: 'var(--border-color)', height: '6px', borderRadius: '4px', width: '60px' }}>
                        <div style={{ width: `${log.confidence}%`, backgroundColor: 'var(--brand-secondary)', height: '100%', borderRadius: '4px' }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{log.confidence}%</span>
                    </div>
                  </td>
                  <td>{log.remedy}</td>
                </tr>
              ))}
              {paginatedLogs.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between" style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} logs
            </span>
            <div className="flex gap-2">
              <button 
                className="btn btn-outline" 
                style={{ padding: '0.25rem 0.5rem' }}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                className="btn btn-outline" 
                style={{ padding: '0.25rem 0.5rem' }}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
