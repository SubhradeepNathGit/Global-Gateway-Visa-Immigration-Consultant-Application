import React, { useEffect, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";

const ImageUploadField = ({ label, id, helper, error, currentImageUrl, preview, onImageSelect, uploading }) => {
    const [previewUrl, setPreviewUrl] = useState(currentImageUrl);

    useEffect(() => {
        // Use preview if passed, otherwise fallback to currentImageUrl
        if (preview) {
            if (preview instanceof File) {
                setPreviewUrl(URL.createObjectURL(preview));
            } else if (typeof preview === "string") {
                setPreviewUrl(preview);
            } else if (typeof preview === "object") {
                setPreviewUrl(preview.url || preview.file?.url || null);
            } else {
                setPreviewUrl(null);
            }
        } else {
            setPreviewUrl(currentImageUrl || null);
        }
    }, [preview, currentImageUrl]);

    // console.log(helper, preview, previewUrl);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);

            // Pass file to parent
            onImageSelect(file);
        }
    };

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
            <div className="space-y-3">
                <div className="relative">
                    <input id={id} type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} className="hidden" />
                    <label
                        htmlFor={id}
                        className={`flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-slate-700/30 border ${error ? 'border-red-500/50' : 'border-slate-600/50'} rounded-lg text-white hover:bg-slate-700/50 transition-colors cursor-pointer text-sm ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Uploading...</span>
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4" />
                                <span>Choose Image</span>
                            </>
                        )}
                    </label>
                </div>
                {previewUrl && (
                    <div className="relative">
                        <img src={previewUrl} alt="Preview"
                            className="h-32 w-auto rounded-lg border border-slate-600/50"
                        />
                        {!uploading && (
                            <button type="button"
                                onClick={() => {
                                    setPreviewUrl(null);
                                    onImageSelect(null);
                                }}
                                className="absolute top-2 right-2 p-1 rounded-full bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}
            </div>
            {error && <p className="mt-1 text-xs text-red-400">{error.message}</p>}
            {helper && <p className="mt-1 text-xs text-slate-400">{helper}</p>}
        </div>
    );
};

export default ImageUploadField;