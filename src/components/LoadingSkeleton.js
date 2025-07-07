import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="card animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
      
      {/* Content skeleton */}
      <div className="space-y-3">
        {/* Title skeleton */}
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        
        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
        
        {/* Info skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
        
        {/* Button skeleton */}
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      </div>
    </div>
  );
};

export default LoadingSkeleton; 