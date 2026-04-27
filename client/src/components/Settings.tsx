import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Menu, Moon, Sun, Bell, Globe, Shield, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';

interface SettingsProps {
  onLogout: () => void;
  onMenuClick: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onLogout, onMenuClick }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [language, setLanguage] = useState('English');

  const Toggle: React.FC<{ enabled: boolean; onToggle: () => void }> = ({ enabled, onToggle }) => (
    <button
      onClick={onToggle}
      className={cn(
        "relative w-12 h-7 rounded-full transition-colors",
        enabled ? "bg-[#006644]" : "bg-slate-200"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform",
          enabled ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm transition-all active:scale-95"
        >
          <Menu size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Configure your application preferences.</p>
        </div>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm space-y-6"
        >
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            {darkMode ? <Moon size={20} /> : <Sun size={20} />}
            Appearance
          </h3>
          <div className="flex items-center justify-between py-3 border-b border-slate-50">
            <div>
              <p className="text-sm font-semibold text-slate-900">Dark Mode</p>
              <p className="text-xs text-slate-400 mt-0.5">Use dark theme across the application</p>
            </div>
            <Toggle enabled={darkMode} onToggle={() => setDarkMode(!darkMode)} />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Language</p>
              <p className="text-xs text-slate-400 mt-0.5">Select your preferred language</p>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm space-y-6"
        >
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Bell size={20} />
            Notifications
          </h3>
          <div className="flex items-center justify-between py-3 border-b border-slate-50">
            <div>
              <p className="text-sm font-semibold text-slate-900">Push Notifications</p>
              <p className="text-xs text-slate-400 mt-0.5">Receive task reminders and updates</p>
            </div>
            <Toggle enabled={notifications} onToggle={() => setNotifications(!notifications)} />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Email Alerts</p>
              <p className="text-xs text-slate-400 mt-0.5">Get email notifications for overdue tasks</p>
            </div>
            <Toggle enabled={emailAlerts} onToggle={() => setEmailAlerts(!emailAlerts)} />
          </div>
        </motion.div>

        {/* Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm space-y-6"
        >
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Shield size={20} />
            Privacy & Security
          </h3>
          <div className="flex items-center justify-between py-3 border-b border-slate-50">
            <div>
              <p className="text-sm font-semibold text-slate-900">Profile Visibility</p>
              <p className="text-xs text-slate-400 mt-0.5">Control who can see your profile</p>
            </div>
            <select className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
              <option>Private</option>
              <option>Public</option>
            </select>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Data Export</p>
              <p className="text-xs text-slate-400 mt-0.5">Download all your data in JSON format</p>
            </div>
            <button className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
              Export
            </button>
          </div>
        </motion.div>

        {/* Sign Out */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-6">Account Actions</h3>
          <button
            onClick={onLogout}
            className="w-full md:w-auto px-8 py-3.5 bg-rose-50 text-rose-600 font-semibold rounded-xl hover:bg-rose-100 hover:text-rose-700 transition-colors flex items-center gap-2"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </motion.div>
      </div>
    </div>
  );
};
