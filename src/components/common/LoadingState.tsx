import React from 'react';
import Spinner from '../ui/Spinner';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 'lg',
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 min-h-[400px]">
      <Spinner size={size} />
      {message && (
        <p className="mt-4 text-gray-500 text-center font-medium">{message}</p>
      )}
    </div>
  );
};

export default LoadingState;
