import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import { useClients } from '../context/ClientContext';
import { Client } from '../types';
import { useForm } from 'react-hook-form';

const Clients: React.FC = () => {
  const { clients, addClient, updateClient, deleteClient, searchClients } = useClients();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClients, setFilteredClients] = useState<Client[]>(clients);

  const { register: registerAdd, handleSubmit: handleSubmitAdd, reset: resetAdd, formState: { errors: errorsAdd } } = useForm<Omit<Client, 'id'>>();
  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, formState: { errors: errorsEdit } } = useForm<Client>();

  const clientColumns = [
    {
      id: 'name',
      header: 'Name',
      accessor: (row: Client) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-sm text-gray-500">{row.companyName}</div>
        </div>
      ),
      sortable: true,
    },
    {
      id: 'contact',
      header: 'Contact',
      accessor: (row: Client) => (
        <div>
          <div>{row.email}</div>
          <div className="text-sm text-gray-500">{row.mobile}</div>
        </div>
      ),
      sortable: false,
    },
    {
      id: 'location',
      header: 'Location',
      accessor: (row: Client) => (
        <div>
          <div>{row.city}</div>
          <div className="text-sm text-gray-500">{row.country}</div>
        </div>
      ),
      sortable: true,
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row: Client) => (
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(row);
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(row);
            }}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      ),
      sortable: false,
    },
  ];

  const handleAddClient = (data: Omit<Client, 'id'>) => {
    addClient(data);
    setIsAddModalOpen(false);
    resetAdd();
  };

  const handleEditClick = (client: Client) => {
    setSelectedClient(client);
    resetEdit(client);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteModalOpen(true);
  };

  const handleEditClient = (data: Client) => {
    if (selectedClient) {
      updateClient(selectedClient.id, data);
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteClient = () => {
    if (selectedClient) {
      deleteClient(selectedClient.id);
      setIsDeleteModalOpen(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredClients(clients);
    } else {
      setFilteredClients(searchClients(query));
    }
  };

  return (
    <div>
      <PageHeader 
        title="JBE Clients" 
        description="Manage your client relationships"
        actions={
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </button>
        }
      />
      
      {/* Search */}
      <div className="mb-6 flex">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="input pl-10"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>
      
      {/* Clients table */}
      <DataTable 
        columns={clientColumns} 
        data={searchQuery ? filteredClients : clients}
        itemsPerPage={10}
      />
      
      {/* Add Client Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetAdd();
        }}
        title="Add New Client"
        size="lg"
        actions={
          <>
            <button
              type="button"
              className="btn btn-outline mr-3"
              onClick={() => {
                setIsAddModalOpen(false);
                resetAdd();
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmitAdd(handleAddClient)}
            >
              Add Client
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
              className={`input ${errorsAdd.name ? 'border-red-500' : ''}`}
              {...registerAdd('name', { required: true })}
            />
            {errorsAdd.name && <p className="mt-1 text-sm text-red-600">Name is required</p>}
          </div>
          
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              id="companyName"
              type="text"
              className={`input ${errorsAdd.companyName ? 'border-red-500' : ''}`}
              {...registerAdd('companyName', { required: true })}
            />
            {errorsAdd.companyName && <p className="mt-1 text-sm text-red-600">Company name is required</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`input ${errorsAdd.email ? 'border-red-500' : ''}`}
              {...registerAdd('email', { required: true, pattern: /^\S+@\S+$/i })}
            />
            {errorsAdd.email?.type === 'required' && (
              <p className="mt-1 text-sm text-red-600">Email is required</p>
            )}
            {errorsAdd.email?.type === 'pattern' && (
              <p className="mt-1 text-sm text-red-600">Invalid email format</p>
            )}
          </div>
          
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
              Mobile
            </label>
            <input
              id="mobile"
              type="text"
              className="input"
              {...registerAdd('mobile')}
            />
          </div>
          
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              id="city"
              type="text"
              className="input"
              {...registerAdd('city')}
            />
          </div>
          
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              id="country"
              type="text"
              className="input"
              {...registerAdd('country')}
            />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              id="address"
              type="text"
              className="input"
              {...registerAdd('address')}
            />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="engagementDetails" className="block text-sm font-medium text-gray-700 mb-1">
              Engagement Details
            </label>
            <textarea
              id="engagementDetails"
              rows={3}
              className="input"
              {...registerAdd('engagementDetails')}
            ></textarea>
          </div>
        </form>
      </Modal>
      
      {/* Edit Client Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Client"
        size="lg"
        actions={
          <>
            <button
              type="button"
              className="btn btn-outline mr-3"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmitEdit(handleEditClient)}
            >
              Save Changes
            </button>
          </>
        }
      >
        {selectedClient && (
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                id="edit-name"
                type="text"
                className={`input ${errorsEdit.name ? 'border-red-500' : ''}`}
                {...registerEdit('name', { required: true })}
              />
              {errorsEdit.name && <p className="mt-1 text-sm text-red-600">Name is required</p>}
            </div>
            
            <div>
              <label htmlFor="edit-companyName" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                id="edit-companyName"
                type="text"
                className={`input ${errorsEdit.companyName ? 'border-red-500' : ''}`}
                {...registerEdit('companyName', { required: true })}
              />
              {errorsEdit.companyName && <p className="mt-1 text-sm text-red-600">Company name is required</p>}
            </div>
            
            <div>
              <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="edit-email"
                type="email"
                className={`input ${errorsEdit.email ? 'border-red-500' : ''}`}
                {...registerEdit('email', { required: true, pattern: /^\S+@\S+$/i })}
              />
              {errorsEdit.email?.type === 'required' && (
                <p className="mt-1 text-sm text-red-600">Email is required</p>
              )}
              {errorsEdit.email?.type === 'pattern' && (
                <p className="mt-1 text-sm text-red-600">Invalid email format</p>
              )}
            </div>
            
            <div>
              <label htmlFor="edit-mobile" className="block text-sm font-medium text-gray-700 mb-1">
                Mobile
              </label>
              <input
                id="edit-mobile"
                type="text"
                className="input"
                {...registerEdit('mobile')}
              />
            </div>
            
            <div>
              <label htmlFor="edit-city" className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                id="edit-city"
                type="text"
                className="input"
                {...registerEdit('city')}
              />
            </div>
            
            <div>
              <label htmlFor="edit-country" className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                id="edit-country"
                type="text"
                className="input"
                {...registerEdit('country')}
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="edit-address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                id="edit-address"
                type="text"
                className="input"
                {...registerEdit('address')}
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="edit-engagementDetails" className="block text-sm font-medium text-gray-700 mb-1">
                Engagement Details
              </label>
              <textarea
                id="edit-engagementDetails"
                rows={3}
                className="input"
                {...registerEdit('engagementDetails')}
              ></textarea>
            </div>
            
            <input type="hidden" {...registerEdit('id')} />
          </form>
        )}
      </Modal>
      
      {/* Delete Client Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Client"
        actions={
          <>
            <button
              type="button"
              className="btn btn-outline mr-3"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-outline bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
              onClick={handleDeleteClient}
            >
              Delete Client
            </button>
          </>
        }
      >
        <p>Are you sure you want to delete this client? This action cannot be undone.</p>
        {selectedClient && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p className="font-medium">{selectedClient.name}</p>
            <p className="text-sm text-gray-600">{selectedClient.companyName}</p>
            <p className="text-sm text-gray-600 mt-2">{selectedClient.email}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Clients;