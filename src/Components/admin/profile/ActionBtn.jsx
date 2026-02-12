import { Edit2, Save, X } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux';

const ActionBtn = ({ isEditing, setIsEditing, handleSave, handleCancel }) => {

    const { isAdminLoading } = useSelector(state => state.admin);

    return (
        <div className="flex -mt-16 gap-3">
            {!isEditing ? (
                <button
                    onClick={() => setIsEditing(true)}
                    className="bg-transparent  border border-gray-300 hover:bg-white/10 px-5 py-2.5 rounded-lg text-white flex items-center gap-2 transition-all"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
            ) : (
                <>
                    <button
                        onClick={handleSave}
                        className={`${isAdminLoading ? 'bg-green-800' : 'bg-green-700'} hover:bg-green-800 px-5 py-2.5 rounded-lg text-white flex items-center gap-2 transition-all`}
                    >
                        {isAdminLoading ? (
                            <div className="w-4 h-4 border-1 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        ) :
                            (<Save className="w-4 h-4" />)
                        }
                        {isAdminLoading ? 'Saving...' : 'Save'}
                    </button>

                    <button
                        onClick={handleCancel}
                        className="bg-slate-700 hover:bg-slate-600 px-5 py-2.5 rounded-lg text-white flex items-center gap-2 transition-all"
                    >
                        <X className="w-4 h-4" /> Cancel
                    </button>
                </>
            )}
        </div>
    )
}

export default ActionBtn