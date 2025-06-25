import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Download, Upload, Search } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import StatusBadge from '../components/ui/StatusBadge';
import { useLeads } from '../context/LeadContext';
import { Lead, LeadStatus, LeadSource } from '../types';
import { useForm } from 'react-hook-form';

const LeadDatabase: React.FC = () => {
  const { leads, addLead, searchLeads } = useLeads();
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>(leads);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>>();
  
  const leadColumns = [
    {
      id: 'name',
      header: 'Name',
      accessor: (row: Lead) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-sm text-gray-500">{row.company}</div>
        </div>
      ),
      sortable: true,
    },
    {
      id: 'contact',
      header: 'Contact',
      accessor: (row: Lead) => (
        <div>
          <div>{row.email}</div>
          <div className="text-sm text-gray-500">{row.phone}</div>
        </div>
      ),
      sortable: false,
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row: Lead) => <StatusBadge status={row.status} />,
      sortable: true,
    },
    {
      id: 'source',
      header: 'Source',
      accessor: (row: Lead) => <span>{row.source}</span>,
      sortable: true,
    },
    {
      id: 'stage',
      header: 'Stage',
      accessor: (row: Lead) => <span>{row.stage}</span>,
      sortable: true,
    },
    {
      id: 'nextAction',
      header: 'Next Action',
      accessor: (row: Lead) => (
        <div>
          <div>{row.nextAction}</div>
          {row.nextActionDate && (
            <div className="text-sm text-gray-500">{row.nextActionDate}</div>
          )}
        </div>
      ),
      sortable: false,
    },
  ];
  
  const handleAddLead = (data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    addLead(data);
    setIsAddModalOpen(false);
    reset();
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredLeads(leads);
    } else {
      setFilteredLeads(searchLeads(query));
    }
  };
  
  const handleRowClick = (lead: Lead) => {
    navigate(`/leads/${lead.id}`);
  };
  
  return (
    <div>
      <PageHeader 
        title="Lead Database" 
        description="Manage and track all leads"
        actions={
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </button>
        }
      />
      
      {/* Search and filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="input pl-10"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            className="btn btn-outline flex items-center"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </button>
          <button
            type="button"
            className="btn btn-outline flex items-center"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
          <button
            type="button"
            className="btn btn-outline flex items-center"
          >
            <Upload className="mr-2 h-4 w-4" />
            Import
          </button>
        </div>
      </div>
      
      {/* Leads table */}
      <DataTable 
        columns={leadColumns} 
        data={searchQuery ? filteredLeads : leads}
        itemsPerPage={10}
        onRowClick={handleRowClick}
      />
      
      {/* Add Lead Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          reset();
        }}
        title="Add New Lead"
        size="lg"
        actions={
          <>
            <button
              type="button"
              className="btn btn-outline mr-3"
              onClick={() => {
                setIsAddModalOpen(false);
                reset();
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit(handleAddLead)}
            >
              Add Lead
            </button>
          </>
        }
      >
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              className={`input ${errors.name ? 'border-red-500' : ''}`}
              {...register('name', { required: true })}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">Name is required</p>}
          </div>
          
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              id="company"
              type="text"
              className={`input ${errors.company ? 'border-red-500' : ''}`}
              {...register('company', { required: true })}
            />
            {errors.company && <p className="mt-1 text-sm text-red-600">Company is required</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`input ${errors.email ? 'border-red-500' : ''}`}
              {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
            />
            {errors.email?.type === 'required' && (
              <p className="mt-1 text-sm text-red-600">Email is required</p>
            )}
            {errors.email?.type === 'pattern' && (
              <p className="mt-1 text-sm text-red-600">Invalid email format</p>
            )}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              id="phone"
              type="text"
              className="input"
              {...register('phone')}
            />
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              className={`select ${errors.status ? 'border-red-500' : ''}`}
              {...register('status', { required: true })}
            >
              <option value="">Select a status</option>
              <option value="Live">Live</option>
              <option value="Closed">Closed</option>
              <option value="Lost">Lost</option>
            </select>
            {errors.status && <p className="mt-1 text-sm text-red-600">Status is required</p>}
          </div>
          
          <div>
            <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
              Source
            </label>
            <select
              id="source"
              className={`select ${errors.source ? 'border-red-500' : ''}`}
              {...register('source', { required: true })}
            >
              <option value="">Select a source</option>
              <option value="Referral">Referral</option>
              <option value="Website">Website</option>
              <option value="Cold Call">Cold Call</option>
              <option value="Event">Event</option>
              <option value="Partner">Partner</option>
              <option value="Other">Other</option>
            </select>
            {errors.source && <p className="mt-1 text-sm text-red-600">Source is required</p>}
          </div>
          
          <div>
            <label htmlFor="stage" className="block text-sm font-medium text-gray-700 mb-1">
              Stage
            </label>
            <input
              id="stage"
              type="text"
              className="input"
              {...register('stage')}
            />
          </div>
          
          <div>
            <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
              Assigned To
            </label>
            <select
              id="assignedTo"
              className="select"
              {...register('assignedTo')}
            >
              <option value="">Select a user</option>
              <option value="1">John Smith</option>
              <option value="2">Sarah Johnson</option>
              <option value="3">Alex Davis</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="nextAction" className="block text-sm font-medium text-gray-700 mb-1">
              Next Action
            </label>
            <input
              id="nextAction"
              type="text"
              className="input"
              {...register('nextAction')}
            />
          </div>
          
          <div>
            <label htmlFor="nextActionDate" className="block text-sm font-medium text-gray-700 mb-1">
              Next Action Date
            </label>
            <input
              id="nextActionDate"
              type="date"
              className="input"
              {...register('nextActionDate')}
            />
          </div>
        </form>
      </Modal>
      
      {/* Filter Modal */}
      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Leads"
        actions={
          <>
            <button
              type="button"
              className="btn btn-outline mr-3"
              onClick={() => setIsFilterModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsFilterModalOpen(false)}
            >
              Apply Filters
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input id="status-live" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label htmlFor="status-live" className="ml-2 block text-sm text-gray-900">
                  Live
                </label>
              </div>
              <div className="flex items-center">
                <input id="status-closed" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label htmlFor="status-closed" className="ml-2 block text-sm text-gray-900">
                  Closed
                </label>
              </div>
              <div className="flex items-center">
                <input id="status-lost" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label htmlFor="status-lost" className="ml-2 block text-sm text-gray-900">
                  Lost
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input id="source-referral" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label htmlFor="source-referral" className="ml-2 block text-sm text-gray-900">
                  Referral
                </label>
              </div>
              <div className="flex items-center">
                <input id="source-website" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label htmlFor="source-website" className="ml-2 block text-sm text-gray-900">
                  Website
                </label>
              </div>
              <div className="flex items-center">
                <input id="source-event" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label htmlFor="source-event" className="ml-2 block text-sm text-gray-900">
                  Event
                </label>
              </div>
              <div className="flex items-center">
                <input id="source-partner" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label htmlFor="source-partner" className="ml-2 block text-sm text-gray-900">
                  Partner
                </label>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="date-from" className="block text-xs text-gray-500">From</label>
                <input id="date-from" type="date" className="input" />
              </div>
              <div>
                <label htmlFor="date-to" className="block text-xs text-gray-500">To</label>
                <input id="date-to" type="date" className="input" />
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="assigned-to" className="block text-sm font-medium text-gray-700 mb-1">
              Assigned To
            </label>
            <select id="assigned-to" className="select">
              <option value="">Any</option>
              <option value="1">John Smith</option>
              <option value="2">Sarah Johnson</option>
              <option value="3">Alex Davis</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LeadDatabase;