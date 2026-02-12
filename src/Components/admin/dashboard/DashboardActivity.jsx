"use client";

import React, { useEffect } from "react";
import { Clock, XCircle, Eye, Info, BadgeAlert } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLatestActivities } from "../../../Redux/Slice/activitySlice";
import getSweetAlert from "../../../util/alert/sweetAlert";

const getIconByStatus = (iconValue) => {
    const status = iconValue?.toLowerCase() || "pending";

    switch (status) {
        case "pending":
            return <Info className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />;

        case "processing":
            return <Clock className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0 animate-spin" />;

        case "failed":
            return <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />;

        case "review":
            return <Eye className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />;

        default:
            return <BadgeAlert className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />;
    }
}

const DashboardActivity = () => {
    const { activities, isActivityLoading, activityErrorMessage } = useSelector(state => state.activity);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchLatestActivities()).unwrap()
            .then(res => {
                // console.log('Response for fetching activity', res);
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            })
    }, [dispatch]);

    if (isActivityLoading) return <div className="p-4 text-slate-300">Loading activities...</div>;
    if (activityErrorMessage) return <div className="p-4 text-red-500">Failed to load activities.</div>;

    return (
        <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="text-sm sm:text-base font-medium text-slate-300 mb-3 sm:mb-4">
                Recent Activity
            </div>
            {activities?.length === 0 ? (
                <div className="text-slate-400 text-sm">No activities found.</div>
            ) : (
                <ul className="glass-scrollbar text-xs sm:text-sm space-y-2 sm:space-y-3 text-slate-200 max-h-50 overflow-y-auto">
                    {activities.map(activity => (
                        <li key={activity?.id} className="flex items-start gap-2 pb-2 border-b border-slate-700/50">
                            {getIconByStatus(activity?.icon)}
                            <span>{activity?.title} — ID: #{activity?.id?.slice(0, 8)}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DashboardActivity;
