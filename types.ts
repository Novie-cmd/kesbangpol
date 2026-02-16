
export enum PermitStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface ResearchPermit {
  id: string;
  applicantName: string;
  idNumber: string;
  email: string;
  phone: string;
  university: string;
  researchTitle: string;
  researchLocation: string;
  duration: string;
  category: string;
  submissionDate: string;
  status: PermitStatus;
  year: number;
  documents: {
    ktp?: string;
    proposal?: string;
    suratPengantar?: string;
  };
}

export interface DashboardStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}
