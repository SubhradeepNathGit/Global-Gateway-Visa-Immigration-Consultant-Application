// import { Edit2, Save, X } from 'lucide-react';
// import React from 'react'

// const ActionBtn = ({ isEditing, setIsEditing, setEditedData, handleCancel, handleSave, profileData }) => {

//     const handleEdit = () => {
//         setIsEditing(true);
//         setEditedData({ ...profileData });
//     };

//     return (
//         <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
//             {!isEditing ? (
//                 <button
//                     onClick={handleEdit}
//                     className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 backdrop-blur-xl border border-blue-400/30
//         text-blue-300 hover:bg-white/30 hover:text-white transition-all duration-300 ease-out active:scale-95 font-medium">
//                     <Edit2 size={18} />

//                 </button>
//             ) : (
//                 <div className="flex items-center gap-3">
//                     {/* Cancel */}
//                     <button
//                         onClick={handleCancel}
//                         className=" flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 backdrop-blur-xl border border-white/30
//                   text-white hover:bg-white/30 hover:text-white transition-all duration-300 ease-out active:scale-95">
//                         <X size={18} />

//                     </button>

//                     {/* Save */}
//                     <button
//                         onClick={handleSave}
//                         className=" flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white-500/20 backdrop-blur-lg border border-emerald-400/30
//           text-white hover:bg-white-500/30 hover:text-green-500
//           transition-all duration-300 ease-out active:scale-95 font-medium">
//                         <Save size={18} />
//                         <span className="hidden sm:inline">Save Changes</span>
//                     </button>
//                 </div>
//             )}
//         </div>
//     )
// }

// export default ActionBtn





import React from "react";
import { Edit2, Save, X } from "lucide-react";

const ActionBtn = ({ isEditing, setIsEditing, handleCancel }) => {
    return (
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
            {!isEditing ? (
                <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 backdrop-blur-xl border border-blue-400/30
          text-blue-300 hover:bg-white/30 hover:text-white transition-all duration-300 ease-out active:scale-95 font-medium"
                >
                    <Edit2 size={18} />
                </button>
            ) : (
                <div className="flex items-center gap-3">
                    {/* Cancel */}
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 backdrop-blur-xl border border-white/30
            text-white hover:bg-white/30 transition-all duration-300 ease-out active:scale-95"
                    >
                        <X size={18} />
                    </button>

                    {/* Save → SUBMITS FORM */}
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white-500/20 backdrop-blur-lg border border-emerald-400/30
            text-white hover:bg-white-500/30 hover:text-green-500 transition-all duration-300 ease-out active:scale-95 font-medium"
                    >
                        <Save size={18} />
                        <span className="hidden sm:inline">Save Changes</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ActionBtn;