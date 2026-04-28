import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import {
  ArrowUpRight, ArrowDownRight, Zap, Package, Gauge,
  TrendingUp, TrendingDown, Menu, Download
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Task } from '../types';

// ─── Helpers ───────────────────────────────────────────────────────────────────

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Get a Date object from any task date field */
const parseTaskDate = (task: Task): Date | null => {
  const raw = task.dueDate || task.date;
  if (!raw || raw === 'No Date') return null;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
};

/** Check if a date falls within the last N days from now */
const withinDays = (d: Date, n: number): boolean => {
  const now = new Date();
  const cutoff = new Date(now.getTime() - n * 86400000);
  return d >= cutoff;
};

// ─── MetricCard ────────────────────────────────────────────────────────────────

const MetricCard = ({ title, value, unit, change, icon: Icon, color, trend }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group hover:border-emerald-200 dark:hover:border-emerald-900 transition-colors"
  >
    <div className={cn(
      "absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity",
      color === 'green' ? "bg-[#006644]" : color === 'emerald' ? "bg-emerald-600" : "bg-rose-600"
    )} />

    <div className="flex items-center gap-2 mb-4">
      <div className={cn(
        "p-2 rounded-lg",
        color === 'green' ? "bg-emerald-50 text-[#006644]" : color === 'emerald' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
      )}>
        <Icon size={18} />
      </div>
      <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">{title}</h3>
    </div>

    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-bold text-slate-900 dark:text-white">{value}</span>
      {unit && <span className="text-slate-400 text-sm font-medium">{unit}</span>}
    </div>

    <div className={cn(
      "flex items-center gap-1 mt-2 text-xs font-bold",
      trend === 'up' ? "text-emerald-600" : trend === 'down' ? "text-rose-600" : "text-slate-400"
    )}>
      {trend === 'up' ? <ArrowUpRight size={14} /> : trend === 'down' ? <ArrowDownRight size={14} /> : null}
      {change}
    </div>
  </motion.div>
);

// ─── Main Component ────────────────────────────────────────────────────────────

