
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, LineChart, Line, Legend 
} from 'recharts';
import { NTB_REGENCIES, RESEARCH_CATEGORIES } from '../constants';
import { PermitStatus, ResearchPermit } from '../types';

const COLORS = [
  '#6366f1', // Indigo (Sosial)
  '#10b981', // Emerald (Pendidikan)
  '#f59e0b', // Amber (Ekonomi)
  '#8b5cf6', // Violet (Agama)
  '#22c55e', // Green (Lingkungan)
  '#ef4444', // Rose (Politik)
  '#06b6d4', // Cyan (Teknologi)
  '#ec4899'  // Pink (Kesehatan)
];

const StatCard: React.FC<{ title: string; value: number | string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className={`bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 transition-all hover:shadow-md relative overflow-hidden group`}>
    <div className={`absolute top-0 left-0 w-1.5 h-full ${color}`}></div>
    <div className="flex justify-between items-center">
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-800">{value}</h3>
      </div>
      <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-indigo-600 transition-colors">
        {icon}
      </div>
    </div>
  </div>
);

const Dashboard: React.FC<{ permits: ResearchPermit[] }> = ({ permits }) => {
  const yearlyStats = useMemo(() => {
    const years = [2023, 2024, 2025, 2026];
    return years.map(year => ({
      name: year.toString(),
      total: permits.filter(p => p.year === year).length,
      approved: permits.filter(p => p.year === year && p.status === PermitStatus.APPROVED).length
    }));
  }, [permits]);

  const categoryData = useMemo(() => {
    return RESEARCH_CATEGORIES.map((cat, index) => {
      const count = permits.filter(p => p.category === cat).length;
      const percentage = permits.length > 0 ? ((count / permits.length) * 100).toFixed(1) : "0";
      return {
        name: cat,
        value: count,
        percentage: percentage,
        color: COLORS[index % COLORS.length]
      };
    }).sort((a, b) => b.value - a.value);
  }, [permits]);

  const regencyStats = useMemo(() => {
    return NTB_REGENCIES.map(reg => ({
      name: reg,
      value: permits.filter(p => p.researchLocation === reg).length
    })).sort((a, b) => b.value - a.value);
  }, [permits]);

  const totals = useMemo(() => ({
    total: permits.length,
    approved: permits.filter(p => p.status === PermitStatus.APPROVED).length,
    pending: permits.filter(p => p.status === PermitStatus.PENDING).length,
    rejected: permits.filter(p => p.status === PermitStatus.REJECTED).length,
  }), [permits]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Permohonan" 
          value={totals.total} 
          color="bg-indigo-500" 
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>} 
        />
        <StatCard 
          title="Izin Terbit" 
          value={totals.approved} 
          color="bg-emerald-500" 
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>} 
        />
        <StatCard 
          title="Menunggu" 
          value={totals.pending} 
          color="bg-amber-500" 
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>} 
        />
        <StatCard 
          title="Ditolak" 
          value={totals.rejected} 
          color="bg-rose-500" 
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>} 
        />
      </div>

      {/* Category Analysis Panel */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h4 className="text-2xl font-black text-slate-800 tracking-tight">Analisis Bidang Penelitian</h4>
            <p className="text-slate-500 text-sm">Distribusi izin penelitian berdasarkan kategori keilmuan</p>
          </div>
          <div className="hidden sm:flex gap-2">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">Periode 2023 - 2026</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          <div className="lg:col-span-3 p-8">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{ left: 40, right: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={140} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 11, fontWeight: 'bold'}} 
                  />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}} 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                  />
                  <Bar dataKey="value" name="Jumlah Izin" radius={[0, 8, 8, 0]} barSize={24}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-50/50 p-8">
            <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Tabel Statistik Bidang</h5>
            <div className="space-y-4">
              {categoryData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs font-bold text-slate-700">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-black text-slate-800">{item.value}</span>
                    <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-lg">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-lg font-black text-slate-800 tracking-tight">Pertumbuhan Per Tahun</h4>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Terbit</span>
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearlyStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Line type="monotone" dataKey="total" name="Total Pengajuan" stroke="#6366f1" strokeWidth={4} dot={{r: 6, fill: '#6366f1', strokeWidth: 3, stroke: '#fff'}} activeDot={{r: 8}} />
                <Line type="monotone" dataKey="approved" name="Izin Terbit" stroke="#10b981" strokeWidth={4} dot={{r: 6, fill: '#10b981', strokeWidth: 3, stroke: '#fff'}} activeDot={{r: 8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h4 className="text-lg font-black text-slate-800 tracking-tight mb-8">Sebaran Lokasi Terpadat</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regencyStats.slice(0, 6)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} />
                <YAxis hide />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="value" name="Jumlah" radius={[8, 8, 0, 0]} barSize={40}>
                  {regencyStats.slice(0, 6).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
