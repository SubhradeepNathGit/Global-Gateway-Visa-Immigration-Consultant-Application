import React from 'react'
import { useUserCertificates } from '../../../../../tanstack/query/getSpecificCertificateDetails';
import { formatDate } from '../../../../../util/dateFormat/dateFormatConvertion';
import { Loader2 } from 'lucide-react';

const CourseDetails = ({ course, user }) => {

    const { data: certificates = [], isLoading, error } = useUserCertificates({ userId: user?.id, courseId: course?.id, });

    return (
        <div className="text-xs p-2 rounded bg-slate-700/30">
            <div className="flex justify-between items-center mb-1">
                <span className="text-white font-medium">{(course?.course_name?.length > 60 ? course?.course_name + '...' : course?.course_name) ?? 'N/A'}</span>
                <span className="text-white"> ₹{course?.pricing?.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-slate-400">{formatDate(course?.order_created_at) ?? 'N/A'} • {(isLoading ? <Loader2 className="w-3 h-3 ml-2 text-white animate-spin inline" /> : certificates?.progress) ?? 0}% Complete</div>
        </div>
    )
}

export default CourseDetails