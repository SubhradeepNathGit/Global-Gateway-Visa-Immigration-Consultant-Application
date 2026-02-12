import React, { useState } from 'react'
import { FileText } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

const VisaListDropdown = ({ availableVisa = [] }) => {
    // console.log('Available visa list', availableVisa);

    const [open, setOpen] = useState(false);

    return (
        <div className="">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <button
                    onClick={() => setOpen(!open)}
                    className="w-full flex justify-between items-center cursor-pointer"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow">
                            <FileText className="w-5 h-5 text-red-500" />
                        </div>
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Available Visa
                        </span>
                    </div>

                    <motion.div
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-5 h-5 text-gray-600"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </motion.div>
                </button>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-4 pl-2 pr-2 space-y-3">
                            {availableVisa?.length > 0 ? (
                                availableVisa?.map(item => (
                                    <div
                                        key={item?.id}
                                        className="flex items-start gap-2 ml-12"
                                    >
                                        <span className="w-2 h-2 mt-2 rounded-full bg-red-500" />
                                        <p className="text-gray-700 text-sm leading-relaxed inline">
                                            {item?.visa?.visa_type}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm ml-12">No visa available.</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


export default VisaListDropdown