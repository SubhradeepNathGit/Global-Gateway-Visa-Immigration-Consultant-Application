import React, { useEffect, useState } from 'react';
import { BookOpen, Plus, Search, FileText, Globe, School, Scale, Hand, Loader2 } from 'lucide-react';
import CourseCard from '../../Components/admin/course/CourseCard';
import CourseFormModal from '../../Components/admin/course/modal/CourseFormModal';
import CourseStats from '../../Components/admin/course/CourseStats';
import CourseDetailsModal from '../../Components/admin/course/modal/CourseDetailsModal';
import { useDispatch, useSelector } from 'react-redux';
import getSweetAlert from "../../util/alert/sweetAlert";
import { addCourse, deleteCourse, fetchAllCourses, toggleBlockCourse, updateCourse } from '../../Redux/Slice/courseSlice';
import hotToast from '../../util/alert/hot-toast';
import { createPortal } from 'react-dom';
import ConfirmBlockUnblockAlert from '../../Components/admin/common/alerts/ConfirmBlockUnblockAlert';

// Icon mapping
const iconOptions = [
  { value: 'School', label: 'School', Icon: School },
  { value: 'Globe', label: 'Globe', Icon: Globe },
  { value: 'Balance', label: 'Balance', Icon: Scale },
  { value: 'FrontHand', label: 'Hand', Icon: Hand },
  { value: 'BookOpen', label: 'Book', Icon: BookOpen },
  { value: 'FileText', label: 'File', Icon: FileText }
];

// Header Component
function CoursesHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Manage Courses</h1>
        <p className="text-sm text-slate-400">Create and manage immigration courses</p>
      </div>
    </div>
  );
}

// Settings Section Component
function SettingsSection({ title, description, icon: Icon, children, className = "" }) {
  return (
    <div className={`flex flex-col p-5 sm:p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 ${className}`}>
      <div className="flex items-start gap-3 mb-4 sm:mb-5 flex-shrink-0">
        <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30 flex-shrink-0">
          <Icon className="w-5 h-5 text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-1">{title}</h3>
          {description && <p className="text-sm text-slate-400">{description}</p>}
        </div>
      </div>
      <div className="flex-1 flex flex-col min-h-0">
        {children}
      </div>
    </div>
  );
}

