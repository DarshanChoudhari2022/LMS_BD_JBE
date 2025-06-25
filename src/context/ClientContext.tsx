import React, { createContext, useState, useContext, useEffect } from 'react';
import { Client } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface ClientContextType {
  clients: Client[];
  addClient: (client: Omit<Client, 'id'>) => Promise<void>;
  updateClient: (id: string, clientData: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  getClient: (id: string) => Client | undefined;
  searchClients: (query: string) => Client[];
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchClients();
    }
  }, [user]);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to fetch clients');
    }
  };

  const addClient = async (client: Omit<Client, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([{ ...client, user_id: user?.id }])
        .select()
        .single();

      if (error) throw error;
      setClients(prev => [data, ...prev]);
      toast.success('Client added successfully');
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Failed to add client');
      throw error;
    }
  };

  const updateClient = async (id: string, clientData: Partial<Client>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setClients(prev => prev.map(client => client.id === id ? data : client));
      toast.success('Client updated successfully');
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Failed to update client');
      throw error;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setClients(prev => prev.filter(client => client.id !== id));
      toast.success('Client deleted successfully');
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Failed to delete client');
      throw error;
    }
  };

  const getClient = (id: string) => {
    return clients.find((client) => client.id === id);
  };

  const searchClients = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(lowerCaseQuery) ||
        client.companyName.toLowerCase().includes(lowerCaseQuery) ||
        client.email?.toLowerCase().includes(lowerCaseQuery)
    );
  };

  return (
    <ClientContext.Provider
      value={{
        clients,
        addClient,
        updateClient,
        deleteClient,
        getClient,
        searchClients,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClients = () => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientProvider');
  }
  return context;
};