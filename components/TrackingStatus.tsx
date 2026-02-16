
import React, { useState } from 'react';
import { ResearchPermit, PermitStatus } from '../types';

interface TrackingStatusProps {
  permits: ResearchPermit[];
  onPrint: (permit: ResearchPermit) => void;
}

const TrackingStatus: React.FC<TrackingStatusProps> = ({ permits, onPrint }) => {
  const [searchNIK, setSearchNIK] = useState('');
  const [result, setResult] = useState<ResearchPermit | null>(null);
  const [error, setError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    const found = permits.find(p => p.idNumber === searchNIK || p.id === searchNIK);
    if (found) {
      setResult(found);
    } else {
      setError('Data tidak ditemukan. Pastikan NIK atau ID Permohonan benar.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-slide-up no-print">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-indigo-100 border border-slate-100 text-center space-y-4">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <h3 className="text-2xl font-black text-slate-800">Lacak Status & Cetak Izin</h3>
        <p className="text-slate-500">Masukkan NIK atau ID Permohonan Anda untuk melihat status terbaru.</p>
        
        <form onSubmit={handleSearch} className="flex gap-2 mt-6">
          <input 
            type="text" 
            placeholder="Masukkan NIK (16 digit)..." 
            value={searchNIK}
            onChange={e => setSearchNIK(e.target.value)}
            className="flex-1 px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none transition-all font-bold"
          />
          <button type="submit" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
            Cari
          </button>
        </form>
        {error && <p className="text-rose-500 font-bold text-sm mt-2">{error}</p>}
      </div>

      {result && (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden animate-fade-in">
          <div className={`p-8 ${result.status === PermitStatus.APPROVED ? 'bg-emerald-50' : result.status === PermitStatus.REJECTED ? 'bg-rose-50' : 'bg-amber-50'} flex items-center justify-between`}>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Status Saat Ini</p>
                <h4 className={`text-2xl font-black ${result.status === PermitStatus.APPROVED ? 'text-emerald-600' : result.status === PermitStatus.REJECTED ? 'text-rose-600' : 'text-amber-600'}`}>
                  {result.status === PermitStatus.APPROVED ? 'Dizinkan / Terbit' : result.status === PermitStatus.REJECTED ? 'Ditolak' : 'Menunggu Verifikasi'}
                </h4>
             </div>
             {result.status === PermitStatus.APPROVED && (
               <button 
                onClick={() => onPrint(result)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-200 flex items-center gap-2 hover:bg-indigo-700 transition-all"
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2-2H7a2 2 0 00-2 2v4"></path></svg>
                 Cetak Izin Sekarang
               </button>
             )}
          </div>
          
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Nama Pemohon</p>
                <p className="font-bold text-slate-800">{result.applicantName}</p>
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Universitas</p>
                <p className="font-bold text-slate-800">{result.university}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Judul Penelitian</p>
                <p className="font-bold text-slate-700 italic">"{result.researchTitle}"</p>
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Lokasi</p>
                <p className="font-bold text-slate-800">{result.researchLocation}</p>
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Kategori</p>
                <p className="font-bold text-slate-800">{result.category}</p>
              </div>
            </div>
            
            {result.status === PermitStatus.PENDING && (
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex gap-4 items-start">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">Informasi Verifikasi</p>
                  <p className="text-xs text-slate-500 mt-1">Dokumen Anda sedang dalam antrean validasi oleh Admin Kesbangpol. Proses ini biasanya memakan waktu 1-3 hari kerja.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingStatus;
