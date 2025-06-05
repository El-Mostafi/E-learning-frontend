import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="container py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="flex justify-between items-center mb-8">
          <div className="h-8 bg-gray-200 rounded-md w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded-md w-40 animate-pulse"></div>
        </div>
        
        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
              {/* Image placeholder */}
              <div className="h-48 bg-gray-300 w-full"></div>
              
              {/* Content placeholders */}
              <div className="p-5">
                <div className="flex justify-between mb-4">
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-7 bg-gray-200 rounded mb-3 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
                
                <div className="flex justify-between mb-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
                
                <div className="h-2 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-10 bg-gray-200 rounded-md w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingState;