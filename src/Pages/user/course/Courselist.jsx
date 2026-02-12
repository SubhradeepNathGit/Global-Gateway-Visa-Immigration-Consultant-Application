import React, { useEffect } from 'react';
import CourseBanner from '../../../Components/user/course/CourseBanner';
import CourseCard from '../../../Components/user/course/CourseCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCourses } from '../../../Redux/Slice/courseSlice';
import getSweetAlert from '../../../util/alert/sweetAlert';
import { Loader2 } from 'lucide-react';

const CourseList = () => {

  const dispatch = useDispatch();
  const { isCourseLoading, courseList, hasCourseError } = useSelector(state => state?.course);

  useEffect(() => {
    dispatch(fetchAllCourses())
      .then(res => {
        // console.log('Response for fetching all available course', res);
      })
      .catch(err => {
        console.log('Error occured', err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      })
  }, [dispatch]);

  // console.log('Available course', courseList);

  // Skeleton Loader
  const renderSkeletons = () =>
    Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 p-4">
        <div className="bg-white rounded-xl shadow-md h-[320px] animate-pulse">
          <div className="h-[180px] bg-gray-300 rounded-t-xl"></div>
          <div className="p-4 space-y-3">
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-4/5"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3 mt-3"></div>
          </div>
        </div>
      </div>
    ));

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      {/* Top Banner */}
      <CourseBanner />

      {/* Course Cards Section */}
      <div className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

          {isCourseLoading ? (
            <div className="flex flex-wrap justify-center -m-4 lg:mx-8 md:mx-2">
              {renderSkeletons()}
            </div>
          ) : courseList?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-slate-400 text-lg mb-2">No courses found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {courseList?.filter(course => course?.status == 'active')?.map((course, index) => (
                <CourseCard key={course.id} index={index} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes bounce-x {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(5px);
          }
        }
        .animate-bounce-x {
          animation: bounce-x 1.5s infinite;
        }
        .line-clamp-3 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
        }
      `}</style>
    </div>
  );
};

export default CourseList;
