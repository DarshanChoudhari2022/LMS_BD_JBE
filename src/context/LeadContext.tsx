import React, { createContext, useState, useContext, useEffect } from 'react';
import { Lead } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface LeadContextType {
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateLead: (id: string, leadData: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  getLead: (id: string) => Lead | undefined;
  filterLeadsByStatus: (status: string) => Lead[];
  filterLeadsBySource: (source: string) => Lead[];
  searchLeads: (query: string) => Lead[];
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export const LeadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchLeads();
    }
  }, [user]);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*');

      if (error) throw error;
      
      // Transform database data to match frontend Lead interface
      const transformedLeads = (data || []).map(transformDatabaseLead);
      setLeads(transformedLeads);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to fetch leads');
    }
  };

  // Transform database row to Lead interface
  const transformDatabaseLead = (dbLead: any): Lead => {
    return {
      id: dbLead['Name'] || dbLead.Name || Math.random().toString(36).substr(2, 9), // Use Name as ID or generate random ID
      name: dbLead['Name'] || dbLead.Name || '',
      company: dbLead['Company Name'] || dbLead['Company Name'] || '',
      email: dbLead['Email'] || dbLead.Email || null,
      phone: dbLead['Phone no'] || dbLead['Phone no'] || null,
      status: dbLead['Status'] || dbLead.Status || 'Live',
      source: 'Other', // Default source since it's not in the database schema
      stage: 'Initial', // Default stage since it's not in the database schema
      nextAction: dbLead['Next Action'] || null,
      nextActionDate: dbLead['Next Action Date'] || dbLead['Next Action Date'] || null,
      assignedTo: dbLead['BD Incharge'] || dbLead['BD Incharge'] || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  // Transform Lead interface to database format
  const transformLeadToDatabase = (lead: any) => {
    return {
      'Name': lead.name,
      'Company Name': lead.company,
      'Email': lead.email,
      'Phone no': lead.phone,
      'Status': lead.status,
      'BD Incharge': lead.assignedTo,
      'Products/Services Interested': lead.productsInterested || '',
      'Action On': lead.nextActionDate,
      'Date of Last Communication': new Date().toISOString().split('T')[0],
      'Last Remarks': lead.remarks || '',
      'Website': lead.website || '',
      'Location': lead.location || '',
      'Date of Lead Acquisition': new Date().toISOString().split('T')[0],
      'Ticket Amount': lead.ticketAmount || '',
      'Reference Name': lead.referenceName || '',
      'Proposal shared': lead.proposalShared || 'No',
      'Proposal Link (if shared)': lead.proposalLink || '',
      'Next Action Date': lead.nextActionDate,
      'Vertical': lead.vertical || '',
      'Industry': lead.industry || ''
    };
  };

  const addLead = async (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const dbLead = transformLeadToDatabase(lead);
      const { data, error } = await supabase
        .from('leads')
        .insert([dbLead])
        .select()
        .single();

      if (error) throw error;
      const transformedLead = transformDatabaseLead(data);
      setLeads(prev => [transformedLead, ...prev]);
      toast.success('Lead added successfully');
    } catch (error) {
      console.error('Error adding lead:', error);
      toast.error('Failed to add lead');
      throw error;
    }
  };

  const updateLead = async (id: string, leadData: Partial<Lead>) => {
    try {
      const dbLead = transformLeadToDatabase(leadData);
      const { data, error } = await supabase
        .from('leads')
        .update(dbLead)
        .eq('Name', id) // Using Name as the identifier since there's no proper id column
        .select()
        .single();

      if (error) throw error;
      const transformedLead = transformDatabaseLead(data);
      setLeads(prev => prev.map(lead => lead.id === id ? transformedLead : lead));
      toast.success('Lead updated successfully');
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error('Failed to update lead');
      throw error;
    }
  };

  const deleteLead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('Name', id); // Using Name as the identifier since there's no proper id column

      if (error) throw error;
      setLeads(prev => prev.filter(lead => lead.id !== id));
      toast.success('Lead deleted successfully');
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast.error('Failed to delete lead');
      throw error;
    }
  };

  const getLead = (id: string) => {
    return leads.find((lead) => lead.id === id);
  };

  const filterLeadsByStatus = (status: string) => {
    return leads.filter((lead) => lead.status === status);
  };

  const filterLeadsBySource = (source: string) => {
    return leads.filter((lead) => lead.source === source);
  };

  const searchLeads = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();
    return leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(lowerCaseQuery) ||
        lead.company.toLowerCase().includes(lowerCaseQuery) ||
        lead.email?.toLowerCase().includes(lowerCaseQuery)
    );
  };

  return (
    <LeadContext.Provider
      value={{
        leads,
        addLead,
        updateLead,
        deleteLead,
        getLead,
        filterLeadsByStatus,
        filterLeadsBySource,
        searchLeads,
      }}
    >
      {children}
    </LeadContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadContext);
  if (context === undefined) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
};