import React from 'react';

const Skeleton = ({ className, variant = 'rect', width, height, isDark = false }) => {
  const baseClasses = `animate-pulse rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`;
  
  const variantClasses = {
    rect: "",
    circle: "rounded-full",
    text: "h-4 w-full mb-2"
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className || ''}`} 
      style={{ width, height }}
    />
  );
};

export default Skeleton;
