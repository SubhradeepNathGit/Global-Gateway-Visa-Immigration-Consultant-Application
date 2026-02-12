import React from 'react'
import { Link } from 'react-router-dom'

const PolicyBanner = () => {
    return (
        <div className="relative h-64 md:h-80 bg-cover bg-center" style={{ backgroundImage: 'url(/PageBanner.jpg)' }}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm " />
            <div className="relative z-10 w-full h-full flex items-center px-4 md:px-10 lg:px-20">
                <div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                        Visa Policies
                    </h1>
                    <div className="flex items-center gap-2 text-sm md:text-base">
                        <Link to="/" className="text-red-400 hover:text-red-300 transition-colors">
                            Home
                        </Link>
                        <span className="text-red-400">›</span>
                        <span className="text-red-400">Visa Policies</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PolicyBanner