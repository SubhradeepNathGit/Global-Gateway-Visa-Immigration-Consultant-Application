import React, { useMemo, useState } from 'react'
import { Calendar, FileText, BookOpen, ChevronDown, ChevronUp, ShieldX, ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";
import StatusBadge from './userDetails/UserStatusBadge';
import ApplicationDetails from './userDetails/user-card/ApplicationDetails';
import CourseDetails from './userDetails/user-card/CourseDetails';
import { useApplicationsByUser } from '../../../tanstack/query/getApplicationsByUser';
import { useUserOrders } from '../../../tanstack/query/getUserPurchasedCourse';

const UserCard = ({ user, onBlock }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { data: application, isLoading: isApplicationLoading, isError: isApplicationError, error } = useApplicationsByUser(user?.id);
    const { data: allOrders, isLoading: isCourseLoading, isError: isCourseError, error: hasCourseError } = useUserOrders({ userId: user?.id, status: 'success' });

    const uniqueCourses = useMemo(() => {
        if (!Array.isArray(allOrders) || allOrders.length === 0) return [];

        return [
            ...new Map(
                allOrders.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .flatMap(order => {
                        if (!Array.isArray(order.order_items)) return [];

                        return order.order_items.filter(item => item?.course_id && item?.courses).map(item => [
                            item.course_id,
                            {
                                ...item.courses,
                                order_created_at: order.created_at,
                                purchase_date: order.purchase_date,
                            },
                        ]);
                    })
            ).values(),
        ];
    }, [allOrders]);

    return (
        <div className="p-4 border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-400 font-semibold">
                            {user?.avatar_url ? (
                                <img src={user?.avatar_url} alt=""
                                    className='w-10 h-10 rounded-full border border-blue-500/30'
                                />) : (
                                <span className="text-blue-400 font-semibold text-sm">
                                    {user?.name?.split(' ')?.map(n => n[0])?.join('').toUpperCase()}
                                </span>
                            )}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white mb-1">{user?.name}</div>
                        <div className="text-xs text-slate-400 truncate">{user?.email}</div>
                        <div className="text-xs text-slate-400 mt-1">{user?.phone}</div>
                    </div>
                </div>
                <StatusBadge status={user?.is_verified} />
            </div>

            <div className="flex items-center gap-2 mb-3 text-xs text-slate-400">

                <span><StatusBadge status={user?.is_verified == 'success' ? user?.is_blocked ? "blocked" : "active" : "N/A"} /></span>
                <span className="mx-1">•</span>
                <Calendar className="w-3 h-3" />
                <span>{user?.updated_at ? new Date(user?.created_at)?.toLocaleDateString("en-GB") : ""}</span>
            </div>

            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 text-sm text-white transition-colors mb-3"
            >
                {isExpanded ? (
                    <>
                        <ChevronUp className="w-4 h-4" />
                        Hide Details
                    </>
                ) : (
                    <>
                        <ChevronDown className="w-4 h-4" />
                        Show Details
                    </>
                )}
            </button>

            {isExpanded && (
                <div className="space-y-3 mb-3">
                    {/* Visa Applications */}
                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 max-h-[250px] overflow-y-auto">
                        <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-blue-400" />
                            <h4 className="text-sm font-semibold text-white">Visa Applications</h4>
                        </div>
                        {isApplicationLoading ? (
                            <Loader2 className="w-6 h-6 ml-2 text-white animate-spin inline mx-auto" />
                        ) : application?.length > 0 ? (
                            <div className="space-y-2">
                                {application.map((visa, idx) => (
                                    <ApplicationDetails key={idx} visa={visa} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-xs text-slate-400 italic">No visa applications</div>
                        )}
                    </div>

                    {/* Course Purchases */}
                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 max-h-[250px] overflow-y-auto">
                        <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-4 h-4 text-green-400" />
                            <h4 className="text-sm font-semibold text-white">Course Purchases</h4>
                        </div>
                        {isCourseLoading ? (
                            <Loader2 className="w-6 h-6 ml-2 text-white animate-spin inline" />
                        ) : uniqueCourses?.length > 0 ? (
                            <div className="space-y-2">
                                {uniqueCourses?.map((course, idx) => (
                                    <CourseDetails key={idx} course={course} user={user} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-xs text-slate-400 italic">No course purchases</div>
                        )}
                    </div>
                </div>
            )}

            <div className="flex gap-2">
                <button
                    onClick={() => onBlock(user?.id, user?.is_blocked)} disabled={user?.is_verified != 'success'}
                    className="flex-1 py-2 px-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 text-white text-sm transition-colors flex items-center justify-center gap-2"
                >
                    {
                        user?.is_verified === "success" ? (
                            user?.is_blocked ? (
                                <div className="flex items-center gap-1 cursor-pointer text-green-500">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Unblock</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 cursor-pointer text-red-500">
                                    <ShieldX className="w-4 h-4" />
                                    <span>Block</span>
                                </div>
                            )
                        ) : (
                            <div className="flex items-center gap-1 text-slate-400 cursor-not-allowed">
                                <ShieldAlert className="w-4 h-4" />
                                <span>N/A</span>
                            </div>
                        )
                    }
                </button>
            </div>
        </div>
    );
}

export default UserCard