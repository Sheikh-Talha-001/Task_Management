import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Briefcase, Clock, Image as ImageIcon, Check, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { Task } from '../types';
import { TopBar } from './TopBar';

export const Team: React.FC<{ tasks: Task[], onTabChange: (tab: string) => void, onMenuClick: () => void }> = ({ tasks, onTabChange, onMenuClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Alex Chen',
    role: 'Lead Product Designer at Evergrow',
    description: 'Based in San Francisco. Passionate about sustainable systems, user-centric flows, and bento-grid aesthetics. Currently leading the redesign effort for the Evergreen core platform.'
  });

  const completedTasks = tasks.filter(t => t.status === 'Completed').slice(0, 4);

  return (
    <div className="space-y-8 pb-12">
      <div className="space-y-2">
        <TopBar 
          onProfileClick={() => onTabChange('team')} 
          onMenuClick={onMenuClick}
          showSearch={false}
          title="My Profile"
        />
        <p className="text-slate-500 text-sm font-medium pl-1">Manage your professional identity and activity.</p>
      </div>

      {/* Profile Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-10 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10"
      >
        <div className="absolute top-0 left-0 w-full h-24 md:h-32 bg-gradient-to-r from-emerald-50 to-blue-50 opacity-60 z-0" />
        
        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 md:border-8 border-white shadow-xl z-10 shrink-0">
          <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&auto=format&fit=crop" 
            alt={profile.name} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 text-center md:text-left z-10 pt-2 md:pt-6">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div 
                key="editing"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <input 
                  type="text" 
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight bg-white/50 border-2 border-emerald-500/20 rounded-2xl px-4 py-2 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all"
                />
                <div className="flex items-center gap-2 text-emerald-700">
                  <Briefcase size={18} />
                  <input 
                    type="text" 
                    value={profile.role}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    className="w-full font-semibold text-sm bg-white/50 border-2 border-emerald-500/20 rounded-xl px-3 py-1 focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
                <textarea 
                  value={profile.description}
                  onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                  className="w-full text-slate-500 mt-4 leading-relaxed text-sm bg-white/50 border-2 border-emerald-500/20 rounded-2xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-all resize-none h-32 md:h-24"
                />
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-[#006644] text-white rounded-full font-bold shadow-lg shadow-emerald-900/10 hover:bg-[#005236] transition-all"
                  >
                    <Check size={18} />
                    Save Changes
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-full font-bold hover:bg-slate-50 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="viewing"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">{profile.name}</h2>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-3 text-emerald-700">
                  <Briefcase size={18} />
                  <span className="font-semibold text-sm">{profile.role}</span>
                </div>
                <p className="text-slate-500 max-w-2xl mt-4 leading-relaxed text-sm">
                  {profile.description}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="px-8 py-3.5 bg-[#006644] text-white rounded-full font-bold shadow-lg shadow-emerald-900/20 hover:scale-105 transition-transform active:scale-95"
                  >
                    Edit Profile
                  </button>
                  <button className="px-8 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-full font-bold hover:bg-slate-50 transition-colors">View Public</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-8">Recent Activity</h3>
          <div className="relative border-l-2 border-slate-50 ml-2 md:ml-4 space-y-10">
            {completedTasks.length > 0 ? completedTasks.map((task, i) => (
              <div key={task.id} className="relative pl-8">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#006644] ring-4 ring-white" />
                <div className="mb-1">
                  <span className="font-bold text-slate-900 text-sm">Completed {task.title}</span>
                </div>
                <div className="text-xs text-slate-500 mb-2">Moved to 'Completed'</div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 flex items-center gap-1">
                  <Clock size={12} />
                  {task.dueDate || task.date || 'Recently'}
                </div>
              </div>
            )) : (
                <p className="text-slate-400 text-sm italic pl-4">No recent completion activity.</p>
            )}

            <div className="relative pl-8">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-200 ring-4 ring-white" />
              <div className="mb-1">
                <span className="font-bold text-slate-900 text-sm">Joined Evergrow Workspace</span>
              </div>
              <div className="font-label-caps text-slate-400 text-[10px] tracking-widest flex items-center gap-1">
                <Clock size={12} />
                Sep 1, 2023
              </div>
            </div>
          </div>
          <button className="w-full mt-10 py-4 font-bold text-[#006644] hover:bg-emerald-50 rounded-2xl transition-colors border border-dashed border-emerald-100">
            View All Activity
          </button>
        </div>

        {/* Stats Grid */}
        <div className="space-y-8">
          <div className="bg-[#15171a] p-10 rounded-[40px] text-white">
            <h3 className="text-xl font-bold mb-8">Professional Stats</h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <span className="text-4xl font-bold">{tasks.length}</span>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Total Tasks</p>
              </div>
              <div className="space-y-2">
                <span className="text-4xl font-bold text-emerald-400">{tasks.filter(t => t.status === 'Completed').length}</span>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Solved</p>
              </div>
              <div className="space-y-2">
                <span className="text-4xl font-bold">12</span>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Projects</p>
              </div>
              <div className="space-y-2">
                <span className="text-4xl font-bold text-blue-400">98%</span>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">On Time</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[40px] border border-slate-100 flex items-center justify-between">
            <div>
                <h3 className="font-bold text-slate-900">Weekly Goal</h3>
                <p className="text-xs text-slate-500 mt-1">8 tasks remaining this week</p>
            </div>
            <div className="relative w-16 h-16 flex items-center justify-center">
                 <svg className="w-full h-full -rotate-90">
                    <circle 
                        cx="32" cy="32" r="28" 
                        stroke="#f1f5f9" strokeWidth="6" fill="none" 
                    />
                    <circle 
                        cx="32" cy="32" r="28" 
                        stroke="#006644" strokeWidth="6" fill="none" 
                        strokeDasharray={2 * Math.PI * 28}
                        strokeDashoffset={2 * Math.PI * 28 * 0.4}
                        strokeLinecap="round"
                    />
                 </svg>
                 <span className="absolute text-xs font-bold text-[#006644]">60%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
