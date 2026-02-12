import React from 'react'
import { UserPlus } from "lucide-react";

const UserHeader = () => {

    const handleNewUser = () => {
        console.log("Create new user");
        // In production: Open create user modal
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Users Management</h1>
                <p className="text-slate-400">Manage user accounts, visa applications, and course enrollments</p>
            </div>
          
        </div>
    )
}

export default UserHeader