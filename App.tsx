
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ApplicationForm from './components/ApplicationForm';
import ApplicationList from './components/ApplicationList';
import PermitArchive from './components/PermitArchive';
import TrackingStatus from './components/TrackingStatus';
import { MOCK_PERMITS } from './constants';
import { ResearchPermit } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'apply' | 'verification' | 'archive' | 'tracking'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [permits, setPermits] = useState<ResearchPermit[]>(MOCK_PERMITS);
  const [selectedPermitForPrint, setSelectedPermitForPrint] = useState<ResearchPermit | null>(null);

  // Deep-linking from QR Code scan
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page');
    if (page === 'apply') setActiveTab('apply');
    if (page === 'tracking') setActiveTab('tracking');
    
    // Clear URL params after reading to keep it clean
    if (page) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handlePrint = (permit: ResearchPermit) => {
    setSelectedPermitForPrint(permit);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const NavItem: React.FC<{ tab: typeof activeTab; icon: React.ReactNode; label: string }> = ({ tab, icon, label }) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        setSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-semibold transition-all ${
        activeTab === tab 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 rounded-xl' 
          : 'text-slate-600 hover:bg-slate-100 rounded-xl'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans print:bg-white text-slate-900">
      {/* Formal Permit Template (Invisible in UI, Visible in Print) */}
      {selectedPermitForPrint && (
        <div id="print-area" className="hidden print:block p-12 bg-white text-black font-serif leading-relaxed">
          <div className="flex items-center gap-6 border-b-[3px] border-black pb-4 mb-6">
            <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center border-2 border-black rounded-lg">
               <span className="text-[10px] font-bold text-center">LOGO PROVINSI NTB</span>
            </div>
            <div className="text-center flex-1">
              <h1 className="text-xl font-bold uppercase tracking-wide">Pemerintah Provinsi Nusa Tenggara Barat</h1>
              <h2 className="text-2xl font-black uppercase tracking-tight">Badan Kesatuan Bangsa dan Politik Dalam Negeri</h2>
              <p className="text-sm italic">Jl. Pendidikan No. 2, Mataram, Nusa Tenggara Barat. Telp: (0370) 123456</p>
            </div>
          </div>

          <div className="text-center mb-10">
            <h3 className="text-lg font-bold underline decoration-2 underline-offset-4 uppercase">Surat Keterangan Penelitian</h3>
            <p className="text-sm font-medium">Nomor: 070 / {selectedPermitForPrint.id.split('-').pop()} / Bakesbangpoldagri / {selectedPermitForPrint.year}</p>
          </div>

          <div className="space-y-6 text-[15px]">
            <p>Berdasarkan permohonan yang diajukan oleh instansi terkait, dengan ini Kepala Badan Kesatuan Bangsa dan Politik Dalam Negeri Provinsi NTB memberikan rekomendasi penelitian kepada:</p>
            
            <div className="ml-8 space-y-2">
              <div className="grid grid-cols-4 gap-2">
                <span className="font-bold">Nama</span>
                <span className="col-span-3">: {selectedPermitForPrint.applicantName}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <span className="font-bold">NIK / NIM</span>
                <span className="col-span-3">: {selectedPermitForPrint.idNumber}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <span className="font-bold">Instansi</span>
                <span className="col-span-3">: {selectedPermitForPrint.university}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <span className="font-bold">Bidang</span>
                <span className="col-span-3">: {selectedPermitForPrint.category}</span>
              </div>
            </div>

            <div className="space-y-4">
              <p>Untuk melaksanakan penelitian dengan rincian sebagai berikut:</p>
              <div className="ml-8 space-y-2">
                <div className="grid grid-cols-4 gap-2">
                  <span className="font-bold">Judul</span>
                  <span className="col-span-3 italic">: "{selectedPermitForPrint.researchTitle}"</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <span className="font-bold">Lokasi</span>
                  <span className="col-span-3">: {selectedPermitForPrint.researchLocation}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <span className="font-bold">Waktu</span>
                  <span className="col-span-3">: {selectedPermitForPrint.duration}</span>
                </div>
              </div>
            </div>

            <p className="leading-relaxed">Demikian rekomendasi ini diberikan untuk dapat dipergunakan sebagaimana mestinya, dengan ketentuan peneliti wajib menaati peraturan perundang-undangan yang berlaku dan melaporkan hasil penelitian kepada Gubernur NTB melalui Bakesbangpoldagri.</p>
          </div>

          <div className="mt-16 flex justify-between items-end">
             <div className="text-center">
                <div className="w-24 h-24 border border-black flex items-center justify-center mb-2">
                   <div className="p-1">
                      <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M4 4h4v4H4V4zM16 4h4v4h-4V4zM4 16h4v4H4v-4zM10 4h4v2h-2v2h-2V4zM14 8h2v2h-2V8zM8 10h2v2H8v-2zm2 2h2v2h-2v-2zm2 2h2v2h-2v-2zm2 2h2v2h-2v-2zm0-4h2v2h-2v-2zm-4 4h2v2h-2v-2zm8-12h2v2h-2V4zm-2 2h2v2h-2V6zm2 2h2v2h-2V8z"></path></svg>
                   </div>
                </div>
                <p className="text-[10px] font-mono">ID: {selectedPermitForPrint.id}</p>
             </div>
             <div className="w-64 text-center">
                <p>Mataram, {new Date(selectedPermitForPrint.submissionDate).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                <p className="font-bold mt-1">a.n KEPALA BADAN KESBANGPOLDAGRI</p>
                <p className="text-sm">Sekretaris Badan,</p>
                <div className="h-20"></div>
                <p className="font-bold underline uppercase">H. LALU MUHAMMAD, M.Si</p>
                <p className="text-sm">Pembina Tingkat I (IV/b)</p>
                <p className="text-sm">NIP. 19750101 200001 1 001</p>
             </div>
          </div>
        </div>
      )}

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 z-50 transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:static print:hidden`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 px-2 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl">S</div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 leading-none">SIPEKA</h1>
              <span className="text-[10px] font-bold text-indigo-500 tracking-widest uppercase">Kesbangpol NTB</span>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            <NavItem 
              tab="dashboard" 
              label="Dashboard Utama" 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"></path></svg>} 
            />
            <NavItem 
              tab="tracking" 
              label="Cek Status / Cetak" 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>} 
            />
            <div className="pt-6 pb-2 px-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Internal Admin</p>
            </div>
            <NavItem 
              tab="verification" 
              label="Verifikasi Masuk" 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>} 
            />
            <NavItem 
              tab="archive" 
              label="Database Terbit" 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>} 
            />
            <NavItem 
              tab="apply" 
              label="Input Mandiri" 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>} 
            />
          </nav>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto print:p-0">
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between z-30 print:hidden">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
              {activeTab === 'dashboard' ? 'Overview' : 
               activeTab === 'tracking' ? 'Lacak Izin' :
               activeTab === 'apply' ? 'Permohonan' : 
               activeTab === 'verification' ? 'Verifikasi' : 'Arsip Digital'}
            </h2>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto print:p-0">
          {activeTab === 'dashboard' && <Dashboard permits={permits} />}
          {activeTab === 'apply' && <ApplicationForm />}
          {activeTab === 'verification' && <ApplicationList permits={permits} setPermits={setPermits} />}
          {activeTab === 'archive' && <PermitArchive permits={permits} setPermits={setPermits} onPrint={handlePrint} />}
          {activeTab === 'tracking' && <TrackingStatus permits={permits} onPrint={handlePrint} />}
        </div>
      </main>
    </div>
  );
};

export default App;