export const Analytics: React.FC<{
  tasks: Task[];
  onMenuClick: () => void;
}> = ({ tasks, onMenuClick }) => {
  const [range, setRange] = useState<number>(7);

  // ── Computed metrics ──────────────────────────────────────────────────────

  const metrics = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const pending = tasks.filter(t => t.status === 'Pending').length;

    const efficiency = total > 0 ? Math.round((completed / total) * 100) : 0;
    const velocity = range > 0 ? +(completed / range).toFixed(1) : 0;

    return { total, completed, inProgress, pending, efficiency, velocity };
  }, [tasks, range]);

  // ── 7-day / 30-day performance trend ──────────────────────────────────────

  const performanceData = useMemo(() => {
    const days: { name: string; completed: number; created: number }[] = [];
    const now = new Date();

    for (let i = range - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const dayStr = d.toISOString().split('T')[0];
      const label = range <= 7
        ? dayNames[d.getDay()]
        : `${d.getDate()}/${d.getMonth() + 1}`;

      const completedCount = tasks.filter(t => {
        if (t.status !== 'Completed') return false;
        const td = parseTaskDate(t);
        return td && td.toISOString().split('T')[0] === dayStr;
      }).length;

      const createdCount = tasks.filter(t => {
        const raw = (t as any).createdAt;
        if (!raw) return false;
        const cd = new Date(raw);
        return !isNaN(cd.getTime()) && cd.toISOString().split('T')[0] === dayStr;
      }).length;

      days.push({ name: label, completed: completedCount, created: createdCount });
    }
    return days;
  }, [tasks, range]);

  // ── Priority distribution ─────────────────────────────────────────────────

  const priorityData = useMemo(() => {
    const counts = { Low: 0, Medium: 0, High: 0, Urgent: 0 };
    tasks.forEach(t => {
      const p = t.priority || 'Medium';
      if (p in counts) counts[p as keyof typeof counts]++;
    });
    const total = tasks.length || 1;
    return [
      { label: 'Urgent', value: Math.round((counts.Urgent / total) * 100), color: 'bg-rose-500' },
      { label: 'High',   value: Math.round((counts.High / total) * 100),   color: 'bg-orange-500' },
      { label: 'Medium', value: Math.round((counts.Medium / total) * 100), color: 'bg-[#006644]' },
      { label: 'Low',    value: Math.round((counts.Low / total) * 100),    color: 'bg-sky-400' },
    ];
  }, [tasks]);

  // ── Status bar chart data ─────────────────────────────────────────────────

  const statusData = useMemo(() => [
    { name: 'Completed',   value: metrics.completed },
    { name: 'In Progress', value: metrics.inProgress },
    { name: 'Pending',     value: metrics.pending },
  ], [metrics]);

  const statusColors = ['#006644', '#10B981', '#94a3b8'];

  // ── Export handler ────────────────────────────────────────────────────────

  const handleExport = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      range: `Last ${range} days`,
      metrics,
      tasks: tasks.map(t => ({
        title: t.title,
        status: t.status,
        priority: t.priority || 'Medium',
        dueDate: t.dueDate || 'No Date',
      })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-sm transition-all active:scale-95"
          >
            <Menu size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Analytics Intelligence</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Real-time performance metrics from your tasks.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-between items-center">
          <div className="flex gap-2">
            {[
              { label: 'Last 7 Days', val: 7 },
              { label: 'Last 30 Days', val: 30 },
            ].map(opt => (
              <button
                key={opt.val}
                onClick={() => setRange(opt.val)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                  range === opt.val
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button
            onClick={handleExport}
            className="px-5 py-2 bg-[#006644] text-white rounded-xl text-sm font-semibold hover:bg-[#005236] transition-colors shadow-md shadow-emerald-200 flex items-center gap-2"
          >
            <Download size={14} />
            Export JSON
          </button>
        </div>
      </header>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Completion Rate"
          value={metrics.efficiency}
          unit="%"
          change={metrics.efficiency >= 50 ? 'On track' : 'Needs attention'}
          icon={Zap}
          color="green"
          trend={metrics.efficiency >= 50 ? 'up' : 'down'}
        />
        <MetricCard
          title="Completed"
          value={metrics.completed}
          unit={`of ${metrics.total}`}
          change={`${metrics.pending} pending`}
          icon={Package}
          color="emerald"
          trend={metrics.completed > metrics.pending ? 'up' : 'down'}
        />
        <MetricCard
          title="Velocity"
          value={metrics.velocity}
          unit="tasks/day"
          change={`Over ${range} days`}
          icon={Gauge}
          color="green"
          trend={metrics.velocity >= 1 ? 'up' : 'neutral'}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Trend */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-[32px] border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Task Activity</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.completed}</span>
                <span className="text-sm text-slate-400 font-medium">completed</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full flex items-center gap-1">
                  <TrendingUp size={12} /> {range}d
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5 text-[#006644]"><span className="w-2 h-2 rounded-full bg-[#006644]" />Completed</span>
              <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400" />Created</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#006644" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#006644" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="completed" stroke="#006644" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" />
                <Area type="monotone" dataKey="created" stroke="#10B981" strokeWidth={2} strokeDasharray="6 3" fillOpacity={1} fill="url(#colorCreated)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-linear-to-br from-[#006644] to-[#004e33] p-8 rounded-[32px] text-white flex flex-col justify-between shadow-xl shadow-emerald-200/50">
          <div>
            <h4 className="text-xl font-bold mb-3 leading-tight">Quick Summary</h4>
            <p className="text-emerald-100/70 text-sm leading-relaxed">
              You have <span className="text-white font-bold">{metrics.total}</span> total tasks.
              <span className="text-white font-bold"> {metrics.completed}</span> completed,
              <span className="text-white font-bold"> {metrics.inProgress}</span> in progress, and
              <span className="text-white font-bold"> {metrics.pending}</span> pending.
            </p>
          </div>
          <div className="space-y-4 mt-6">
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full transition-all duration-700" style={{ width: `${metrics.efficiency}%` }} />
            </div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-200">{metrics.efficiency}% completion rate</p>
            <button
              onClick={handleExport}
              className="w-full bg-white text-[#006644] py-4 rounded-2xl font-bold hover:bg-slate-50 transition-colors shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Status Breakdown */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[32px] border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex flex-col mb-8">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Status Breakdown</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.total}</span>
              <span className="text-sm text-slate-400 font-medium">tasks</span>
            </div>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none' }} />
                <Bar dataKey="value" radius={[12, 12, 4, 4]} barSize={50}>
                  {statusData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={statusColors[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[32px] border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
          <div className="flex flex-col mb-8">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Priority Distribution</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.total}</span>
              <span className="text-sm text-slate-400 font-medium">tasks</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-8">
            {priorityData.map(track => (
              <div key={track.label} className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                  <span>{track.label}</span>
                  <span className="text-slate-900 dark:text-white">{track.value}%</span>
                </div>
                <div className="w-full bg-slate-50 dark:bg-slate-700 h-3 rounded-full overflow-hidden border border-slate-100/50 dark:border-slate-600/50">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${track.value}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={cn("h-full rounded-full", track.color)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
