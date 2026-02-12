import React from 'react'
import { useTotalExpense } from '../../../../../tanstack/query/getTotalExpenseOfSpecificUser';
import { Loader2 } from 'lucide-react';
import { useUserTotalExpense } from '../../../../../tanstack/query/getTotalExpenseForCourseSpecificUser';

const AdditionalInfo = ({ user }) => {
    const { data: totalExpenseForVisa, isLoading: isVisaExpenseLoading, isError, error: hasVisaExpenseError } = useTotalExpense(user?.id);
    const { data: totalExpenseForCourse, isLoading: isCourseExpenseLoading, error: hasCourseExpenseError } = useUserTotalExpense({ userId: user?.id });

    const totalExpense = Number(totalExpenseForVisa) + Number(totalExpenseForCourse);

    const formatDate = (dateString) => {
        if (!dateString) return "";

        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = String(date.getFullYear()).slice(2);
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
                <div className="text-slate-400 mb-1">Last Login</div>
                <div className="text-white">{user?.last_sign_in_at ? formatDate(user?.last_sign_in_at) : 'N/A'}</div>
            </div>
            <div>
                <div className="text-slate-400 mb-1">Total Spent</div>
                <div className="text-white">₹{(isVisaExpenseLoading || isCourseExpenseLoading) ? <Loader2 className="w-3 h-3 ml-2 text-white animate-spin inline" /> : totalExpense?.toLocaleString('en-IN')}</div>
            </div>
            <div>
                <div className="text-slate-400 mb-1">Auth Provider</div>
                <div className="text-white">{user?.providers ? user?.providers : 'N/A'}</div>
            </div>
            <div>
                <div className="text-slate-400 mb-1">User ID</div>
                <div className="text-white font-mono text-xs">{user?.id}</div>
            </div>
        </div>
    )
}

export default AdditionalInfo