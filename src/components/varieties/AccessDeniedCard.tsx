
import React from 'react';
import { Card } from '@/components/ui/card';

interface AccessDeniedCardProps {
  title: string;
  message: string;
}

const AccessDeniedCard: React.FC<AccessDeniedCardProps> = ({ title, message }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-navy-100 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="navy-card p-8 text-center">
          <h2 className="text-xl font-medium text-red-600 mb-4">{title}</h2>
          <p className="text-red-700">{message}</p>
        </Card>
      </div>
    </div>
  );
};

export default AccessDeniedCard;
