export type LeadStatus = 'Live' | 'Closed' | 'Lost';
export type LeadSource = 'Referral' | 'Website' | 'Cold Call' | 'Event' | 'Partner' | 'Other';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string | null;
  phone: string | null;
  status: LeadStatus;
  source: LeadSource;
  stage: string;
  nextAction: string | null;
  nextActionDate: string | null;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Partner {
  id: string;
  companyName: string;
  contactPerson: string | null;
  natureOfContract: string | null;
  bdRepresentative: string | null;
  email: string | null;
  contactNumber: string | null;
  status: string | null;
  businessRemark: string | null;
  internalRemark: string | null;
  engagementLetterSent: boolean | null;
  acceptanceStatus: string | null;
  engagementLetterReference: string | null;
  address: string | null;
  agreementDate: string | null;
  category: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  companyName: string;
  mobile: string | null;
  email: string | null;
  address: string | null;
  bdRepresentative: string | null;
  city: string | null;
  country: string | null;
  engagementDetails: string | null;
  remark: string | null;
  status: string | null;
  contactPerson: string | null;
  endDate: string | null;
  industry: string | null;
  notes: string | null;
  serviceProvided: string | null;
  startDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Sales';
  avatar: string | null;
}

export interface Offering {
  id: string;
  name: string;
  category: string;
  description: string;
  pricing: string;
  status: 'Active' | 'Inactive';
}

export interface DailyActivity {
  id: string;
  date: string;
  userId: string;
  leadId: string | null;
  partnerId: string | null;
  activityType: string;
  description: string;
  outcome: string | null;
  nextSteps: string | null;
  duration: number;
  createdAt: string;
}

export interface LeadInteraction {
  id: string;
  leadId: string;
  date: string;
  type: string;
  description: string;
  outcome: string | null;
  nextSteps: string | null;
  userId: string;
  createdAt: string;
}

export interface ImportResult {
  success: boolean;
  message: string;
  data?: any[];
  errors?: string[];
}