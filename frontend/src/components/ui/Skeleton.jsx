import React from 'react';

const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-border-luxe/10 rounded-xl ${className}`}></div>
  );
};

export const ProductSkeleton = () => (
  <div className="space-y-3 sm:space-y-4">
    {/* Image area – responsive aspect ratio stays same */}
    <Skeleton className="aspect-[3/4] rounded-xl sm:rounded-2xl" />
    {/* Text area – smaller on mobile */}
    <div className="space-y-1.5 sm:space-y-2">
      <Skeleton className="h-3 sm:h-4 w-1/3" />
      <Skeleton className="h-4 sm:h-6 w-2/3" />
      <Skeleton className="h-3 sm:h-4 w-1/4" />
    </div>
  </div>
);

export default Skeleton;