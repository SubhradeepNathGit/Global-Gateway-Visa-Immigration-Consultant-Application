import React from 'react'
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { encodeBase64Url } from '../../../../util/encodeDecode/base64';
import StarRating from './StarRating';
import { formatDate } from '../../../../util/dateFormat/dateFormatConvertion';
import { Eye, Download, X, Award } from 'lucide-react';
import { handleDownloadCertificate } from '../../../../util/pdfUtils.jsx';
import { useUserCertificates } from '../../../../tanstack/query/getSpecificCertificateDetails.js';
import CourseModal from './modal/CourseModal.jsx';

const PurchaseCourseCard = ({ course, userAuthData }) => {
    const [showCertificateModal, setShowCertificateModal] = React.useState(false);
    const certificateRef = React.useRef(null);

    const { isLoading: isCertificateLoading, data: certificate, error } = useUserCertificates({ userId:userAuthData?.id, courseId: course?.id });
    const isCompleted = certificate?.certificate_available || certificate?.progress === '100';
    const progress = parseInt(certificate?.progress || '0');

    return (
        <div className="bg-white rounded-xl border border-slate-200 hover:border-red-300 hover:shadow-lg transition-all overflow-hidden group relative">
            <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <div className="relative sm:w-72 h-48 sm:h-auto overflow-hidden flex-shrink-0">
                    <img
                        src={course?.img_url}
                        alt={course?.course_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors">
                            {course?.course_name ?? 'N/A'}
                        </h3>
                        {isCompleted && (
                            <div className="absolute top-6 right-6 flex items-center gap-2">
                                <button
                                    onClick={() => setShowCertificateModal(true)}
                                    className="p-1.5 rounded-full text-blue-600 hover:bg-blue-50 border border-blue-200 transition-colors flex-shrink-0 cursor-pointer"
                                    title="View Certificate"
                                    type="button"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDownloadCertificate(userAuthData, course, certificate)}
                                    className="p-1.5 rounded-full text-purple-600 hover:bg-purple-50 border border-purple-200 transition-colors flex-shrink-0 cursor-pointer"
                                    title="Download Certificate"
                                    type="button"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                            {course?.description ?? 'N/A'}
                        </p>

                        {!isCompleted && progress > 0 && (
                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-semibold text-slate-500">Learning Progress</span>
                                    <span className="text-xs font-bold text-red-600">{progress}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className="bg-red-600 h-full transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {isCompleted && (
                            <div className="mb-4 flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg w-fit">
                                <Award className="w-4 h-4 text-emerald-600" />
                                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Course Completed</span>
                            </div>
                        )}

                        {/* Meta */}
                        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 pb-4 border-b border-slate-100">
                            <span>
                                Purchased:{' '}
                                {formatDate(course?.purchase_date) ?? 'N/A'}
                            </span>
                            <span>•</span>
                            <span>Skill Level: {course?.skill_level ?? 'N/A'}</span>
                        </div>

                        {/* Star Rating */}
                        <div className="mb-4">
                            <StarRating courseId={course?.id} userId={userAuthData?.id} />
                        </div>
                    </div>

                    {/* Action */}
                    <div className="flex flex-wrap items-center gap-3 mt-auto">
                        <Link to={`/course/${encodeBase64Url(String(course?.id))}`}
                            className="flex-1 sm:flex-none bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                            <BookOpen className="w-4 h-4" />
                            {progress > 0 ? 'Continue Learning' : 'Start Learning'}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Certificate Modal */}
            {showCertificateModal && (
                <CourseModal course={course} certificateRef={certificateRef} certificate={certificate} userAuthData={userAuthData} setShowCertificateModal={setShowCertificateModal} />
            )}
        </div>
    )
}

export default PurchaseCourseCard