
import React from 'react';

const LoadingState: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-countryside-green-dark"></div>
        <span className="ml-2 text-countryside-brown">{message}</span>
      </div>
    </div>
  );
};

export default LoadingState;
