import React from 'react';
import Skeleton from './Skeleton';

const DashboardSkeleton = ({ type = 'admin', isContentOnly = false }) => {
  if (type === 'user') {
    return (
      <div className="min-h-screen bg-slate-50 animate-fadeIn">
        {/* Header Banner Skeleton */}
        <div className="relative h-40 sm:h-56 md:h-72 overflow-hidden bg-slate-200 animate-pulse">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
            <Skeleton className="h-10 w-64 mb-4 bg-white/40" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-12 bg-white/30" />
              <Skeleton className="h-4 w-4 bg-white/30" />
              <Skeleton className="h-4 w-20 bg-white/30" />
            </div>
          </div>
        </div>

        {/* Profile Card Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 md:-mt-20 relative z-20 mb-8">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 md:p-8 border border-slate-100">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 animate-pulse">
              <Skeleton variant="circle" className="w-32 h-32 border-4 border-slate-100 shadow-lg shrink-0" />
              <div className="flex-1 space-y-4 w-full text-center md:text-left">
                <Skeleton className="h-8 w-64 mx-auto md:mx-0" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48 mx-auto md:mx-0" />
                  <Skeleton className="h-4 w-40 mx-auto md:mx-0" />
                </div>
                <Skeleton className="h-4 w-full max-w-md mx-auto md:mx-0" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-12" />
                  </div>
                  <Skeleton variant="circle" className="w-12 h-12" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs & Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 space-y-4">
            <div className="flex gap-4 border-b border-slate-200 pb-4">
              <Skeleton className="h-8 w-32 rounded-lg" />
              <Skeleton className="h-8 w-32 rounded-lg" />
              <Skeleton className="h-8 w-32 rounded-lg" />
              <Skeleton className="h-8 w-32 rounded-lg" />
            </div>
            <div className="space-y-4 pt-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border border-slate-200 rounded-lg p-6 animate-pulse space-y-3">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-full max-w-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isDark = type === 'admin';
  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const sidebarColor = isDark ? 'bg-slate-800/50' : 'bg-white';
  const navbarColor = isDark ? 'bg-slate-800/80' : 'bg-white';

  const content = (
    <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 animate-fadeIn">
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
  );

  if (isContentOnly) {
    return content;
  }

  return (
    <div className={`min-h-screen flex ${bgColor} transition-colors duration-300 animate-fadeIn`}>
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
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar Skeleton */}
        <div className={`h-16 md:h-18 border-b ${isDark ? 'border-slate-700/50' : 'border-gray-200'} ${navbarColor} flex items-center justify-between px-6`}>
          <Skeleton isDark={isDark} className="h-6 w-32" />
          <div className="flex items-center gap-4">
            <Skeleton isDark={isDark} variant="circle" className="w-10 h-10" />
            <Skeleton isDark={isDark} variant="circle" className="w-10 h-10" />
          </div>
        </div>

        {content}
      </div>
    </div>
  );
};

export default DashboardSkeleton;
