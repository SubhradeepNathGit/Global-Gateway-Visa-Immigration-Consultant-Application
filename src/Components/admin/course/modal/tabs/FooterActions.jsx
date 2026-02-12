import { Save } from "lucide-react";
import { useSelector } from "react-redux";

export default function FooterActions({ onClose, isEdit }) {

    const { isCourseLoading } = useSelector(state => state?.course);

    return (
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-700/50 mt-6">
            <button type="button" onClick={() => {
                if (isCourseLoading) return;
                onClose();
            }} className={`px-6 py-2.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-slate-300 rounded-lg text-sm font-medium transition-colors ${isCourseLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                Cancel
            </button>
            <button type="submit" className={`px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${isCourseLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                {isCourseLoading ? (<div className="w-4 h-4 border-1 border-white border-t-transparent rounded-full animate-spin mr-2" />) : <Save />} {isEdit ? "Update Course" : "Create Course"}
            </button>
        </div>
    );
}
