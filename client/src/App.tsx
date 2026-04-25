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
            {activeTab === 'settings' && (
                <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">Project Settings</h2>
                    <p className="text-slate-500 max-w-sm">Configure your workspace, notification preferences, and API integrations.</p>
                </div>
            )}
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
    </div>
  );
}

