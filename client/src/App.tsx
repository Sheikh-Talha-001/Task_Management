/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/DashboardOverview';
import { Tasks } from './components/Tasks';
import { Analytics } from './components/Analytics';
import { Team } from './components/Team';
import { Auth } from './components/Auth';
import { TaskCreationModal } from './components/TaskCreationModal';
import { TaskDetails } from './components/TaskDetails';
import { motion, AnimatePresence } from 'motion/react';
import { Task } from './types';
import api from './lib/api';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }

    const handleAuthError = () => {
      setIsAuthenticated(false);
      setActiveTab('dashboard');
    };

    window.addEventListener('auth-error', handleAuthError);
    return () => window.removeEventListener('auth-error', handleAuthError);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchTasks = async () => {
        try {
          const { data } = await api.get('/tasks');
          setTasks(data);
        } catch (error) {
          console.error("Failed to fetch tasks:", error);
        }
      };
      fetchTasks();
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setActiveTab('dashboard');
    setIsSidebarOpen(false);
  };

  const handleCreateTask = async (newTask: Omit<Task, '_id'>) => {
    try {
      const { data } = await api.post('/tasks', newTask);
      setTasks(prev => [data, ...prev]);
      setIsNewTaskModalOpen(false);
      setActiveTab('tasks');
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      const { data } = await api.put(`/tasks/${updatedTask._id}`, updatedTask);
      setTasks(prev => prev.map(t => t._id === updatedTask._id ? data : t));
      setSelectedTask(null);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="flex bg-[#f8fafc] min-h-screen font-sans selection:bg-emerald-600/10 selection:text-emerald-600 overflow-x-hidden">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          setActiveTab(tab);
          setIsSidebarOpen(false);
        }} 
        onNewTask={() => {
          setIsNewTaskModalOpen(true);
          setIsSidebarOpen(false);
        }}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="flex-1 lg:ml-72 p-4 md:p-10 max-w-[1440px] mx-auto w-full transition-all">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && <Dashboard tasks={tasks} onTabChange={setActiveTab} onMenuClick={() => setIsSidebarOpen(true)} />}
            {activeTab === 'tasks' && (
              <Tasks 
                tasks={tasks} 
                onNewTask={() => setIsNewTaskModalOpen(true)} 
                onTaskClick={setSelectedTask} 
                onProfileClick={() => setActiveTab('team')}
                onMenuClick={() => setIsSidebarOpen(true)}
              />
            )}
            {activeTab === 'analytics' && <Analytics onTabChange={setActiveTab} onMenuClick={() => setIsSidebarOpen(true)} />}
            {activeTab === 'team' && <Team tasks={tasks} onTabChange={setActiveTab} onMenuClick={() => setIsSidebarOpen(true)} />}
            {activeTab === 'settings' && (() => {
              const userStr = localStorage.getItem('user');
              const user = userStr ? JSON.parse(userStr) : null;
              
              return (
                <div className="max-w-2xl mx-auto space-y-8">
                  <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-emerald-500/20 shrink-0">
                      {user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U')}
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-2">
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{user?.name || 'User'}</h2>
                      <p className="text-slate-500 font-medium">{user?.email}</p>
                      <div className="pt-4 flex gap-4 justify-center md:justify-start">
                        <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Total Tasks</span>
                          <span className="text-xl font-bold text-slate-900">{tasks.length}</span>
                        </div>
                        <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 block mb-1">Completed</span>
                          <span className="text-xl font-bold text-emerald-700">{tasks.filter(t => t.status === 'Completed').length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                     <h3 className="text-lg font-bold text-slate-900 mb-6">Account Actions</h3>
                     <button 
                        onClick={handleLogout}
                        className="w-full md:w-auto px-8 py-3.5 bg-rose-50 text-rose-600 font-semibold rounded-xl hover:bg-rose-100 hover:text-rose-700 transition-colors"
                      >
                        Sign Out
                      </button>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        </AnimatePresence>
      </main>

      <TaskCreationModal 
        isOpen={isNewTaskModalOpen} 
        onClose={() => setIsNewTaskModalOpen(false)}
        onCreate={handleCreateTask}
      />

      <AnimatePresence>
        {selectedTask && (
          <TaskDetails 
            task={selectedTask} 
            onClose={() => setSelectedTask(null)} 
            onUpdate={handleUpdateTask}
          />
        )}
      </AnimatePresence>

      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: '#fff',
            color: '#0f172a',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            fontWeight: 600,
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' }
          },
          error: {
            iconTheme: { primary: '#f43f5e', secondary: '#fff' }
          }
        }} 
      />
    </div>
  );
}

