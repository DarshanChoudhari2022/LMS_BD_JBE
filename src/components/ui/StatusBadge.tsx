import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'lead' | 'client' | 'partner' | 'offering';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'lead' }) => {
  const getStatusClass = () => {
    // Lead status badges
    if (type === 'lead') {
      switch (status) {
        case 'Live':
          return 'status-badge status-live';
        case 'Closed':
          return 'status-badge status-closed';
        case 'Lost':
          return 'status-badge status-lost';
        default:
          return 'status-badge bg-gray-100 text-gray-800';
      }
    }
    
    // Client status badges
    if (type === 'client') {
      switch (status) {
        case 'Active':
          return 'status-badge bg-green-100 text-green-800';
        case 'Completed':
          return 'status-badge bg-blue-100 text-blue-800';
        case 'On Hold':
          return 'status-badge bg-yellow-100 text-yellow-800';
        default:
          return 'status-badge bg-gray-100 text-gray-800';
      }
    }
    
    // Partner status badges
    if (type === 'partner') {
      switch (status) {
        case 'Active':
          return 'status-badge bg-green-100 text-green-800';
        case 'Inactive':
          return 'status-badge bg-gray-100 text-gray-800';
        default:
          return 'status-badge bg-gray-100 text-gray-800';
      }
    }
    
    // Offering status badges
    if (type === 'offering') {
      switch (status) {
        case 'Active':
          return 'status-badge bg-green-100 text-green-800';
        case 'Inactive':
          return 'status-badge bg-gray-100 text-gray-800';
        default:
          return 'status-badge bg-gray-100 text-gray-800';
      }
    }
    
    return 'status-badge bg-gray-100 text-gray-800';
  };
  
  return (
    <span className={getStatusClass()}>
      {status}
    </span>
  );
};

export default StatusBadge;