import React from 'react';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  message = "You haven't enrolled in any courses yet" 
}) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center  p-10 text-center">
      <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-blue-50">
        <BookOpen className="w-8 h-8 text-blue-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Courses Found</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{message}</p>
      <button onClick={() =>navigate('/courses')} className="theme-btn">
        Browse Courses
      </button>
    </div>
  );
};

export default EmptyState;