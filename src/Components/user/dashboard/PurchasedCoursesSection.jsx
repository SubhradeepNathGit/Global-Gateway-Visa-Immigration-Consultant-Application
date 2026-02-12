import React from 'react';
import { ArrowRight } from 'lucide-react';
import PurchaseCourseCard from './course/PurchaseCourseCard';
import NoAvailableCourse from './course/NoAvailableCourse';

const PurchasedCoursesSection = ({ purchasedCourses = [], onNavigate, userAuthData }) => {

  const handleBrowseCourses = () => {
    if (onNavigate) {
      onNavigate('/course');
    }
  };

  if (purchasedCourses?.length === 0) {
    return (
      <NoAvailableCourse handleBrowseCourses={handleBrowseCourses} />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">My Courses</h2>
          <p className="text-slate-600 mt-1">
            Access your free lectures and course materials
          </p>
        </div>
        <button
          onClick={handleBrowseCourses}
          className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center gap-2 transition-colors cursor-pointer"
        >
          Browse More Courses
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Course Cards */}
      <div className="grid gap-6">

        {purchasedCourses?.map(course => (
          <PurchaseCourseCard key={course.id} course={course} userAuthData={userAuthData} />
        ))}
      </div>
    </div>
  );
};

export default PurchasedCoursesSection;