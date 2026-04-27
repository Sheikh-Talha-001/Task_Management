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
import { Settings } from './components/Settings';
import { Help } from './components/Help';
import { Auth } from './components/Auth';
import { TaskCreationModal } from './components/TaskCreationModal';
import { TaskDetails } from './components/TaskDetails';
import { motion, AnimatePresence } from 'motion/react';
import { Task } from './types';
import api from './lib/api';
import { Toaster } from 'react-hot-toast';
import { SettingsProvider } from './context/SettingsContext';

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
    <SettingsProvider>
    <div className="flex bg-[#f8fafc] dark:bg-slate-900 min-h-screen font-sans selection:bg-emerald-600/10 selection:text-emerald-600 overflow-x-hidden transition-colors duration-300">
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
        taskCount={tasks.length}
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
                onMenuClick={() => setIsSidebarOpen(true)}
              />
            )}
            {activeTab === 'analytics' && <Analytics tasks={tasks} onTabChange={setActiveTab} onMenuClick={() => setIsSidebarOpen(true)} />}
            {activeTab === 'team' && <Team tasks={tasks} onTabChange={setActiveTab} onMenuClick={() => setIsSidebarOpen(true)} />}
            {activeTab === 'settings' && <Settings onLogout={handleLogout} onMenuClick={() => setIsSidebarOpen(true)} />}
            {activeTab === 'help' && <Help onMenuClick={() => setIsSidebarOpen(true)} />}
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
    </SettingsProvider>
  );
}

