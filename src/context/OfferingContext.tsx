import React, { createContext, useState, useContext } from 'react';
import { Offering } from '../types';
import { mockOfferings } from '../data/mockData';

interface OfferingContextType {
  offerings: Offering[];
  addOffering: (offering: Omit<Offering, 'id'>) => void;
  updateOffering: (id: string, offeringData: Partial<Offering>) => void;
  deleteOffering: (id: string) => void;
  getOffering: (id: string) => Offering | undefined;
  getActiveOfferings: () => Offering[];
  searchOfferings: (query: string) => Offering[];
}

const OfferingContext = createContext<OfferingContextType | undefined>(undefined);

export const OfferingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [offerings, setOfferings] = useState<Offering[]>(mockOfferings);

  const addOffering = (offering: Omit<Offering, 'id'>) => {
    const newOffering: Offering = {
      ...offering,
      id: Date.now().toString(),
    };
    setOfferings((prevOfferings) => [...prevOfferings, newOffering]);
  };

  const updateOffering = (id: string, offeringData: Partial<Offering>) => {
    setOfferings((prevOfferings) =>
      prevOfferings.map((offering) =>
        offering.id === id ? { ...offering, ...offeringData } : offering
      )
    );
  };

  const deleteOffering = (id: string) => {
    setOfferings((prevOfferings) => prevOfferings.filter((offering) => offering.id !== id));
  };

  const getOffering = (id: string) => {
    return offerings.find((offering) => offering.id === id);
  };

  const getActiveOfferings = () => {
    return offerings.filter((offering) => offering.status === 'Active');
  };

  const searchOfferings = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();
    return offerings.filter(
      (offering) =>
        offering.name.toLowerCase().includes(lowerCaseQuery) ||
        offering.category.toLowerCase().includes(lowerCaseQuery) ||
        offering.description.toLowerCase().includes(lowerCaseQuery)
    );
  };

  return (
    <OfferingContext.Provider
      value={{
        offerings,
        addOffering,
        updateOffering,
        deleteOffering,
        getOffering,
        getActiveOfferings,
        searchOfferings,
      }}
    >
      {children}
    </OfferingContext.Provider>
  );
};

export const useOfferings = () => {
  const context = useContext(OfferingContext);
  if (context === undefined) {
    throw new Error('useOfferings must be used within an OfferingProvider');
  }
  return context;
};