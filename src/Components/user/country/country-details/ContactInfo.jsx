import { Mail, Phone } from 'lucide-react'
import React from 'react'

const ContactInfo = () => {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 py-6 sm:py-8">
            <a href="tel:+1234567890" className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">+1 (234) 567-890</span>
            </a>
            <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
            <a href="mailto:info@visaconsult.com" className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">info@visaconsult.com</span>
            </a>
        </div>
    )
}

export default ContactInfo