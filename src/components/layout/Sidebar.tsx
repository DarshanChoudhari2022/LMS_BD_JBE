import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, Users, Briefcase, Building } from 'lucide-react';

interface SidebarProps {
  location: {
    pathname: string;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ location }) => {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-orange-700">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-2xl font-bold text-white">JBE Lead Manager</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              <Link
                to="/"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  location.pathname === '/' 
                    ? 'bg-orange-800 text-white' 
                    : 'text-orange-100 hover:bg-orange-800 hover:text-white'
                }`}
              >
                <BarChart2 className="mr-3 h-6 w-6 text-orange-200" />
                Dashboard
              </Link>
              <Link
                to="/leads"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  location.pathname === '/leads' 
                    ? 'bg-orange-800 text-white' 
                    : 'text-orange-100 hover:bg-orange-800 hover:text-white'
                }`}
              >
                <Users className="mr-3 h-6 w-6 text-orange-200" />
                Lead Database
              </Link>
              <Link
                to="/partners"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  location.pathname === '/partners' 
                    ? 'bg-orange-800 text-white' 
                    : 'text-orange-100 hover:bg-orange-800 hover:text-white'
                }`}
              >
                <Briefcase className="mr-3 h-6 w-6 text-orange-200" />
                JBE Partners
              </Link>
              <Link
                to="/clients"
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  location.pathname === '/clients' 
                    ? 'bg-orange-800 text-white' 
                    : 'text-orange-100 hover:bg-orange-800 hover:text-white'
                }`}
              >
                <Building className="mr-3 h-6 w-6 text-orange-200" />
                JBE Clients
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;