// Main Component
export default function CourseManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [viewCourse, setViewCourse] = useState(null);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [mode, setMode] = useState(null);

  const dispatch = useDispatch();
  const { isCourseLoading, courseList, hasCourseError } = useSelector(state => state?.course);

  const filteredCourses = courseList?.filter(course =>
    course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCourse = () => {
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleDeleteCourse = (course) => {
    setAlertModalOpen(true);
    setCurrentCourse(course);
    setMode('delete');
  };

  const handleActiveInactiveCourse = (course) => {
    setAlertModalOpen(true);
    setCurrentCourse(course);
    setMode(course?.status == 'active' ? 'Draft' : 'Active');
  };

  const handleViewCourse = ({ course, avgRating, ratingCount, userCount, allCharges, total }) => {
    setViewCourse({ ...course, avgRating, ratingCount, userCount, allCharges, total });
    setIsDetailsOpen(true);
  };

  const handleDeleteOrKeepCourse = () => {
    dispatch(deleteCourse(currentCourse?.id))
      .then(res => {

        if (res.meta.requestStatus === "fulfilled") {
          // console.log('Response deleting course', res);
          dispatch(fetchAllCourses())
          hotToast(`Course deleted successfully`, "success");
          setAlertModalOpen(false);
          setCurrentCourse(null);
          setMode();
        }
        else {
          getSweetAlert("Error", "Update failed", "error");
        }
      })
      .catch(err => {
        console.log('Error occured', err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error')
      })
  };

  const handleCourseMode = () => {
    dispatch(toggleBlockCourse({ courseId: currentCourse?.id, block: mode?.toLowerCase() }))
      .then(res => {
        // console.log('Response deleting course', res);
        if (res.meta.requestStatus === "fulfilled") {
          dispatch(fetchAllCourses());
          hotToast(`Course ${mode == 'Active' ? 'activated' : 'blocked'} successfully`, "success");
          setAlertModalOpen(false);
          setCurrentCourse(null);
          setMode();
        }
        else {
          getSweetAlert('Oops...', 'Something went wrong!', 'error');
        }
      })
      .catch(err => {
        console.log('Error occured', err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error')
      })
  };

  useEffect(() => {
    dispatch(fetchAllCourses())
      .then(res => {
        // console.log('Response for fetching all available course', res);
      })
      .catch(err => {
        console.log('Error occured', err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error')
      })
  }, [dispatch]);

  const handleSaveCourse = (data, courseId, oldCourse) => {

    const course = {
      course_name: data?.course_name,
      description: data?.description,
      full_description: data?.fullDescription,
      skill_level: data?.skillLevel,
      language: data?.language,
      status: data?.status,
      icon: data?.icon,
      instructor: {
        name: data?.instructor,
        bio: data?.instructorBio,
      },
      pricing: data?.pricing
    };

    const content = {
      features: data?.features || [],
      video: {
        title: data?.video?.title || "",
        isFree: data?.video?.isFree || false,
        video_url: "",
        thumbnail_url: "",
      },
      documents: (data.documents || []).map((doc) => ({
        name: doc?.name,
        type: String(doc?.name)?.split(".")[String(doc?.name)?.split(".")?.length - 1]?.toUpperCase(),
        isFree: doc?.isFree,
        size: doc?.size,
        file_url: "",
      })),
    };

    const files = {
      thumbnail: data?.thumbnailFile || null,
      video: data?.video?.file || null,
      videoThumbnail: data?.video?.thumbnailFile || null,
      documents: (data?.documents || [])?.map((doc) => ({
        file: doc?.file,
      })),
    };

    // console.log('Course data', course);
    // console.log('Content data', content);
    // console.log('Files data', files);

    dispatch(courseId ? updateCourse({ courseId, course, content, files, oldCourse }) : addCourse({ course, content, files }))
      .then(res => {
        // console.log('Response for adding course', res);

        if (res.meta.requestStatus === "fulfilled") {
          hotToast(`Course ${courseId ? 'updated' : 'added'} successfully`, "success");
          setIsModalOpen(false);
          setSelectedCourse(null);
          dispatch(fetchAllCourses());
        }
        else {
          getSweetAlert('Oops...', res?.payload, 'info');
        }
      })
      .catch(err => {
        console.log('Error occured', err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error')
      })
  };

  // console.log('Available course', courseList);

  return (
    <>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto">
          <CoursesHeader />

          {/* Search and Add */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search courses..."
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />

            </div>
            <button onClick={handleAddCourse}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer" >

              <Plus className="w-5 h-5" />
              Add New Course
            </button>
          </div>

          {/* Stats */}
          <CourseStats courses={courseList} />

          {/* Courses Grid */}
          <SettingsSection title="All Courses" description="Manage your immigration courses" icon={BookOpen} >

            {isCourseLoading && (
              <div className="text-center py-12">
                <Loader2 className="w-16 h-16 text-white animate-spin mx-auto text-center" />
                <p className="text-slate-400 text-lg">Loading...</p>
              </div>
            )}

            {!isCourseLoading && filteredCourses?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <BookOpen className="w-16 h-16 text-slate-600 mb-4" />
                <p className="text-slate-400 text-lg mb-2">No courses found</p>
                <p className="text-slate-500 text-sm">
                  {searchTerm ? 'Try a different search term' : 'Create your first course to get started'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCourses?.map(course => (
                  <CourseCard key={course.id} course={course} onEdit={handleEditCourse}
                    onDelete={handleDeleteCourse} onView={handleViewCourse} onShow={handleActiveInactiveCourse} />
                ))}
              </div>
            )}
          </SettingsSection>

          {/* Modals */}
          <CourseFormModal iconOptions={iconOptions}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedCourse(null);
            }}
            course={selectedCourse} onSave={handleSaveCourse} />

          <CourseDetailsModal iconOptions={iconOptions}
            isOpen={isDetailsOpen}
            onClose={() => {
              setIsDetailsOpen(false);
              setViewCourse(null);
            }}
            course={viewCourse}
          />
        </div>
      </div>

      {alertModalOpen && createPortal(
        <ConfirmBlockUnblockAlert
          open={alertModalOpen}
          onClose={() => setAlertModalOpen(false)}
          onConfirm={mode == 'delete' ? handleDeleteOrKeepCourse : handleCourseMode}
          buttonText={mode == 'delete' ? 'Delete' : mode}
          type={mode == 'delete' ? 'delete' : mode?.toLowerCase()}
          title={`${mode == 'delete' ? 'Delete' : mode} Course`}
          message={`Are you sure you want to ${mode == 'delete' ? 'Delete' : mode?.toLowerCase()} the course?`}
        />,
        document.body)}
    </>
  );
}