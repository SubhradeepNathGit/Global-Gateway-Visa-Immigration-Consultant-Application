import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Globe2, MoveRight } from 'lucide-react'
import { motion } from 'framer-motion'

const CountryBanner = () => {
    return (
        <div
            className="relative h-[300px] md:h-[350px] flex items-center bg-gray-900 overflow-hidden"
        >
            {/* Dynamic Background Image with subtle zoom */}
            <motion.div 
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: 'url(/PageBanner.jpg)' }}
            />
            
            {/* Advanced Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10" />

            <div className="relative z-20 w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="max-w-3xl"
                >
                   

                    <h1 className="text-4xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                        Explore Your <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5252] to-[#ff8a8a]">Next Destination</span>
                    </h1>
                    
                    

                    <nav className="flex items-center text-sm font-bold">
                        <Link 
                            to="/" 
                            className="text-gray-400 hover:text-white transition-colors flex items-center group"
                        >
                            Home
                            <ChevronRight className="mx-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <span className="text-[#FF5252]">Countries</span>
                    </nav>
                </motion.div>
            </div>

            {/* Decorative element */}
            <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-[#FF5252]/5 blur-[120px] rounded-full -z-0 pointer-events-none" />
        </div>
    )
}

export default CountryBanner