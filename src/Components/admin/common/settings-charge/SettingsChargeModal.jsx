import React from 'react'

const SettingsChargeModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
                {children}
            </div>
        </div>
    );
}

export default SettingsChargeModal