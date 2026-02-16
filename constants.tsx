import { ResearchPermit, PermitStatus } from './types';

export const NTB_REGENCIES = [
  'Kota Mataram',
  'Lombok Barat',
  'Lombok Tengah',
  'Lombok Timur',
  'Lombok Utara',
  'Sumbawa',
  'Sumbawa Barat',
  'Dompu',
  'Bima',
  'Kota Bima'
];

export const RESEARCH_CATEGORIES = [
  'Sosial & Budaya',
  'Pendidikan',
  'Ekonomi & Bisnis',
  'Agama',
  'Lingkungan Hidup',
  'Politik',
  'Teknologi Informatika',
  'Kesehatan'
];

// Mock data for 2023 - 2026
const generateMockData = (): ResearchPermit[] => {
  const data: ResearchPermit[] = [];
  const years = [2023, 2024, 2025, 2026];
  const firstNames = ['Budi', 'Siti', 'Agus', 'Lalu', 'Baiq', 'Dewi', 'Rian', 'Putri', 'Hendra', 'Eka'];
  const lastNames = ['Pratama', 'Sari', 'Wahyudi', 'Hidayat', 'Saputra', 'Lestari', 'Kusuma', 'Ayu'];
  const unis = ['Universitas Mataram', 'UIN Mataram', 'Universitas Hamzanwadi', 'Universitas Teknologi Sumbawa', 'Universitas Muhammadiyah Mataram'];

  let idCounter = 1;

  years.forEach(year => {
    const count = year === 2026 ? 150 : Math.floor(Math.random() * 200) + 100;
    for (let i = 0; i < count; i++) {
      const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
      
      data.push({
        id: `PERMIT-${year}-${idCounter++}`,
        applicantName: `${fName} ${lName}`,
        idNumber: `520${Math.floor(Math.random() * 900000000000)}`,
        email: `${fName.toLowerCase()}.${lName.toLowerCase()}@example.com`,
        phone: `081${Math.floor(100000000 + Math.random() * 900000000)}`,
        university: unis[Math.floor(Math.random() * unis.length)],
        researchTitle: `Penelitian Strategis Bidang ${RESEARCH_CATEGORIES[Math.floor(Math.random() * RESEARCH_CATEGORIES.length)]} di NTB`,
        researchLocation: NTB_REGENCIES[Math.floor(Math.random() * NTB_REGENCIES.length)],
        duration: '3 Bulan',
        category: RESEARCH_CATEGORIES[Math.floor(Math.random() * RESEARCH_CATEGORIES.length)],
        submissionDate: `${year}-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
        status: year < 2025 ? PermitStatus.APPROVED : (Math.random() > 0.3 ? PermitStatus.APPROVED : PermitStatus.PENDING),
        year: year,
        documents: {
          ktp: 'mock-ktp.jpg',
          proposal: 'mock-proposal.pdf',
          suratPengantar: 'mock-surat.pdf'
        }
      });
    }
  });
  return data;
};

export const MOCK_PERMITS = generateMockData();