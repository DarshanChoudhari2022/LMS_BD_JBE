import React, { createContext, useState, useContext, useEffect } from 'react';
import { Partner } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface PartnerContextType {
  partners: Partner[];
  addPartner: (partner: Omit<Partner, 'id'>) => Promise<void>;
  updatePartner: (id: string, partnerData: Partial<Partner>) => Promise<void>;
  deletePartner: (id: string) => Promise<void>;
  getPartner: (id: string) => Partner | undefined;
  searchPartners: (query: string) => Partner[];
}

const PartnerContext = createContext<PartnerContextType | undefined>(undefined);

export const PartnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPartners();
    }
  }, [user]);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast.error('Failed to fetch partners');
    }
  };

  const addPartner = async (partner: Omit<Partner, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .insert([{ ...partner, user_id: user?.id }])
        .select()
        .single();

      if (error) throw error;
      setPartners(prev => [data, ...prev]);
      toast.success('Partner added successfully');
    } catch (error) {
      console.error('Error adding partner:', error);
      toast.error('Failed to add partner');
      throw error;
    }
  };

  const updatePartner = async (id: string, partnerData: Partial<Partner>) => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .update(partnerData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setPartners(prev => prev.map(partner => partner.id === id ? data : partner));
      toast.success('Partner updated successfully');
    } catch (error) {
      console.error('Error updating partner:', error);
      toast.error('Failed to update partner');
      throw error;
    }
  };

  const deletePartner = async (id: string) => {
    try {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPartners(prev => prev.filter(partner => partner.id !== id));
      toast.success('Partner deleted successfully');
    } catch (error) {
      console.error('Error deleting partner:', error);
      toast.error('Failed to delete partner');
      throw error;
    }
  };

  const getPartner = (id: string) => {
    return partners.find((partner) => partner.id === id);
  };

  const searchPartners = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();
    return partners.filter(
      (partner) =>
        partner.companyName.toLowerCase().includes(lowerCaseQuery) ||
        partner.contactPerson?.toLowerCase().includes(lowerCaseQuery) ||
        partner.emailAddress?.toLowerCase().includes(lowerCaseQuery)
    );
  };

  return (
    <PartnerContext.Provider
      value={{
        partners,
        addPartner,
        updatePartner,
        deletePartner,
        getPartner,
        searchPartners,
      }}
    >
      {children}
    </PartnerContext.Provider>
  );
};

export const usePartners = () => {
  const context = useContext(PartnerContext);
  if (context === undefined) {
    throw new Error('usePartners must be used within a PartnerProvider');
  }
  return context;
};