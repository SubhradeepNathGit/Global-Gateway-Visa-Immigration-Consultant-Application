import React, { useState } from "react";
import { Upload, File, X, CheckCircle, AlertCircle, Eye, FileText } from "lucide-react";

export default function FileInput({
  label,
  onFileChange,
  accept = "*",
  previewUrl,
  file = null,
  error = null,
  noChange,
  description = null,
  maxSize = "400KB",
  required = false
}) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (selectedFile) => {
    if (selectedFile) {
      onFileChange(selectedFile);
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    onFileChange(null);
  };

  const isOld = file?.isOld;
  const actualFile = isOld ? null : file?.file;
  const preview = previewUrl;

  const isPDF = isOld
    ? previewUrl?.endsWith(".pdf")
    : actualFile?.type === "application/pdf";

  const isImage = isOld
    ? !previewUrl?.endsWith(".pdf")
    : actualFile?.type?.startsWith("image/");

  const hasFile = isOld ? true : !!actualFile;


  const getAcceptText = () => {
    if (accept === 'image/*') return `JPG, PNG or JPEG • Max ${maxSize}`;
    if (accept === 'application/pdf') return `PDF only • Max ${maxSize}`;
    if (accept === 'image/*,application/pdf') return `JPG, PNG, JPEG or PDF • Max ${maxSize}`;
    return `Supported formats • Max ${maxSize}`;
  };

  // console.log('file details', file);

  return (
    <div className="w-full">
      {/* Label */}
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Description */}
      {description && (
        <p className="text-xs text-gray-600 mb-3">{description}</p>
      )}

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl transition-all duration-300 ${dragActive
          ? 'border-red-500 bg-red-50/50 shadow-lg shadow-red-100'
          : error
            ? 'border-red-300 bg-red-50/30'
            : hasFile
              ? 'border-green-400 bg-green-50/30'
              : 'border-gray-300 bg-gray-50/50 hover:border-red-400 hover:bg-red-50/30 hover:shadow-md'
          }`}
      >
        {hasFile ? (
          // File Preview
          <div className="p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              {/* Preview Thumbnail */}
              <div className="flex-shrink-0">
                {previewUrl && isImage ? (
                  <div className="relative group">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border-2 border-white shadow-md"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-lg transition-all duration-200 flex items-center justify-center">
                      <Eye size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ) : isPDF ? (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-100 to-red-50 rounded-lg flex items-center justify-center shadow-sm">
                    <FileText className="text-red-600" size={28} />
                  </div>
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg flex items-center justify-center shadow-sm">
                    <File className="text-gray-600" size={28} />
                  </div>
                )}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {/* {noChange ? "" : file.name} */}
                      {isOld ? file?.docName?.split("_").slice(1).join("_") ||"Existing Document" : actualFile?.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {/* {`${noChange ? "" : (file.size / 1024).toFixed(1) + " KB"}`} */}
                      {isOld ? "" : actualFile ? (actualFile.size / 1024).toFixed(1) + " KB" : ""}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                      <span className="text-xs text-green-700 font-medium">
                        Ready to upload
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                    {previewUrl && (
                      <a
                        href={previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-lg hover:bg-blue-100 transition-colors group"
                        title="Preview file"
                      >
                        <Eye size={16} className="text-gray-500 group-hover:text-blue-600" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-2 rounded-lg hover:bg-red-100 transition-colors group"
                      title="Remove file"
                    >
                      <X size={16} className="text-gray-500 group-hover:text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Upload Prompt
          <label className="flex flex-col items-center justify-center p-6 sm:p-8 cursor-pointer group">
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 sm:mb-4 transition-all duration-300 ${dragActive
              ? 'bg-gradient-to-br from-red-600 to-red-700 shadow-lg shadow-red-200 scale-110'
              : 'bg-white shadow-md group-hover:shadow-xl group-hover:scale-105'
              }`}>
              <Upload
                className={`transition-all duration-300 ${dragActive ? 'text-white animate-bounce' : 'text-gray-400 group-hover:text-red-600'
                  }`}
                size={24}
              />
            </div>

            <p className={`text-sm font-semibold mb-1 text-center transition-colors ${dragActive ? 'text-red-700' : 'text-gray-700'
              }`}>
              {dragActive ? (
                "Drop your file here"
              ) : (
                <>
                  <span className="hidden sm:inline">Drop your file here or </span>
                  <span className="text-red-600 group-hover:underline">
                    <span className="sm:hidden">Tap to </span>browse
                  </span>
                </>
              )}
            </p>

            <p className="text-xs text-gray-500 text-center px-2">
              {getAcceptText()}
            </p>

            <input
              type="file"
              accept={accept}
              onChange={(e) => handleFileSelection(e.target.files?.[0])}
              className="hidden"
              aria-label={label}
            />
          </label>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-1.5 mt-2 text-sm text-red-600 animate-slideDown">
          <AlertCircle size={14} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Global Styles */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-bounce {
          animation: bounce 0.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}