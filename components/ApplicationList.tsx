
import React, { useState } from 'react';
import { PermitStatus, ResearchPermit } from '../types';

const ApplicationList: React.FC<{ permits: ResearchPermit[], setPermits: React.Dispatch<React.SetStateAction<ResearchPermit[]>> }> = ({ permits, setPermits }) => {
  const [filter, setFilter] = useState('');
  const [detailPermit, setDetailPermit] = useState<ResearchPermit | null>(null);

  const handleStatusChange = (id: string, newStatus: PermitStatus) => {
    setPermits(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    setDetailPermit(null);
  };

  const pendingPermits = permits.filter(p => 
    p.status === PermitStatus.PENDING &&
    (p.applicantName.toLowerCase().includes(filter.toLowerCase()) || 
     p.university.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Antrean Verifikasi</h3>
            <p className="text-slate-500 text-sm">Validasi berkas & permohonan yang masuk.</p>
          </div>
          <div className="relative w-full md:w-80">
            <svg className="w-5 h-5 absolute left-4 top-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input 
              type="text" 
              placeholder="Cari pemohon / instansi..." 
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Pemohon & Kampus</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Judul Penelitian</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingPermits.length > 0 ? pendingPermits.map(permit => (
                <tr key={permit.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="text-sm font-black text-slate-800">{permit.applicantName}</div>
                    <div className="text-[11px] text-indigo-500 font-bold uppercase tracking-widest">{permit.university}</div>
                    <div className="mt-2 flex gap-2">
                       <span className="text-[9px] font-black bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-100 uppercase">Menunggu Validasi</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs text-slate-600 line-clamp-2 max-w-sm italic">"{permit.researchTitle}"</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setDetailPermit(permit)}
                        className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-100 transition-colors border border-indigo-100"
                        title="Lihat Detail"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                      </button>
                      <button 
                        onClick={() => handleStatusChange(permit.id, PermitStatus.APPROVED)} 
                        className="p-2.5 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all active:scale-95"
                        title="Setujui Cepat"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <p className="text-slate-800 font-black">Antrean Kosong</p>
                    <p className="text-slate-400 text-sm">Belum ada permohonan baru yang masuk.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {detailPermit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDetailPermit(null)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up">
            <div className="bg-indigo-600 p-8 text-white flex justify-between items-center">
              <div>
                <h4 className="text-2xl font-black">Detail Permohonan</h4>
                <p className="text-indigo-100 text-sm opacity-80">ID: {detailPermit.id}</p>
              </div>
              <button onClick={() => setDetailPermit(null)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                  <h5 className="font-black text-slate-800 uppercase tracking-widest text-xs">Identitas Peneliti</h5>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div><p className="text-[10px] font-bold text-slate-400 uppercase">Nama Lengkap</p><p className="font-bold text-slate-700">{detailPermit.applicantName}</p></div>
                  <div><p className="text-[10px] font-bold text-slate-400 uppercase">NIK</p><p className="font-bold text-slate-700">{detailPermit.idNumber}</p></div>
                  <div><p className="text-[10px] font-bold text-slate-400 uppercase">Email</p><p className="font-bold text-slate-700">{detailPermit.email}</p></div>
                  <div><p className="text-[10px] font-bold text-slate-400 uppercase">Nomor HP/WA</p><p className="font-bold text-slate-700">{detailPermit.phone}</p></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                  <h5 className="font-black text-slate-800 uppercase tracking-widest text-xs">Informasi Penelitian</h5>
                </div>
                <div className="space-y-4">
                  <div><p className="text-[10px] font-bold text-slate-400 uppercase">Universitas / Instansi</p><p className="font-bold text-slate-700">{detailPermit.university}</p></div>
                  <div><p className="text-[10px] font-bold text-slate-400 uppercase">Judul Penelitian</p><p className="font-bold text-slate-700 italic leading-relaxed">"{detailPermit.researchTitle}"</p></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div><p className="text-[10px] font-bold text-slate-400 uppercase">Lokasi</p><p className="font-bold text-slate-700">{detailPermit.researchLocation}</p></div>
                    <div><p className="text-[10px] font-bold text-slate-400 uppercase">Kategori</p><p className="font-bold text-slate-700">{detailPermit.category}</p></div>
                    <div><p className="text-[10px] font-bold text-slate-400 uppercase">Durasi</p><p className="font-bold text-slate-700">{detailPermit.duration}</p></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button 
                onClick={() => handleStatusChange(detailPermit.id, PermitStatus.APPROVED)}
                className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-black shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
              >
                Setujui
              </button>
              <button onClick={() => handleStatusChange(detailPermit.id, PermitStatus.REJECTED)} className="px-8 py-4 bg-white text-rose-500 border border-rose-100 rounded-2xl font-black hover:bg-rose-50 transition-all">
                Tolak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationList;
