import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { 
  ArrowUpRight, ArrowDownRight, Zap, Package, Gauge, MoreHorizontal, 
  TrendingUp, TrendingDown 
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const performanceData = [
  { name: 'Mon', value: 30 },
  { name: 'Tue', value: 45 },
  { name: 'Wed', value: 38 },
  { name: 'Thu', value: 65 },
  { name: 'Fri', value: 50 },
  { name: 'Sat', value: 85 },
  { name: 'Sun', value: 92 },
];

const productivityData = [
  { name: 'Design', value: 84 },
  { name: 'Dev', value: 120 },
  { name: 'QA', value: 72 },
];

const MetricCard = ({ title, value, unit, change, icon: Icon, color, trend }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-200 transition-colors"
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
      <span className="text-3xl font-bold text-slate-900">{value}</span>
      {unit && <span className="text-slate-400 text-sm font-medium">{unit}</span>}
    </div>

    <div className={cn(
      "flex items-center gap-1 mt-2 text-xs font-bold",
      trend === 'up' ? "text-emerald-600" : "text-rose-600"
    )}>
      {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
      {change}
    </div>
  </motion.div>
);

import { TopBar } from './TopBar';

export const Analytics: React.FC<{ onTabChange: (tab: string) => void, onMenuClick: () => void }> = ({ onTabChange, onMenuClick }) => {
  return (
    <div className="space-y-8 pb-12">
      <TopBar 
        title="Analytics Intelligence" 
        onProfileClick={() => onTabChange('team')} 
        onMenuClick={onMenuClick}
        showSearch={true}
      />

      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Performance Overview</h2>
          <p className="text-slate-500 text-sm mt-1">Real-time performance metrics and task distribution.</p>
        </div>
        <div className="flex gap-3">
          <select className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Month</option>
          </select>
          <button className="px-5 py-2 bg-[#006644] text-white rounded-xl text-sm font-semibold hover:bg-[#005236] transition-colors shadow-md shadow-emerald-200">
            Export JSON
          </button>
        </div>
      </header>

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard 
          title="Efficiency" 
          value="88" 
          unit="%" 
          change="+2% vs last week" 
          icon={Zap} 
          color="green" 
          trend="up"
        />
        <MetricCard 
          title="Output" 
          value="145" 
          unit="units" 
          change="-1% vs last week" 
          icon={Package} 
          color="emerald" 
          trend="down"
        />
        <MetricCard 
          title="Velocity" 
          value="3.2" 
          unit="pts/day" 
          change="+0.5% vs last week" 
          icon={Gauge} 
          color="green" 
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project Performance Spline Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Project Performance</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-900">92%</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full flex items-center gap-1">
                  <TrendingUp size={12} /> +5%
                </span>
                <span className="text-xs text-slate-400 font-medium ml-2">Last 30 Days</span>
              </div>
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                   <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#006644" stopOpacity={0.2}/>
                     <stop offset="95%" stopColor="#006644" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} 
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#006644', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#006644" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Promo / Action Card */}
        <div className="bg-gradient-to-br from-[#006644] to-[#004e33] p-8 rounded-[32px] text-white flex flex-col justify-between shadow-xl shadow-emerald-200/50">
          <div>
            <h4 className="text-xl font-bold mb-3 leading-tight">Generate Custom Report</h4>
            <p className="text-emerald-100/70 text-sm leading-relaxed">
              Need deeper insights? Create a comprehensive PDF report with advanced filtering and historical comparisons.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
               <div className="w-4/5 h-full bg-emerald-400" />
            </div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-200">80% of storage used</p>
            <button className="w-full bg-white text-[#006644] py-4 rounded-2xl font-bold hover:bg-slate-50 transition-colors shadow-lg active:scale-[0.98]">
              Create Report
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Team Productivity */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
          <div className="flex flex-col mb-8">
            <h3 className="font-bold text-slate-900 text-lg">Team Productivity</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900">120 <span className="text-sm text-slate-400 font-medium">hrs</span></span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full flex items-center gap-1">
                <TrendingUp size={12} /> +10%
              </span>
              <span className="text-xs text-slate-400 font-medium ml-2">This Week</span>
            </div>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productivityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} 
                />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none' }} />
                <Bar dataKey="value" radius={[12, 12, 4, 4]} barSize={50}>
                  {productivityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 1 ? '#006644' : index === 0 ? '#10B981' : '#a0f4c8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Distribution */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col">
          <div className="flex flex-col mb-8">
            <h3 className="font-bold text-slate-900 text-lg">Task Distribution</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900">45</span>
              <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-full flex items-center gap-1">
                <TrendingDown size={12} /> -2%
              </span>
              <span className="text-xs text-slate-400 font-medium ml-2">This Week</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-8">
             {[
               { label: 'High', value: 35, color: 'bg-rose-500' },
               { label: 'Medium', value: 65, color: 'bg-[#006644]' },
               { label: 'Low', value: 45, color: 'bg-slate-300' },
             ].map((track) => (
               <div key={track.label} className="space-y-2">
                 <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                   <span>{track.label}</span>
                   <span className="text-slate-900">{track.value}%</span>
                 </div>
                 <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden border border-slate-100/50">
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
