import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;