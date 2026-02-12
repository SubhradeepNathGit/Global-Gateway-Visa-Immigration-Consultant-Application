import React, { useEffect } from 'react'
import { Edit2, Trash2, Eye, CircleOff, CircleCheckBig, Users, Video, Star, Section } from 'lucide-react';
import { useCourseAvgRating } from '../../../tanstack/query/getCourseAvgRating';
import { useUsersByCourse } from '../../../tanstack/query/getUserByCourse';
import { useCourseWiseRatingCount } from '../../../tanstack/query/getCourseWiseRatingCount';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCharges } from '../../../Redux/Slice/chargesSlice';
import getSweetAlert from '../../../util/alert/sweetAlert';

const CourseCard = ({ course, onEdit, onDelete, onView, onShow }) => {

    const dispatch = useDispatch();

    const { loading: ratingAvgLoading, data: avgRating, error: hasRatingAvgError } = useCourseAvgRating(course?.id);
    const { loading: ratingCountLoading, data: ratingCount, error: hasRatingCountError } = useCourseWiseRatingCount(course?.id);
    const { loading: userCountLoading, data: userCount, error: hasuserCountError } = useUsersByCourse({ courseId: course?.id, status: 'success' });
    const { isChargesLoading, allCharges, hasChargesError } = useSelector(state => state?.charge);

    let tax = 0;
    allCharges?.course?.forEach(charge => {
        tax += Math?.round((Number(course?.pricing)) * (Number.parseInt(charge?.percentage)) / 100);
    })
    const total = Number(course?.pricing) + tax;

    useEffect(() => {
        dispatch(fetchCharges({ type: 'course', status: true }))
            .then(res => {
                // console.log('Response for fetching all charges for course', res);
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            })
    }, []);

    return (
        <div className="group relative bg-slate-800/30 border border-slate-700/50 rounded-lg overflow-hidden hover:border-blue-500/50 transition-all">
            <div className="aspect-video relative overflow-hidden">
                <img
                    src={course?.img_url}
                    alt={course?.course_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${course?.status === 'active'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                        }`}>
                        {course?.status === 'active' ? 'Active' : 'Draft'}
                    </span>
                </div>
                <div className="absolute bottom-2 left-2 bg-blue-500/90 text-white px-2 py-1 rounded text-xs font-bold">
                    ₹{parseInt(course?.pricing)?.toLocaleString('en-IN')}
                </div>

            </div>

            <div className="p-4">
                <h3 className="text-white font-semibold mb-2 line-clamp-1">{course?.course_name ?? 'N/A'}</h3>
                <p className="text-slate-400 text-sm mb-3 line-clamp-2">{course?.description ?? 'N/A'}</p>

                <div className="flex items-center gap-3 text-xs text-slate-400 mb-3 flex-wrap">
                    <span className="flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        {(course?.course_content?.[0]?.documents?.length + 1) ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {userCount?.length ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {avgRating ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                        <Section className="w-3 h-3" />
                        {course?.skill_level ?? 'N/A'}
                    </span>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => onShow(course)}
                        className={`px-3 py-2 ${course?.status === 'active' ? 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/30 text-amber-400' : 'bg-green-500/20 hover:bg-green-500/30 border-green-500/30 text-green-400'} border rounded-lg text-sm font-medium transition-colors cursor-pointer`}
                    >
                        {course?.status === 'active' ? <CircleOff className="w-4 h-4" /> : <CircleCheckBig className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={() => onEdit(course)}
                        className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                        <Edit2 className="w-4 h-4" />
                        Edit
                    </button>
                    <button
                        onClick={() => onView({ course, avgRating, ratingCount, userCount, allCharges, total })}
                        className="flex-1 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-slate-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                        <Eye className="w-4 h-4" />
                        View
                    </button>
                    <button
                        onClick={() => onDelete(course)}
                        className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div >
    );
}

export default CourseCard