import React from 'react';

const StatsDashboard = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdue = tasks.filter(t => {
    if (!t.dueDate || t.status === 'Completed') return false;
    const due = new Date(t.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  }).length;

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="stats-dashboard">
      <div className="stat-card neobrutalist-blue">
        <div className="stat-info">
          <span className="stat-label">Total Tasks</span>
          <span className="stat-value">{total}</span>
        </div>
        <div className="stat-icon-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        </div>
      </div>

      <div className="stat-card neobrutalist-green">
        <div className="stat-info" style={{ width: '100%' }}>
          <span className="stat-label">Completed</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span className="stat-value">{completed}</span>
            <span className="stat-percentage">({percentage}%)</span>
          </div>
          <div className="neobrutalist-progress-container">
            <div className="neobrutalist-progress-bar" style={{ width: `${percentage}%` }}></div>
          </div>
        </div>
        <div className="stat-icon-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
      </div>

      <div className="stat-card neobrutalist-yellow">
        <div className="stat-info">
          <span className="stat-label">In Progress</span>
          <span className="stat-value">{inProgress}</span>
        </div>
        <div className="stat-icon-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
      </div>

      <div className="stat-card neobrutalist-red">
        <div className="stat-info">
          <span className="stat-label">Overdue</span>
          <span className="stat-value">{overdue}</span>
        </div>
        <div className="stat-icon-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
