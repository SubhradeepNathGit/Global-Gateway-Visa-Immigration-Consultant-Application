import React from 'react'
import { FileText, Lock, Download, FileIcon, Info } from 'lucide-react';
import hotToast from '../../../../../util/alert/hot-toast';
import { useDispatch } from 'react-redux';
import { handleCertificateProgress } from '../../../../../Redux/Slice/certificateSlice';
import { addNotification } from '../../../../../Redux/Slice/notificationSlice';

const DocumentSection = ({ isPurchased, course, certificates, userAuthData }) => {
    const dispatch = useDispatch();

    const user_notification_obj = {
        application_id: null,
        title: `Congratulations! Your certificate for completing the ${course?.course_name} course has been issued.`,
        receiver_type: 'user',
        user_id: userAuthData?.id,
        receiver_country_id: null,
        mark_read: false
    }

    const handleDocumentDownload = async (doc) => {
        if (!doc?.isFree && !isPurchased) {
            hotToast('Please purchase the course to download this document', "info", <Info className='text-orange-600' />);
            return;
        }

        if (!doc?.file_url) {
            hotToast('Document URL not found!', "error");
            return;
        }

        // Update certificate progress before opening the doc
        const totalDocs = course?.course_content?.[0]?.documents?.length || 0;
        await dispatch(handleCertificateProgress(userAuthData?.id, course.id, doc.name, totalDocs))
            .then(res => {
                // console.log('Response in documentation', res)

                if (res?.progress == 100 && res?.certificateAvailable) {

                    dispatch(addNotification(user_notification_obj))
                        .then(res => {
                            // console.log('Response after adding notification', res);
                        })
                        .catch(err => {
                            console.log('Error occured', err);
                            getSweetAlert('Oops...', 'Server unreachable.', 'error');
                        })
                }

                // Open document
                window.open(doc.file_url, '_blank', 'noopener,noreferrer');

            })
            .catch(err => {
                console.log('Error for generating certificates', err);
                getSweetAlert('Oops...', 'Server unreachable', 'error');
            })
    };

    return (
        <div>
            <h3 className="text-lg font-bold text-[#2C3E50] mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-[#FF5252]" />
                Course Documents
            </h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#FF5252 #f1f1f1' }}>
                {course?.course_content?.[0]?.documents?.map((doc, idx) => (
                    <div
                        key={idx}
                        className="border border-gray-200 rounded-lg p-4 hover:border-[#FF5252] transition-all bg-white hover:shadow-md"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${doc?.isFree || isPurchased
                                    ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                    <FileIcon className={`w-6 h-6 ${doc?.isFree || isPurchased
                                        ? 'text-blue-600' : 'text-gray-400'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold text-gray-900 text-sm truncate">{doc?.name?.length > 40 ? doc?.name?.slice(0, 40) + '...' : doc?.name}</h4>
                                        {doc?.isFree && (
                                            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold uppercase flex-shrink-0">
                                                Free
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-600">
                                        <span className="font-medium">{doc?.type ?? 'N/A'}</span>
                                        <span>•</span>
                                        <span>{doc?.size ?? 'N/A'}</span>
                                        {/* <span>•</span>
                                        <span>{doc.pages} pages</span> */}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDocumentDownload(doc)}
                                disabled={!doc.isFree && !isPurchased}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all flex-shrink-0 cursor-pointer ${doc.isFree || isPurchased
                                    ? 'bg-[#FF5252] hover:bg-[#E63946] text-white shadow-md hover:shadow-lg transform hover:scale-105'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {doc?.isFree || isPurchased ? (
                                    <>
                                        <Download className="w-4 h-4" />
                                        <span>Download</span>
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-4 h-4" />
                                        <span>Locked</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DocumentSection