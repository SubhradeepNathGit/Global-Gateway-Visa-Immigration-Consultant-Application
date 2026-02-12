import React from 'react'
import { Link } from 'react-router-dom'

const CourseBanner = () => {
    return (
        <div
            className="relative h-[250px] sm:h-[300px] bg-cover bg-center"
            style={{ backgroundImage: 'url(/PageBanner.jpg)' }}>
                
            <div className="absolute inset-0 bg-black bg-opacity-70"></div>
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center max-w-7xl">
                <h1 className="text-white font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] mb-2">
                    Immigration Courses
                </h1>
                <nav className="flex items-center space-x-2 text-[#FF5252] mt-1 text-sm sm:text-base">
                    {/* FIXED SPA NAVIGATION */}
                    <Link to='/' className="hover:text-white transition-colors underline-offset-4 hover:underline" >
                        Home
                    </Link>
                    <span>›</span>
                    <span>Courses</span>
                </nav>
            </div>
        </div>
    )
}

export default CourseBanner