import React, { useEffect, useRef } from 'react';
import { Search, Bell, Calendar, Clock, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { cn } from '../lib/utils';
import { Task } from '../types';
import { TopBar } from './TopBar';

const TaskCard: React.FC<{ task: Task, onClick: () => void }> = ({ task, onClick }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    onClick={onClick}
    className="bg-white p-6 rounded-[32px] border border-slate-100 space-y-4 hover:shadow-xl transition-all cursor-pointer relative group flex flex-col justify-between h-full task-card shadow-sm hover:-translate-y-1 block"
  >
    <div className="space-y-4 flex-1">
        <div className="flex justify-between items-start">
        <span className={cn(
            "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5",
            task.status === 'In Progress' ? "bg-emerald-50 text-emerald-600" : 
            task.status === 'Pending' ? "bg-blue-50 text-blue-600" :
            task.status === 'Completed' ? "bg-slate-50 text-slate-400" :
            "bg-slate-100 text-slate-400"
        )}>
            <span className={cn("w-2 h-2 rounded-full", 
            task.status === 'In Progress' ? "bg-emerald-500" : 
            task.status === 'Pending' ? "bg-blue-500" :
            task.status === 'Completed' ? "bg-slate-400" :
            "bg-slate-300"
            )} />
            {task.status}
        </span>
        <button 
            className="text-[10px] font-bold uppercase tracking-widest text-[#006644] bg-emerald-50 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-100"
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
        >
            Details
        </button>
        </div>
        
        <div>
        <h3 className="font-bold text-slate-900 leading-snug text-lg">{task.title}</h3>
        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed font-medium">{task.description}</p>
        </div>
    </div>

    <div className="pt-4 border-t border-slate-50 flex justify-between items-center mt-auto">
      <div className="flex items-center gap-2 text-slate-400">
        {task.dueDate ? (
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <Clock size={14} />
            <span>{task.dueDate}</span>
          </div>
        ) : (
             <div className="flex items-center gap-1.5 text-xs font-semibold">
                <Calendar size={14} />
                <span>{task.date || 'No Date'}</span>
             </div>
        )}
      </div>
      {task.assignee ? (
        <div className="flex items-center gap-2">
            {task.assignee.avatar ? (
                <img src={task.assignee.avatar} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" alt="" />
            ) : (
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm ring-2 ring-white">
                    {task.assignee.initials}
                </div>
            )}
        </div>
      ) : (
         <div className="w-8 h-8 rounded-full bg-slate-50 border-2 border-white" />
      )}
    </div>
  </motion.div>
);


// ... (TaskCard component) ...

export const Tasks: React.FC<{ 
  tasks: Task[], 
  onNewTask: () => void, 
  onTaskClick: (task: Task) => void,
  onProfileClick: () => void,
  onMenuClick: () => void
}> = ({ tasks, onNewTask, onTaskClick, onProfileClick, onMenuClick }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('All');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
        gsap.fromTo(".task-card", 
            { opacity: 0, y: 30, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, stagger: 0.05, duration: 0.6, ease: "power2.out", clearProps: "all" }
        );
    }
  }, [statusFilter, searchQuery]);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-10 pb-12" ref={containerRef}>
      <TopBar 
        onProfileClick={onProfileClick} 
        onMenuClick={onMenuClick}
        searchQuery={searchQuery} 
        onSearch={setSearchQuery} 
      />

      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
           <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm w-full md:w-auto overflow-x-auto custom-scrollbar">
             {['All', 'In Progress', 'Pending', 'Completed'].map(s => (
               <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex-1 md:flex-none whitespace-nowrap",
                  statusFilter === s ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10" : "text-slate-400 hover:text-slate-900"
                )}
               >
                 {s}
               </button>
             ))}
           </div>

           <div className="hidden lg:flex items-center gap-6 bg-white p-3 px-6 rounded-3xl border border-slate-100 shadow-sm">
             <div className="w-32 bg-slate-100 h-2 rounded-full relative overflow-hidden">
                <div className="absolute left-0 top-0 h-full bg-[#006644] rounded-full transition-all duration-500" style={{ width: filteredTasks.length > 0 ? `${(filteredTasks.filter(t => t.status === 'Completed').length / filteredTasks.length) * 100}%` : '0%' }} />
             </div>
             <span className="text-xs font-bold text-[#006644]">{filteredTasks.length > 0 ? Math.round((filteredTasks.filter(t => t.status === 'Completed').length / filteredTasks.length) * 100) : 0}% Done</span>
           </div>
        </div>

        <motion.button 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onNewTask}
          className="w-full md:w-auto px-8 py-3.5 bg-[#006644] text-white rounded-2xl text-sm font-bold shadow-lg shadow-emerald-900/20 hover:bg-[#005236] transition-all flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Create Task
        </motion.button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {filteredTasks.map(task => (
           <TaskCard key={task._id} task={task} onClick={() => onTaskClick(task)} />
        ))}
        <motion.button 
          whileHover={{ scale: 0.98 }}
          onClick={onNewTask}
          className="bg-transparent border-2 border-dashed border-slate-200 p-6 rounded-[32px] flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-slate-300 hover:text-slate-500 transition-all min-h-[220px]"
        >
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
            <Plus size={24} />
          </div>
          <span className="font-semibold">Create New Task</span>
        </motion.button>
      </div>
    </div>
  );
};
