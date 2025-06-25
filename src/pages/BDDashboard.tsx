import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import DataTable from '../components/ui/DataTable';
import { Users, Clock, CheckCircle } from 'lucide-react';

const BDDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader 
        title="BD Associate Dashboard" 
        description="Manage your assigned leads"
      />
      
      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-start">
            <div className="p-3 rounded-full bg-orange-100 border border-orange-200">
              <Users className="h-6 w-6 text-orange-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-orange-900">My Leads</p>
              <h4 className="mt-1 text-3xl font-semibold text-orange-900">0</h4>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-start">
            <div className="p-3 rounded-full bg-orange-100 border border-orange-200">
              <Clock className="h-6 w-6 text-orange-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-orange-900">Pending Follow-ups</p>
              <h4 className="mt-1 text-3xl font-semibold text-orange-900">0</h4>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-start">
            <div className="p-3 rounded-full bg-orange-100 border border-orange-200">
              <CheckCircle className="h-6 w-6 text-orange-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-orange-900">Converted Leads</p>
              <h4 className="mt-1 text-3xl font-semibold text-orange-900">0</h4>
            </div>
          </div>
        </Card>
      </div>

      {/* My Leads Table */}
      <Card title="My Assigned Leads">
        <DataTable 
          columns={[
            {
              id: 'name',
              header: 'Name',
              accessor: (row: any) => row.name,
              sortable: true,
            },
            {
              id: 'status',
              header: 'Status',
              accessor: (row: any) => row.status,
              sortable: true,
            },
            {
              id: 'lastInteraction',
              header: 'Last Interaction',
              accessor: (row: any) => row.lastInteraction,
              sortable: true,
            },
            {
              id: 'nextAction',
              header: 'Next Action',
              accessor: (row: any) => row.nextAction,
              sortable: true,
            }
          ]}
          data={[]}
          itemsPerPage={10}
        />
      </Card>
    </div>
  );
};

export default BDDashboard;