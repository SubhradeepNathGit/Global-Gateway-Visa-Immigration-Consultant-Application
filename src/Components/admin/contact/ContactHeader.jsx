import React from 'react'
import { Download } from 'lucide-react'

const ContactHeader = () => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Contact Messages</h1>
                <p className="text-slate-400">Manage and respond to user inquiries</p>
            </div>
            
        </div>

    )
}

export default ContactHeader