import React from 'react'
import { Link } from 'react-router-dom'
import Skeleton from '../../Skeleton'

const DashboardHeader = ({ isLoading }) => {
  if (isLoading) {
    return (
      <div className="relative h-72 overflow-hidden bg-slate-200 animate-pulse">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <Skeleton className="h-10 w-64 mb-4 bg-white/20" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-12 bg-white/20" />
            <Skeleton className="h-4 w-4 bg-white/20" />
            <Skeleton className="h-4 w-20 bg-white/20" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-72 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/PageBanner.jpg)' }}
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 -mt-10">Global Gateway Profile</h1>
        <div className="flex items-center text-red-300 space-x-2">
          <Link to='/' className="hover:text-white cursor-pointer transition">Home</Link>
          <span>›</span>
          <span className="text-red-400">Dashboard</span>
        </div>
      </div>
    </div>
  )
}

export default DashboardHeader