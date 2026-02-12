import React from 'react'
import { Download, X } from 'lucide-react'
import CourseCertificate from '../../letter/CourseCertificate'
import { handleDownloadCertificate } from '../../../../../util/pdfUtils'

const CourseModal = ({ course, certificateRef, certificate, userAuthData, setShowCertificateModal }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Course Certificate</h2>
                        <p className="text-sm text-slate-500 font-medium">{course?.course_name}</p>
                    </div>
                    <button
                        onClick={() => setShowCertificateModal(false)}
                        className="p-2 hover:bg-white hover:shadow-md rounded-xl transition-all group"
                        type="button"
                    >
                        <X className="w-6 h-6 text-slate-400 group-hover:text-red-500 transition-colors cursor-pointer" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto bg-slate-100/50 p-8 glass-scrollbar">
                    <div className="shadow-2xl">
                        <CourseCertificate
                            ref={certificateRef}
                            userAuthData={userAuthData}
                            course={course}
                            certificateData={certificate}
                        />
                    </div>
                </div>

                <div className="px-8 py-5 border-t border-slate-100 bg-white flex justify-end gap-4">
                    <button
                        onClick={() => setShowCertificateModal(false)}
                        className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => handleDownloadCertificate(userAuthData, course, certificate)}
                        className="px-8 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2 cursor-pointer"
                    >
                        <Download className="w-4 h-4" />
                        Download Certificate
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CourseModal