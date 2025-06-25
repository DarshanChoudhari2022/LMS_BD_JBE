import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import StatusBadge from '../components/ui/StatusBadge';
import Card from '../components/ui/Card';
import { useOfferings } from '../context/OfferingContext';
import { Offering } from '../types';
import { useForm } from 'react-hook-form';

const Offerings: React.FC = () => {
  const { offerings, addOffering, updateOffering, deleteOffering, searchOfferings } = useOfferings();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOffering, setSelectedOffering] = useState<Offering | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOfferings, setFilteredOfferings] = useState<Offering[]>(offerings);
  
  const { register: registerAdd, handleSubmit: handleSubmitAdd, reset: resetAdd, formState: { errors: errorsAdd } } = useForm<Omit<Offering, 'id'>>();
  
  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, formState: { errors: errorsEdit } } = useForm<Offering>();
  
  const offeringColumns = [
    {
      id: 'name',
      header: 'Name',
      accessor: (row: Offering) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-sm text-gray-500">{row.category}</div>
        </div>
      ),
      sortable: true,
    },
    {
      id: 'description',
      header: 'Description',
      accessor: (row: Offering) => (
        <div className="max-w-md truncate">{row.description}</div>
      ),
      sortable: false,
    },
    {
      id: 'pricing',
      header: 'Pricing',
      accessor: (row: Offering) => <span>{row.pricing}</span>,
      sortable: true,
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (row: Offering) => <StatusBadge status={row.status} type="offering" />,
      sortable: true,
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row: Offering) => (
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
  
  const handleAddOffering = (data: Omit<Offering, 'id'>) => {
    addOffering(data);
    setIsAddModalOpen(false);
    resetAdd();
  };
  
  const handleEditClick = (offering: Offering) => {
    setSelectedOffering(offering);
    resetEdit(offering);
    setIsEditModalOpen(true);
  };
  
  const handleDeleteClick = (offering: Offering) => {
    setSelectedOffering(offering);
    setIsDeleteModalOpen(true);
  };
  
  const handleEditOffering = (data: Offering) => {
    if (selectedOffering) {
      updateOffering(selectedOffering.id, data);
      setIsEditModalOpen(false);
    }
  };
  
  const handleDeleteOffering = () => {
    if (selectedOffering) {
      deleteOffering(selectedOffering.id);
      setIsDeleteModalOpen(false);
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredOfferings(offerings);
    } else {
      setFilteredOfferings(searchOfferings(query));
    }
  };
  
  const handleOfferingClick = (offering: Offering) => {
    setSelectedOffering(offering);
    // Could expand with a view details modal if needed
  };
  
  // Group offerings by category for the grid view
  const offeringsByCategory = offerings.reduce((acc, offering) => {
    const category = offering.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(offering);
    return acc;
  }, {} as Record<string, Offering[]>);
  
  return (
    <div>
      <PageHeader 
        title="Offerings" 
        description="Manage your products and services"
        actions={
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Offering
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
            placeholder="Search offerings..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>
      
      {/* Offerings grid view by category */}
      {!searchQuery && (
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Offerings by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(offeringsByCategory).map(([category, categoryOfferings]) => (
              <Card key={category} className="relative hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-lg font-medium mb-3">{category}</h3>
                <div className="space-y-3">
                  {categoryOfferings.map((offering) => (
                    <div 
                      key={offering.id} 
                      className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleOfferingClick(offering)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{offering.name}</p>
                          <p className="text-sm text-gray-500 mt-1">{offering.pricing}</p>
                        </div>
                        <StatusBadge status={offering.status} type="offering" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Offerings table view (shown always for search results or as a fallback) */}
      <div>
        <h2 className="text-lg font-medium mb-4">
          {searchQuery ? 'Search Results' : 'All Offerings'}
        </h2>
        <DataTable 
          columns={offeringColumns} 
          data={searchQuery ? filteredOfferings : offerings}
          itemsPerPage={10}
          onRowClick={handleOfferingClick}
        />
      </div>
      
      {/* Add Offering Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetAdd();
        }}
        title="Add New Offering"
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
              onClick={handleSubmitAdd(handleAddOffering)}
            >
              Add Offering
            </button>
          </>
        }
      >
        <form className="space-y-4">
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
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              className={`input ${errorsAdd.description ? 'border-red-500' : ''}`}
              {...registerAdd('description', { required: true })}
            ></textarea>
            {errorsAdd.description && <p className="mt-1 text-sm text-red-600">Description is required</p>}
          </div>
          
          <div>
            <label htmlFor="pricing" className="block text-sm font-medium text-gray-700 mb-1">
              Pricing
            </label>
            <input
              id="pricing"
              type="text"
              className={`input ${errorsAdd.pricing ? 'border-red-500' : ''}`}
              {...registerAdd('pricing', { required: true })}
            />
            {errorsAdd.pricing && <p className="mt-1 text-sm text-red-600">Pricing is required</p>}
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
        </form>
      </Modal>
      
      {/* Edit Offering Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Offering"
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
              onClick={handleSubmitEdit(handleEditOffering)}
            >
              Save Changes
            </button>
          </>
        }
      >
        {selectedOffering && (
          <form className="space-y-4">
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
              <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="edit-description"
                rows={4}
                className={`input ${errorsEdit.description ? 'border-red-500' : ''}`}
                {...registerEdit('description', { required: true })}
              ></textarea>
              {errorsEdit.description && <p className="mt-1 text-sm text-red-600">Description is required</p>}
            </div>
            
            <div>
              <label htmlFor="edit-pricing" className="block text-sm font-medium text-gray-700 mb-1">
                Pricing
              </label>
              <input
                id="edit-pricing"
                type="text"
                className={`input ${errorsEdit.pricing ? 'border-red-500' : ''}`}
                {...registerEdit('pricing', { required: true })}
              />
              {errorsEdit.pricing && <p className="mt-1 text-sm text-red-600">Pricing is required</p>}
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
            
            <input type="hidden" {...registerEdit('id')} />
          </form>
        )}
      </Modal>
      
      {/* Delete Offering Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Offering"
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
              onClick={handleDeleteOffering}
            >
              Delete Offering
            </button>
          </>
        }
      >
        <p>Are you sure you want to delete this offering? This action cannot be undone.</p>
        {selectedOffering && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p className="font-medium">{selectedOffering.name}</p>
            <p className="text-sm text-gray-600">{selectedOffering.category}</p>
            <p className="text-sm text-gray-600 mt-2">{selectedOffering.pricing}</p>
            <div className="mt-2">
              <StatusBadge status={selectedOffering.status} type="offering" />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Offerings;