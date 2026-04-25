import React, { useState } from 'react';
import { X, Calendar, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Status, Task } from '../types';

interface TaskCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (task: Omit<Task, 'id'>) => void;
}

export const TaskCreationModal: React.FC<TaskCreationModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<Status>('Pending');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;
    
    onCreate({
      title,
      status,
      description,
      dueDate: dueDate || 'No Date',
      assignee: { name: 'Me', initials: 'JD' } // Defaulting to current user for simplicity as per request to remove selection
    });

    // Reset fields
    setTitle('');
    setStatus('Pending');
    setDescription('');
    setDueDate('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full max-w-md bg-white z-[101] shadow-2xl overflow-y-auto flex flex-col rounded-l-[40px]"
          >
            <div className="p-8 border-b border-slate-50 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Task Creation</h2>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-medium">Add new entry to system</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-slate-300 hover:text-slate-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 p-8 space-y-8">
               <div className="space-y-4">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-900 ml-1">Task Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Update primary navigation"
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006644]/5 focus:border-[#006644] transition-all placeholder:text-slate-300"
                  />
               </div>

               <div className="space-y-4">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-900 ml-1">Status</label>
                  <div className="flex flex-wrap gap-3">
                    {['Pending', 'In Progress', 'Completed'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatus(s as Status)}
                        className={cn(
                            "px-5 py-2.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-2",
                            status === s 
                                ? "bg-emerald-50 border-[#006644] text-[#006644]" 
                                : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                        )}
                      >
                        <span className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            s === 'Completed' ? "bg-emerald-500" : s === 'Pending' ? "bg-[#006644]" : s === 'In Progress' ? "bg-blue-500" : "bg-rose-500"
                        )} />
                        {s}
                      </button>
                    ))}
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-900">Description</label>
                  </div>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detail the requirements and acceptance criteria..."
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006644]/5 focus:border-[#006644] transition-all placeholder:text-slate-300 min-h-[120px] resize-none"
                  />
               </div>

               <div className="space-y-4">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-900 ml-1">Due Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                        type="text" 
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        placeholder="e.g. Oct 24, 2025" 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006644]/5 focus:border-[#006644] transition-all"
                    />
                  </div>
               </div>
            </div>

            <div className="p-8 border-t border-slate-50">
               <button 
                  onClick={handleSubmit}
                  disabled={!title.trim()}
                  className="w-full bg-[#006644] hover:bg-[#005236] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-semibold transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 group"
                >
                  <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                  Create Task
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
