import React, { useMemo } from 'react'
import { FileText, BookOpen, Loader2 } from "lucide-react";
import ApplicationDetails from './userDetails/user-row/ApplicationDetails';
import CourseDetails from './userDetails/user-row/CourseDetails';
import AdditionalInfo from './userDetails/user-row/AdditionalInfo';
import { useApplicationsByUser } from '../../../tanstack/query/getApplicationsByUser';
import { useUserOrders } from '../../../tanstack/query/getUserPurchasedCourse';

const UserRowExpand = ({ user }) => {

    const { data: application, isLoading: isApplicationLoading, isError: isApplicationError, error: hasApplicationError } = useApplicationsByUser(user?.id);
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
        <tr className="bg-slate-700/10 border-b border-slate-700/50">
            <td colSpan="7" className="px-4 sm:px-6 py-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Visa Applications */}
                    <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 max-h-[270px] overflow-y-auto">
                        <div className="flex items-center gap-2 mb-3">
                            <FileText className="w-4 h-4 text-blue-400" />
                            <h4 className="text-sm font-semibold text-white">Visa Applications</h4>
                        </div>
                        {isApplicationLoading ? (
                            <Loader2 className="w-10 h-10 ml-2 text-white animate-spin inline mx-auto" />
                        ) : application?.length > 0 ? (
                            <div className="space-y-2">
                                {application?.map((visa, idx) => (
                                    <ApplicationDetails key={idx} visa={visa} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-slate-400 italic">No visa applications</div>
                        )}
                    </div>

                    {/* Course Purchases */}
                    <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 max-h-[270px] overflow-y-auto text-center ">
                        <div className="flex items-center gap-2 mb-3">
                            <BookOpen className="w-4 h-4 text-green-400" />
                            <h4 className="text-sm font-semibold text-white">Course Purchases</h4>
                        </div>

                        {isCourseLoading ? (
                            <Loader2 className="w-10 h-10 ml-2 text-white animate-spin inline" />
                        ) : uniqueCourses?.length > 0 ? (
                            <CourseDetails purchaseCourse={uniqueCourses} user={user} />
                        ) : (
                            <div className="text-sm text-slate-400 italic">No course purchases</div>
                        )}
                    </div>

                    {/* Additional Info */}
                    <div className="md:col-span-2 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                        <h4 className="text-sm font-semibold text-white mb-3">Account Information</h4>
                        <AdditionalInfo user={user} />
                    </div>

                </div>
            </td>
        </tr>
    )
}

export default UserRowExpand