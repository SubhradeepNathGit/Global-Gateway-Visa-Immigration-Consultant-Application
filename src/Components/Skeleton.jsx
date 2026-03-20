import React from 'react';

const Skeleton = ({ className, variant = 'rect', width, height }) => {
  const baseClasses = "animate-pulse bg-slate-200 rounded-lg";
  
  const variantClasses = {
    rect: "",
    circle: "rounded-full",
    text: "h-4 w-full mb-2"
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`} 
      style={{ width, height }}
    />
  );
};

export default Skeleton;
