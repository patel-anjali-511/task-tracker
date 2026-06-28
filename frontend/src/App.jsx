import React, { useState, useEffect, useCallback } from 'react';
import api from "./services/api";
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import StatsDashboard from './components/StatsDashboard';
import { ToastContainer } from './components/Toast';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [fetchError, setFetchError] = useState(false);

  const addToast = (message, type = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError(false);
      const res = await api.get("/tasks");
      setTasks(res.data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setFetchError(true);
      addToast("Failed to fetch tasks from the server.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  async function handleStatusChange(task, newStatus) {
    try {
      setTasks(prev => prev.map(t => t._id === task._id ? { ...t, status: newStatus } : t));
      
      await api.put(`/tasks/${task._id}`, {
        ...task,
        status: newStatus
      });
      
      addToast(`Task marked as "${newStatus}"`, "success");
      fetchTasks();
    } catch (error) {
      console.error("Error updating status:", error);
      addToast("Failed to update status.", "error");
      fetchTasks();
    }
  }

  async function confirmDeleteTask() {
    if (!deletingTaskId) return;
    try {
      await api.delete(`/tasks/${deletingTaskId}`);
      addToast("Task deleted successfully.", "success");
      setDeletingTaskId(null);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      addToast("Failed to delete the task.", "error");
    }
  }

  return (
    <div className="dashboard-outer-container">
      <div className="dashboard-container neobrutalist-layout">
        <header className="dashboard-header">
          <div className="logo-section">
            <div className="logo-box">
              <span>&lt;/&gt;</span>
            </div>
            <h1 className="logo-title">TASKFLOW</h1>
            <span className="logo-badge">PRO</span>
          </div>
          
          <div className="header-actions">
            <button className="neobrutalist-header-btn" title="Back" onClick={() => addToast("Already at root workspace.", "info")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <div className="neobrutalist-header-btn bell-btn" title="Notifications" onClick={() => addToast("No new notifications.", "info")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <div className="user-profile">
              <div className="avatar-box">AP</div>
              <div className="user-details">
                <span className="user-name">Anjali Patel</span>
                <span className="user-role">ADMIN</span>
              </div>
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          <div className="sidebar-column">
            <div className="dashboard-card stat-panel">
              <h3>Stats</h3>
              <StatsDashboard tasks={tasks} />
            </div>

            <div className="dashboard-card form-panel">
              <h3>Create Task</h3>
              <TaskForm fetchTask={fetchTasks} addToast={addToast} />
            </div>
          </div>

          <div className="main-column">
            <div className="dashboard-card main-list-card">
              <div className="list-card-header">
                <h2>Tasks</h2>
                <span className="task-count-pill">{tasks.length} Total</span>
              </div>
              {loading && tasks.length === 0 ? (
                <div className="loader-container">
                  <div className="spinner"></div>
                  <p>Fetching tasks...</p>
                </div>
              ) : fetchError ? (
                <div className="empty-state">
                  <div className="warning-icon-wrapper neobrutalist-warning-icon" style={{ margin: '0 auto 12px auto' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                  <h4>Server Connection Offline</h4>
                  <p>Unable to connect to the database server. Please make sure the backend is running.</p>
                  <button onClick={fetchTasks} className="btn btn-danger btn-sm" style={{ marginTop: '12px', cursor: 'pointer' }}>
                    Retry Connection
                  </button>
                </div>
              ) : (
                <TaskList 
                  tasks={tasks} 
                  onEdit={setEditingTask} 
                  onDelete={setDeletingTaskId} 
                  onStatusChange={handleStatusChange} 
                />
              )}
            </div>
          </div>
        </main>

        {editingTask && (
          <div className="modal-overlay">
            <div className="modal-card neobrutalist-modal">
              <div className="modal-header">
                <h3>Edit Task</h3>
                <button onClick={() => setEditingTask(null)} className="close-btn neobrutalist-close-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="modal-body">
                <TaskForm 
                  fetchTask={fetchTasks} 
                  initialTask={editingTask} 
                  onClose={() => setEditingTask(null)} 
                  addToast={addToast} 
                />
              </div>
            </div>
          </div>
        )}

        {deletingTaskId && (
          <div className="modal-overlay">
            <div className="modal-card confirm-modal neobrutalist-modal">
              <div className="modal-header">
                <h3>Delete Task</h3>
                <button onClick={() => setDeletingTaskId(null)} className="close-btn neobrutalist-close-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="modal-body text-center">
                <div className="warning-icon-wrapper neobrutalist-warning-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <h4>Delete Task permanently?</h4>
                <p>This action cannot be undone. The task will be removed from your database.</p>
                <div className="modal-actions">
                  <button onClick={() => setDeletingTaskId(null)} className="btn btn-secondary">Cancel</button>
                  <button onClick={confirmDeleteTask} className="btn btn-danger">Confirm Delete</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </div>
  );
};

export default App;