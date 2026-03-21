import React from 'react';
import Skeleton from './Skeleton';

const DashboardSkeleton = ({ type = 'admin' }) => {
  const isDark = type === 'admin';
  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const sidebarColor = isDark ? 'bg-slate-800/50' : 'bg-white';
  const navbarColor = isDark ? 'bg-slate-800/80' : 'bg-white';

  return (
    <div className={`min-h-screen flex ${bgColor} transition-colors duration-300`}>
      {/* Sidebar Skeleton */}
      <div className={`hidden md:block w-64 ${sidebarColor} border-r ${isDark ? 'border-slate-700/50' : 'border-gray-200'}`}>
        <div className="p-6 space-y-8">
          <Skeleton isDark={isDark} className="h-8 w-3/4 mb-10" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} isDark={isDark} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col">
        {/* Navbar Skeleton */}
        <div className={`h-16 md:h-18 border-b ${isDark ? 'border-slate-700/50' : 'border-gray-200'} ${navbarColor} flex items-center justify-between px-6`}>
          <Skeleton isDark={isDark} className="h-6 w-32" />
          <div className="flex items-center gap-4">
            <Skeleton isDark={isDark} variant="circle" className="w-10 h-10" />
            <Skeleton isDark={isDark} variant="circle" className="w-10 h-10" />
          </div>
        </div>

        {/* Content Area Skeleton */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Page Header */}
          <div className="flex items-center gap-4 mb-8">
            <Skeleton isDark={isDark} className="w-12 h-12 rounded-lg" />
            <div className="space-y-2">
              <Skeleton isDark={isDark} className="h-8 w-64" />
              <Skeleton isDark={isDark} className="h-4 w-48" />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-gray-200'}`}>
                <div className="flex justify-between items-start mb-4">
                  <Skeleton isDark={isDark} className="h-4 w-24" />
                  <Skeleton isDark={isDark} variant="circle" className="w-6 h-6" />
                </div>
                <Skeleton isDark={isDark} className="h-8 w-16 mb-2" />
                <Skeleton isDark={isDark} className="h-4 w-20" />
              </div>
            ))}
          </div>

          {/* Large Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`lg:col-span-2 p-6 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-gray-200'} h-96`}>
              <Skeleton isDark={isDark} className="h-6 w-48 mb-6" />
              <Skeleton isDark={isDark} className="h-full w-full opacity-20" />
            </div>
            <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-gray-200'} space-y-6`}>
              <Skeleton isDark={isDark} className="h-6 w-32 mb-4" />
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton isDark={isDark} variant="circle" className="w-10 h-10 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton isDark={isDark} className="h-4 w-full" />
                    <Skeleton isDark={isDark} className="h-3 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
