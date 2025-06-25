import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, actions }) => {
  return (
    <div className="md:flex md:items-center md:justify-between mb-8">
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
      {actions && (
        <div className="mt-4 flex md:mt-0 md:ml-4">{actions}</div>
      )}
    </div>
  );
};

export default PageHeader;