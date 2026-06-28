import React from 'react';

function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  
  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getOverdueStatus = () => {
    if (!task.dueDate || task.status === 'Completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  const overdue = getOverdueStatus();

  return (
    <div className={`task-card neobrutalist-card ${overdue ? 'overdue-card' : ''}`}>
      <div className="card-header">
        <div className="card-tags">
          <span className={`priority-badge ${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>
          <div className="status-select-container">
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task, e.target.value)}
              className={`status-select-pill ${task.status.toLowerCase().replace(' ', '-')}`}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="card-actions">
          <button 
            onClick={() => onEdit(task)} 
            className="card-action-btn edit-btn" 
            title="Edit Task"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button 
            onClick={() => onDelete(task._id)} 
            className="card-action-btn delete-btn" 
            title="Delete Task"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>
      </div>

      <h3 className="card-title">{task.title}</h3>
      <p className="card-description">{task.description}</p>

      <div className="card-footer">
        <div className={`card-due-date ${overdue ? 'overdue-text' : ''}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>
            {overdue ? 'Overdue: ' : 'Due: '}
            {formatDate(task.dueDate)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;