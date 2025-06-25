import React from 'react';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, Award, Clock, ArrowRight } from 'lucide-react';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import { useLeads } from '../context/LeadContext';
import { usePartners } from '../context/PartnerContext';
import { useClients } from '../context/ClientContext';

const Dashboard: React.FC = () => {
  const { leads, filterLeadsByStatus } = useLeads();
  const { partners } = usePartners();
  const { clients } = useClients();
  
  // Calculate KPIs
  const liveLeads = filterLeadsByStatus('Live');
  const closedLeads = filterLeadsByStatus('Closed');
  const lostLeads = filterLeadsByStatus('Lost');
  
  const conversionRate = leads.length > 0 
    ? Math.round((closedLeads.length / leads.length) * 100) 
    : 0;
  
  const activePartners = partners.filter(p => p.status === 'Active');
  
  return (
    <div>
      <PageHeader 
        title="Dashboard" 
        description="Key performance indicators and business overview"
      />
      
      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-start">
            <div className="p-3 rounded-full bg-blue-100 border border-blue-200">
              <Users className="h-6 w-6 text-blue-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-900">Total Leads</p>
              <h4 className="mt-1 text-3xl font-semibold text-blue-900">{leads.length}</h4>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                Live: {liveLeads.length}
              </span>
              <span className="ml-2 inline-block px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">
                Closed: {closedLeads.length}
              </span>
              <span className="ml-2 inline-block px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                Lost: {lostLeads.length}
              </span>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
          <div className="flex items-start">
            <div className="p-3 rounded-full bg-teal-100 border border-teal-200">
              <TrendingUp className="h-6 w-6 text-teal-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-teal-900">Conversion Rate</p>
              <h4 className="mt-1 text-3xl font-semibold text-teal-900">{conversionRate}%</h4>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-teal-800">
            <p>{closedLeads.length} out of {leads.length} leads converted</p>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-start">
            <div className="p-3 rounded-full bg-purple-100 border border-purple-200">
              <Award className="h-6 w-6 text-purple-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-900">Active Partners</p>
              <h4 className="mt-1 text-3xl font-semibold text-purple-900">{activePartners.length}</h4>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-purple-800">
            <p>{activePartners.length} of {partners.length} partners are active</p>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <div className="flex items-start">
            <div className="p-3 rounded-full bg-amber-100 border border-amber-200">
              <Clock className="h-6 w-6 text-amber-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-amber-900">Total Clients</p>
              <h4 className="mt-1 text-3xl font-semibold text-amber-900">{clients.length}</h4>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-amber-800">
            <p>{clients.filter(c => c.status === 'Active').length} active clients</p>
          </div>
        </Card>
      </div>
      
      {/* Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card title="Recent Leads">
          <div className="divide-y divide-gray-200">
            {leads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="py-3 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{lead.name}</h4>
                  <p className="text-xs text-gray-500">{lead.company}</p>
                </div>
                <div className="flex items-center">
                  <span className={`
                    px-2 py-1 text-xs rounded-full
                    ${lead.status === 'Live' ? 'bg-green-100 text-green-800' : 
                      lead.status === 'Closed' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'}
                  `}>
                    {lead.status}
                  </span>
                  <Link to={`/leads/${lead.id}`} className="ml-4 text-blue-600 hover:text-blue-800">
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link to="/leads" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
              View all leads <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </Card>
        
        {/* Recent Partners */}
        <Card title="Active Partners">
          <div className="divide-y divide-gray-200">
            {activePartners.slice(0, 5).map((partner) => (
              <div key={partner.id} className="py-3 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{partner.name}</h4>
                  <p className="text-xs text-gray-500">{partner.contactPerson}</p>
                </div>
                <div className="flex items-center">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {partner.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link to="/partners" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
              View all partners <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </Card>
      </div>
      
      {/* Status Overview */}
      <Card title="Lead Status Overview" className="mb-8">
        <div className="flex h-8 mb-4">
          {leads.length > 0 && (
            <>
              <div 
                className="bg-green-500 h-full rounded-l-lg" 
                style={{ width: `${(liveLeads.length / leads.length) * 100}%` }}
                title={`Live: ${liveLeads.length} (${Math.round((liveLeads.length / leads.length) * 100)}%)`}
              ></div>
              <div 
                className="bg-amber-500 h-full" 
                style={{ width: `${(closedLeads.length / leads.length) * 100}%` }}
                title={`Closed: ${closedLeads.length} (${Math.round((closedLeads.length / leads.length) * 100)}%)`}
              ></div>
              <div 
                className="bg-red-500 h-full rounded-r-lg" 
                style={{ width: `${(lostLeads.length / leads.length) * 100}%` }}
                title={`Lost: ${lostLeads.length} (${Math.round((lostLeads.length / leads.length) * 100)}%)`}
              ></div>
            </>
          )}
        </div>
        <div className="flex justify-between text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span>Live: {liveLeads.length}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
            <span>Closed: {closedLeads.length}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span>Lost: {lostLeads.length}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;