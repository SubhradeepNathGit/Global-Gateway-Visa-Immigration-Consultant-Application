import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ShieldX, ShieldCheck, ShieldAlert, HandHelping } from "lucide-react";
import StatusBadge from './userDetails/UserStatusBadge';
import UserRowExpand from './../../../Components/admin/user/UserRowExpand';

const UserRow = ({ user, handleUserData, setAlertModalOpen }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    // console.log('User Data', user);

    return (
        <>
            {/* Main Row */}
            <tr className="hover:bg-slate-700/20 transition-colors border-b border-slate-700/50">
                <td className="px-4 sm:px-6 py-4">
                    <button onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1 hover:bg-slate-700/50 rounded transition-colors cursor-pointer">
                        {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                    </button>
                </td>

                {/* Profile */}
                <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                            {user?.avatar_url ? (
                                <img src={user?.avatar_url} alt=""
                                    className='w-10 h-10 rounded-full border border-blue-500/30'
                                />) : (
                                <span className="text-blue-400 font-semibold text-sm">
                                    {user?.name?.split(' ')?.map(n => n[0])?.join('').toUpperCase()}
                                </span>
                            )}
                        </div>

                        <div>
                            <div className="text-sm font-medium text-white">{user?.name ? user?.name : 'N/A'}</div>
                            <div className="text-xs text-slate-400">{user?.email ? user?.email : 'N/A'}</div>
                        </div>
                    </div>
                </td>

                {/* Phone */}
                <td className="hidden md:table-cell px-4 sm:px-6 py-4">
                    <div className="text-sm text-slate-300">{user?.phone ? user?.phone : 'N/A'}</div>
                </td>

                {/* Verification */}
                <td className="hidden lg:table-cell px-4 sm:px-6 py-4">
                    <StatusBadge status={user?.is_verified} />
                </td>

                {/* Blocked / Active */}
                <td className="px-4 sm:px-6 py-4">
                    <StatusBadge status={user?.is_verified == 'success' ? user?.is_blocked ? "blocked" : "active" : "N/A"} />
                </td>

                {/* Join Date */}
                <td className="hidden sm:table-cell px-4 sm:px-6 py-4">
                    <div className="text-sm text-slate-400">
                        {user?.updated_at ? new Date(user?.created_at)?.toLocaleDateString("en-GB") : "N/A"}
                    </div>
                </td>

                {/* Actions */}
                <td className="px-4 sm:px-6 py-4 text-right">
                    <div className="flex items-center justify-end">
                        <button
                            onClick={() => { handleUserData(user?.id, user?.is_blocked); setAlertModalOpen(true); }}
                            className="p-1.5 hover:bg-slate-700/50 rounded transition-colors"
                            title={!user.is_blocked ? "Block access" : "Restore access"} disabled={user?.is_verified != 'success'}>
                            {user?.is_verified == 'success' ? user?.is_blocked ? <ShieldCheck className="w-6 h-6 text-green-500 cursor-pointer" /> :
                                <ShieldX className="w-6 h-6 text-red-500 cursor-pointer" /> : <ShieldAlert className="w-6 h-6 text-slate-400 cursor-not-allowed" />}
                        </button>
                    </div>
                </td>
            </tr>

            {/* Expanded Section */}
            {isExpanded && (
                <UserRowExpand user={user} />
            )}
        </>
    );
};

export default UserRow;