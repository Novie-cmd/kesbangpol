
import React, { useState } from 'react';
import { NTB_REGENCIES, RESEARCH_CATEGORIES } from '../constants';

const ApplicationForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    ktp: null,
    proposal: null,
    suratPengantar: null
  });
  
  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    email: '',
    phone: '',
    university: '',
    title: '',
    location: NTB_REGENCIES[0],
    category: RESEARCH_CATEGORIES[0],
    duration: '3 Bulan'
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [key]: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      alert("Permohonan Berhasil! Dokumen Anda telah diterima oleh sistem SIPEKA. Admin akan memproses permohonan Anda dalam 1-3 hari kerja.");
      setFormData({
        name: '', idNumber: '', email: '', phone: '', university: '', 
        title: '', location: NTB_REGENCIES[0], category: RESEARCH_CATEGORIES[0], duration: '3 Bulan'
      });
      setFiles({ ktp: null, proposal: null, suratPengantar: null });
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-700 to-blue-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Portal Pengajuan Mandiri</h2>
            <p className="text-indigo-100 opacity-90">Lengkapi data & unggah berkas untuk izin penelitian</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 space-y-8">
        {/* Identitas Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">1. Identitas Pemohon</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-600">Nama Lengkap</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" placeholder="Masukkan nama sesuai KTP" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-600">NIK (16 Digit)</label>
              <input type="text" required value={formData.idNumber} onChange={e => setFormData({...formData, idNumber: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" placeholder="5201XXXXXXXXXXXX" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-600">Instansi / Universitas</label>
              <input type="text" required value={formData.university} onChange={e => setFormData({...formData, university: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" placeholder="Contoh: Universitas Mataram" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-600">Nomor WhatsApp</label>
              <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" placeholder="08XXXXXXXXXX" />
            </div>
          </div>
        </section>

        {/* Research Details */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">2. Detail Penelitian</h3>
          </div>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-600">Judul Penelitian</label>
              <textarea required rows={2} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none" placeholder="Tuliskan judul lengkap penelitian..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-600">Lokasi Utama</label>
                <select value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none">
                  {NTB_REGENCIES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-600">Kategori</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none">
                  {RESEARCH_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Document Upload */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">3. Unggah Berkas Pendukung</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FileUploadField label="Scan KTP" id="ktp" fileName={files.ktp?.name} onChange={handleFileChange} />
            <FileUploadField label="Proposal" id="proposal" fileName={files.proposal?.name} onChange={handleFileChange} />
            <FileUploadField label="Surat Kampus" id="surat" fileName={files.suratPengantar?.name} onChange={handleFileChange} />
          </div>
        </section>

        <button type="submit" disabled={submitted} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2">
          {submitted ? "Mengirim..." : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Kirim Permohonan Izin
            </>
          )}
        </button>
      </form>
    </div>
  );
};

const FileUploadField: React.FC<{label: string, id: string, fileName?: string, onChange: any}> = ({ label, id, fileName, onChange }) => (
  <div className="relative group">
    <div className={`p-4 border-2 border-dashed rounded-2xl transition-all flex flex-col items-center text-center gap-2 ${fileName ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-indigo-400'}`}>
      <svg className={`w-8 h-8 ${fileName ? 'text-emerald-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
      <span className="text-xs font-bold text-slate-700">{label}</span>
      <span className="text-[10px] text-slate-500 truncate max-w-full px-2">{fileName || "PDF/JPG (Maks 2MB)"}</span>
      <input type="file" onChange={(e) => onChange(e, id)} className="absolute inset-0 opacity-0 cursor-pointer" />
    </div>
  </div>
);

export default ApplicationForm;
