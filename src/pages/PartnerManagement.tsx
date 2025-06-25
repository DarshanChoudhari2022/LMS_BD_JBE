import React, { useState } from 'react';
import { Plus, Filter, Download, Upload, Search, Phone, Mail } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import StatusBadge from '../components/ui/StatusBadge';
import { usePartners } from '../context/PartnerContext';
import { Partner } from '../types';
import { useForm } from 'react-hook-form';

const PartnerManagement: React.FC = () => {
  const { partners, addPartner, updatePartner, deletePartner, searchPartners } = usePartners();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>(partners);
  
  const { register: registerAdd, handleSubmit: handleSubmitAdd, reset: resetAdd, formState: { errors: errorsAdd } } = useForm<Omit<Partner, 'id' | 'createdAt'>>();
  
  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, formState: { errors: errorsEdit } } = useForm<Partner>();
  
  const partnerColumns = [
    {
      id: 'name',
      header: 'Partner Name',
      accessor: (row: Partner) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-sm text-gray-500">{row.category}</div>
        </div>
      ),
      sortable: true,
    },
    {
      id: 'contact',
      header: 'Contact Information',
      accessor: (row: Partner) => (
        <div>
          <div className="font-medium">{row.contactPerson}</div>
          <div className="flex items-center text-sm text-gray-500">
            <Mail className="h-3.5 w-3.5 mr-1" />
            <a href={`mailto:${row.email}`} className="hover:text-blue-600">{row.email}</a>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Phone className="h-3.5 w-3.5 mr-1" />
            <a href={`tel:${row.phone}`} className="hover:text-blue-600">{row.phone}</a>
          </div>
        </div>
      ),
      sortable: false,
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row: Partner) => <StatusBadge status={row.status} type="partner" />,
      sortable: true,
    },
    {
      id: 'agreementDate',
      header: 'Agreement Date',
      accessor: (row: Partner) => <span>{row.agreementDate}</span>,
      sortable: true,
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row: Partner) => (
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
  
  const handleAddPartner = (data: Omit<Partner, 'id' | 'createdAt'>) => {
    addPartner(data);
    setIsAddModalOpen(false);
    resetAdd();
  };
  
  const handleEditClick = (partner: Partner) => {
    setSelectedPartner(partner);
    resetEdit(partner);
    setIsEditModalOpen(true);
  };
  
  const handleDeleteClick = (partner: Partner) => {
    setSelectedPartner(partner);
    setIsDeleteModalOpen(true);
  };
  
  const handleEditPartner = (data: Partner) => {
    if (selectedPartner) {
      updatePartner(selectedPartner.id, data);
      setIsEditModalOpen(false);
    }
  };
  
  const handleDeletePartner = () => {
    if (selectedPartner) {
      deletePartner(selectedPartner.id);
      setIsDeleteModalOpen(false);
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredPartners(partners);
    } else {
      setFilteredPartners(searchPartners(query));
    }
  };
  
  const handlePartnerClick = (partner: Partner) => {
    // View partner details or handle click
    handleEditClick(partner);
  };
  
  return (
    <div>
      <PageHeader 
        title="Partner Management" 
        description="Manage your business partners and relationships"
        actions={
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Partner
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
            placeholder="Search partners..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
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
      
      {/* Partners table */}
      <DataTable 
        columns={partnerColumns} 
        data={searchQuery ? filteredPartners : partners}
        itemsPerPage={10}
        onRowClick={handlePartnerClick}
      />
      
      {/* Add Partner Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetAdd();
        }}
        title="Add New Partner"
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
              onClick={handleSubmitAdd(handleAddPartner)}
            >
              Add Partner
            </button>
          </>
        }
      >
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Partner Name
            </label>
            <input
              id="name"
              type="text"
              className={`input ${errorsAdd.name ? 'border-red-500' : ''}`}
              {...registerAdd('name', { required: true })}
            />
            {errorsAdd.name && <p className="mt-1 text-sm text-red-600">Partner name is required</p>}
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              id="category"
              type="text"
              className={`input ${errorsAdd.category ? 'border-red-500' : ''}`}
              {...registerAdd('category', { required: true })}
            />
            {errorsAdd.category && <p className="mt-1 text-sm text-red-600">Category is required</p>}
          </div>
          
          <div>
            <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person
            </label>
            <input
              id="contactPerson"
              type="text"
              className={`input ${errorsAdd.contactPerson ? 'border-red-500' : ''}`}
              {...registerAdd('contactPerson', { required: true })}
            />
            {errorsAdd.contactPerson && <p className="mt-1 text-sm text-red-600">Contact person is required</p>}
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
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              id="phone"
              type="text"
              className={`input ${errorsAdd.phone ? 'border-red-500' : ''}`}
              {...registerAdd('phone', { required: true })}
            />
            {errorsAdd.phone && <p className="mt-1 text-sm text-red-600">Phone is required</p>}
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              className={`select ${errorsAdd.status ? 'border-red-500' : ''}`}
              {...registerAdd('status', { required: true })}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            {errorsAdd.status && <p className="mt-1 text-sm text-red-600">Status is required</p>}
          </div>
          
          <div>
            <label htmlFor="agreementDate" className="block text-sm font-medium text-gray-700 mb-1">
              Agreement Date
            </label>
            <input
              id="agreementDate"
              type="date"
              className={`input ${errorsAdd.agreementDate ? 'border-red-500' : ''}`}
              {...registerAdd('agreementDate', { required: true })}
            />
            {errorsAdd.agreementDate && <p className="mt-1 text-sm text-red-600">Agreement date is required</p>}
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
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              rows={3}
              className="input"
              {...registerAdd('notes')}
            ></textarea>
          </div>
        </form>
      </Modal>
      
      {/* Edit Partner Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Partner"
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
              onClick={handleSubmitEdit(handleEditPartner)}
            >
              Save Changes
            </button>
          </>
        }
      >
        {selectedPartner && (
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                Partner Name
              </label>
              <input
                id="edit-name"
                type="text"
                className={`input ${errorsEdit.name ? 'border-red-500' : ''}`}
                {...registerEdit('name', { required: true })}
              />
              {errorsEdit.name && <p className="mt-1 text-sm text-red-600">Partner name is required</p>}
            </div>
            
            <div>
              <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                id="edit-category"
                type="text"
                className={`input ${errorsEdit.category ? 'border-red-500' : ''}`}
                {...registerEdit('category', { required: true })}
              />
              {errorsEdit.category && <p className="mt-1 text-sm text-red-600">Category is required</p>}
            </div>
            
            <div>
              <label htmlFor="edit-contactPerson" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Person
              </label>
              <input
                id="edit-contactPerson"
                type="text"
                className={`input ${errorsEdit.contactPerson ? 'border-red-500' : ''}`}
                {...registerEdit('contactPerson', { required: true })}
              />
              {errorsEdit.contactPerson && <p className="mt-1 text-sm text-red-600">Contact person is required</p>}
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
              <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                id="edit-phone"
                type="text"
                className={`input ${errorsEdit.phone ? 'border-red-500' : ''}`}
                {...registerEdit('phone', { required: true })}
              />
              {errorsEdit.phone && <p className="mt-1 text-sm text-red-600">Phone is required</p>}
            </div>
            
            <div>
              <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="edit-status"
                className={`select ${errorsEdit.status ? 'border-red-500' : ''}`}
                {...registerEdit('status', { required: true })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              {errorsEdit.status && <p className="mt-1 text-sm text-red-600">Status is required</p>}
            </div>
            
            <div>
              <label htmlFor="edit-agreementDate" className="block text-sm font-medium text-gray-700 mb-1">
                Agreement Date
              </label>
              <input
                id="edit-agreementDate"
                type="date"
                className={`input ${errorsEdit.agreementDate ? 'border-red-500' : ''}`}
                {...registerEdit('agreementDate', { required: true })}
              />
              {errorsEdit.agreementDate && <p className="mt-1 text-sm text-red-600">Agreement date is required</p>}
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
              <label htmlFor="edit-notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                id="edit-notes"
                rows={3}
                className="input"
                {...registerEdit('notes')}
              ></textarea>
            </div>
            
            <input type="hidden" {...registerEdit('id')} />
            <input type="hidden" {...registerEdit('createdAt')} />
          </form>
        )}
      </Modal>
      
      {/* Delete Partner Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Partner"
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
              onClick={handleDeletePartner}
            >
              Delete Partner
            </button>
          </>
        }
      >
        <p>Are you sure you want to delete this partner? This action cannot be undone.</p>
        {selectedPartner && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p className="font-medium">{selectedPartner.name}</p>
            <p className="text-sm text-gray-600">{selectedPartner.category}</p>
            <p className="text-sm text-gray-600">{selectedPartner.contactPerson}</p>
            <div className="mt-2">
              <StatusBadge status={selectedPartner.status} type="partner" />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PartnerManagement;