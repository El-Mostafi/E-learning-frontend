import React from 'react';
import { BookOpen } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  message = "You haven't enrolled in any courses yet" 
}) => {
  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-sm p-10 text-center">
      <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-blue-50">
        <BookOpen className="w-8 h-8 text-blue-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Courses Found</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{message}</p>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
        Browse Courses
      </button>
    </div>
  );
};

export default EmptyState;