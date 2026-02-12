import React from 'react'
import { BookOpen, DollarSign, Clock, Users, FileText, Star, X, Award } from 'lucide-react';

const CourseDetailsModal = ({ isOpen, onClose, course, iconOptions }) => {
  if (!isOpen || !course) return null;

  const IconComponent = iconOptions?.find(i => i?.value === course?.icon)?.Icon || BookOpen;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-5xl max-h-[90vh] bg-slate-800 border border-slate-700/50 rounded-xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <IconComponent className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{course?.course_name}</h2>
              <p className="text-sm text-slate-400 mt-1">{course?.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Course Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-xs text-slate-400">Price</span>
              </div>
              <p className="text-lg font-bold text-white">₹{parseInt(course?.pricing)?.toLocaleString('en-IN')}</p>
            </div>

            {/* <div className="p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-slate-400">Duration</span>
              </div>
              <p className="text-lg font-bold text-white">{course.duration}</p>
            </div> */}

            <div className="p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-slate-400">Buyer</span>
              </div>
              <p className="text-lg font-bold text-white">{course?.userCount?.length ?? 0}</p>
            </div>

            <div className="p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-slate-400">Rating</span>
              </div>
              <p className="text-lg font-bold text-white">{course?.avgRating ?? 0}/5 ({course?.ratingCount ?? 0} review{Number(course?.ratingCount) > 1 ? 's' : ''})</p>
            </div>
          </div>

          {/* Full Description */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">About This Course</h3>
            <p className="text-slate-300 leading-relaxed">{course?.full_description ?? 'N/A'}</p>
          </div>

          {/* Course Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Skill Level</h4>
              <p className="text-white">{course?.skill_level ?? 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Language</h4>
              <p className="text-white">{course?.language ?? 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Lectures</h4>
              <p className="text-white">{(course?.course_content?.[0]?.documents?.length + 1) ?? 0} lectures</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2">Status</h4>
              <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${course?.status === 'active'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                }`}>
                {course?.status === 'active' ? 'Active' : 'Draft'}
              </span>
            </div>
          </div>

          {/* Instructor */}
          <div className="p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Instructor</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                <Award className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-semibold">{course?.instructor?.name ?? 'N/A'}</p>
                <p className="text-sm text-slate-400">{course?.instructor?.bio ?? 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Features */}
          {course?.course_content?.features && course?.course_content?.features?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">What You'll Learn</h3>
              <div className="grid gap-2">
                {course?.course_content?.features?.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2 text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Details */}
          {course?.pricing && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Pricing Details</h3>
              <div className="p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Base Price :</span>
                    <span className="font-medium">₹{parseFloat(course?.pricing || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>

                  {course?.allCharges && course?.allCharges?.course?.length > 0 && (
                    <>
                      <div className="border-t border-slate-600/50 my-2"></div>
                      {course?.allCharges?.course?.map((charge, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-slate-300">
                            <span>{charge?.charge_type ?? 'N/A'} ({charge?.percentage ?? 'N/A'}%) :</span>
                            <span className="font-medium">₹{Math?.round(course?.pricing * (Number.parseInt(charge?.percentage)) / 100).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  <div className="border-t border-slate-600/50 my-2"></div>

                  <div className="flex justify-between text-white text-base font-bold">
                    <span>Total Price :</span>
                    <span className="text-green-400">₹{parseInt(course?.total).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Documents */}
          {course?.course_content?.[0]?.documents && course?.course_content?.[0]?.documents?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Course Documents</h3>
              <div className="space-y-2">
                {course?.course_content?.[0]?.documents?.map((doc, index) => (
                  <div key={index} className="p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-white font-medium">{doc?.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-400">{doc?.type}</span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-400">{doc?.size}</span>
                          {/* <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-400">{doc.pages} pages</span> */}
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${doc?.isFree ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {doc?.isFree ? 'Free' : 'Paid'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseDetailsModal