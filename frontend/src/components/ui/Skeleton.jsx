import React from 'react';

const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-border-luxe/10 rounded-xl ${className}`}></div>
  );
};

export const ProductSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="aspect-[3/4] rounded-2xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  </div>
);

export default Skeleton;
