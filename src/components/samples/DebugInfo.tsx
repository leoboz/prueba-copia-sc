
import React from 'react';
import { Sample } from '@/types';
import { User } from '@/types';

interface DebugInfoProps {
  user: User | null;
  sample: Sample | null;
  userRole: string;
  hasPermission: boolean;
}

const DebugInfo: React.FC<DebugInfoProps> = ({ user, sample, userRole, hasPermission }) => {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  
  return (
    <div className="mb-4 p-3 bg-gray-100 rounded text-xs">
      <strong>Debug:</strong>
      <div>User: {user?.role} (ID: {user?.id})</div>
      <div>Sample: {sample?.status} (ID: {sample?.id})</div>
      <div>User Role: {userRole}</div>
      <div>Has Permission: {hasPermission ? 'Yes' : 'No'}</div>
      <div>Test IDs: {sample?.testIds?.join(', ') || 'None'}</div>
    </div>
  );
};

export default DebugInfo;
