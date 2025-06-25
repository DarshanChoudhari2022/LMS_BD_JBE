import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BarChart2, Users, Briefcase, Building } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 flex md:hidden ${sidebarOpen ? '' : 'hidden'}`} role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true" onClick={() => setSidebarOpen(false)}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-orange-700">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          <div className="flex-shrink-0 flex items-center px-4 py-4">
            <h1 className="text-2xl font-bold text-white">JBE Lead Manager</h1>
          </div>
          <div className="flex-1 h-0 overflow-y-auto">
            <nav className="px-2 space-y-1">
              <Link
                to="/"
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  location.pathname === '/' 
                    ? 'bg-orange-800 text-white' 
                    : 'text-orange-100 hover:bg-orange-800 hover:text-white'
                }`}
              >
                <BarChart2 className="mr-4 h-6 w-6 text-orange-200" />
                Dashboard
              </Link>
              <Link
                to="/leads"
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  location.pathname === '/leads' 
                    ? 'bg-orange-800 text-white' 
                    : 'text-orange-100 hover:bg-orange-800 hover:text-white'
                }`}
              >
                <Users className="mr-4 h-6 w-6 text-orange-200" />
                Lead Database
              </Link>
              <Link
                to="/partners"
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  location.pathname === '/partners' 
                    ? 'bg-orange-800 text-white' 
                    : 'text-orange-100 hover:bg-orange-800 hover:text-white'
                }`}
              >
                <Briefcase className="mr-4 h-6 w-6 text-orange-200" />
                JBE Partners
              </Link>
              <Link
                to="/clients"
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  location.pathname === '/clients' 
                    ? 'bg-orange-800 text-white' 
                    : 'text-orange-100 hover:bg-orange-800 hover:text-white'
                }`}
              >
                <Building className="mr-4 h-6 w-6 text-orange-200" />
                JBE Clients
              </Link>
            </nav>
          </div>
        </div>
        <div className="flex-shrink-0 w-14"></div>
      </div>

      {/* Desktop sidebar */}
      <Sidebar location={location} />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}