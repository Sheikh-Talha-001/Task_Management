import React from 'react';
import { LayoutDashboard, CheckSquare, Users, BarChart3, Settings, HelpCircle, Plus, LogOut, Leaf } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onNewTask: () => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onNewTask, onLogout, isOpen, onClose }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'team', label: 'Profile', icon: Users },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <div className={cn(
        "w-72 h-screen bg-white border-r border-slate-100 flex flex-col p-8 fixed left-0 top-0 z-[70] transition-transform duration-300 lg:translate-x-0 shadow-2xl lg:shadow-none",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between mb-10 pl-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
                  <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                </svg>
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">Donezo</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 -mr-2">
          <div className="mb-8">
            <h3 className="px-4 text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em] mb-4">Menu</h3>
            <nav className="space-y-1">
              {navItems.filter(i => ['dashboard', 'tasks', 'calendar', 'analytics', 'team'].includes(i.id)).map((item) => (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all group",
                    activeTab === item.id 
                      ? "bg-slate-50 text-slate-900 shadow-sm" 
                      : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} className={cn(
                        "transition-colors",
                        activeTab === item.id ? "text-slate-900" : "text-slate-400 group-hover:text-slate-900"
                    )} />
                    {item.label}
                  </div>
                  {item.id === 'tasks' && (
                    <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm shadow-emerald-500/20">12+</span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="mb-8">
            <h3 className="px-4 text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em] mb-4">General</h3>
            <nav className="space-y-1">
              {['settings', 'help', 'logout'].map((id) => {
                const label = id.charAt(0).toUpperCase() + id.slice(1);
                const Icon = id === 'settings' ? Settings : id === 'help' ? HelpCircle : LogOut;
                return (
                  <button
                    key={id}
                    onClick={() => id === 'logout' ? onLogout() : onTabChange(id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all group",
                      activeTab === id 
                        ? "bg-slate-50 text-slate-900 shadow-sm" 
                        : "text-slate-400 hover:text-slate-900 hover:bg-slate-50",
                      id === 'logout' && "text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                    )}
                  >
                    <Icon size={20} className={cn(
                        "transition-colors",
                        activeTab === id ? "text-slate-900" : id === 'logout' ? "text-rose-500" : "text-slate-400 group-hover:text-slate-900"
                    )} />
                    {label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};
