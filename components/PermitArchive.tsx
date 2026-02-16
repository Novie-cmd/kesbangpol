
import React, { useState, useMemo, useRef } from 'react';
import * as XLSX from 'xlsx';
import { NTB_REGENCIES, RESEARCH_CATEGORIES } from '../constants';
import { PermitStatus, ResearchPermit } from '../types';

interface PermitArchiveProps {
  permits: ResearchPermit[];
  setPermits: React.Dispatch<React.SetStateAction<ResearchPermit[]>>;
  onPrint: (permit: ResearchPermit) => void;
}

const PermitArchive: React.FC<PermitArchiveProps> = ({ permits, setPermits, onPrint }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('Semua');
  const [locationFilter, setLocationFilter] = useState('Semua');
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const archiveData = useMemo(() => {
    return permits.filter(p => p.status === PermitStatus.APPROVED);
  }, [permits]);

  const filteredArchive = useMemo(() => {
    return archiveData.filter(p => {
      const matchesSearch = p.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           p.researchTitle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYear = yearFilter === 'Semua' || p.year.toString() === yearFilter;
      const matchesLoc = locationFilter === 'Semua' || p.researchLocation === locationFilter;
      return matchesSearch && matchesYear && matchesLoc;
    });
  }, [archiveData, searchTerm, yearFilter, locationFilter]);

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as any[];

        const newPermits: ResearchPermit[] = data.map((row, index) => ({
          id: `IMP-${Date.now()}-${index}`,
          applicantName: row.Nama || row['Nama Lengkap'] || 'Tanpa Nama',
          idNumber: row.NIK?.toString() || '0000000000000000',
          email: row.Email || 'import@example.com',
          phone: row.HP?.toString() || row.Telepon?.toString() || '0800',
          university: row.Instansi || row.Kampus || row.Universitas || 'Umum',
          researchTitle: row.Judul || row['Judul Penelitian'] || 'Penelitian Tanpa Judul',
          researchLocation: row.Lokasi || row.Kabupaten || row.Kota || NTB_REGENCIES[0],
          duration: row.Durasi || '3 Bulan',
          category: row.Kategori || row.Bidang || RESEARCH_CATEGORIES[0],
          submissionDate: row.Tanggal || new Date().toISOString().split('T')[0],
          status: PermitStatus.APPROVED,
          year: parseInt(row.Tahun) || new Date().getFullYear(),
          documents: {}
        }));

        setPermits(prev => [...prev, ...newPermits]);
        alert(`Berhasil mengimpor ${newPermits.length} data penelitian.`);
      } catch (error) {
        console.error("Excel Import Error:", error);
        alert("Gagal membaca file Excel.");
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="space-y-8 animate-fade-in no-print">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">Database Izin Terbit</h3>
          <p className="text-slate-500 mt-1">Kearsipan digital perizinan penelitian Provinsi NTB.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <input type="file" ref={fileInputRef} onChange={handleImportExcel} accept=".xlsx, .xls" className="hidden" />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-black text-slate-700 shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <svg className={`w-5 h-5 text-indigo-500 ${isImporting ? 'animate-bounce' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            {isImporting ? 'Memproses...' : 'Import Excel'}
          </button>
          
          <div className="flex gap-2">
            <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100 text-center min-w-[100px]">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total</p>
              <p className="text-xl font-black text-slate-400">{archiveData.length}</p>
            </div>
            <div className="bg-indigo-600 px-5 py-3 rounded-2xl shadow-lg shadow-indigo-100 text-center min-w-[100px] border border-indigo-500">
              <p className="text-[9px] font-black text-indigo-100 uppercase tracking-widest">Filter</p>
              <p className="text-xl font-black text-white">{filteredArchive.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <svg className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input 
            type="text" 
            placeholder="Cari nama, kampus, atau judul..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} className="px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700">
          <option value="Semua">Tahun</option>
          {['2023', '2024', '2025', '2026'].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)} className="px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700">
          <option value="Semua">Lokasi</option>
          {NTB_REGENCIES.map(loc => <option key={loc} value={loc}>{loc}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">ID</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Peneliti</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Judul</th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredArchive.length > 0 ? filteredArchive.slice(0, 50).map(permit => (
                <tr key={permit.id} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                      {permit.id.split('-').pop()}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-black text-slate-800 text-sm">{permit.applicantName}</div>
                    <div className="text-[11px] text-slate-400 font-bold uppercase">{permit.university}</div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs text-slate-600 line-clamp-1 italic mb-1">"{permit.researchTitle}"</p>
                    <div className="flex gap-2">
                       <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-black uppercase">{permit.category}</span>
                       <span className="text-[9px] text-indigo-400 font-black">{permit.year}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button 
                      onClick={() => onPrint(permit)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-xl font-bold text-xs hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100 shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2-2H7a2 2 0 00-2 2v4"></path></svg>
                      Cetak
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold">Data tidak ditemukan</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PermitArchive;
