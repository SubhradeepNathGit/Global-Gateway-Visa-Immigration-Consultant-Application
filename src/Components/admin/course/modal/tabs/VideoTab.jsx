import { Video, RotateCcw, Trash2, Upload } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import FormInput from "./FormInput"; // adjust path if needed
import { Controller } from "react-hook-form";

export default function VideoTab({ control, register, watch, setValue, clearErrors, errors = {} }) {
    const [isUploadingVideo, setIsUploadingVideo] = useState(false);
    const [videoUploadProgress, setVideoUploadProgress] = useState(0);
    const videoFileInputRef = useRef(null);
    const thumbnailFileInputRef = useRef(null);

    const handleRemoveVideo = () => {
        setValue("video.file", null, { shouldValidate: true });
        setValue("video.preview", "", { shouldValidate: true });
        setVideoUploadProgress(0);
        setIsUploadingVideo(false);
        if (videoFileInputRef.current) videoFileInputRef.current.value = "";
    };

    useEffect(() => {
        if (watch("video.preview") || watch("video.file")) {
            clearErrors("video.file");
        }
    }, [watch("video.preview"), watch("video.file")]);

    const handleReloadVideo = () => {
        if (videoFileInputRef.current) videoFileInputRef.current.click();
    };

    const handleRemoveVideoThumbnail = () => {
        setValue("video.thumbnailFile", null, { shouldValidate: true });
        setValue("video.thumbnail_url", "", { shouldValidate: true });

        if (thumbnailFileInputRef.current) {
            thumbnailFileInputRef.current.value = "";
        }
    };

    const handleReloadVideoThumbnail = () => {
        if (thumbnailFileInputRef.current) thumbnailFileInputRef.current.click();
    };

    return (
        <div className="space-y-6">

            <FormInput label="Video Title" name="video.title" register={register} errors={errors}
                rules={{ required: "Video title is required" }}
                placeholder="Complete Study Visa Application Guide" required />

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Course Video <span className="text-red-400">*</span>
                </label>

                <Controller
                    name="video.file"
                    control={control}
                    // rules={{ required: "Course video is required" }}
                    render={({ field }) => (

                        <input type="file" accept="video/*" className="hidden" id="videoUpload"
                            ref={videoFileInputRef} onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                field.onChange(file);

                                setIsUploadingVideo(true);
                                setVideoUploadProgress(0);

                                let progress = 0;
                                const interval = setInterval(() => {
                                    progress += Math.random() * 12;
                                    if (progress >= 100) {
                                        progress = 100;
                                        clearInterval(interval);

                                        setValue("video.preview", URL.createObjectURL(file), {
                                            shouldValidate: true,
                                        });

                                        setIsUploadingVideo(false);
                                    }
                                    setVideoUploadProgress(Math.floor(progress));
                                }, 200);
                            }}
                        />
                    )}
                />

                <div className="relative w-full h-56 rounded-xl border border-dashed border-slate-600 bg-slate-800/40 overflow-hidden">

                    {isUploadingVideo && (
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-white/10 backdrop-blur-sm">
                            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 transition-all duration-300"
                                    style={{ width: `${videoUploadProgress}%` }}
                                />
                            </div>
                            <p className="text-xs text-slate-300 mt-1 text-right">
                                Uploading... {videoUploadProgress}%
                            </p>
                        </div>
                    )}

                    {watch("video.preview") ? (
                        <>
                            <video src={watch("video.preview")} controls className="w-full h-full object-cover" />

                            <div className="absolute top-3 right-3 flex gap-2">

                                <button
                                    type="button"
                                    onClick={handleReloadVideo}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${isUploadingVideo
                                        ? "bg-white/10 cursor-not-allowed text-slate-300"
                                        : "bg-white/10 text-white cursor-pointer hover:bg-blue-600"
                                        }`}
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>

                                {/* Delete */}
                                {!isUploadingVideo && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveVideo}
                                        className="px-3 mr-2 py-1.5 bg-red-500/80 hover:bg-red-600 text-white rounded-md text-xs font-medium transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <label
                            htmlFor="videoUpload"
                            className="flex flex-col items-center justify-center h-full cursor-pointer"
                        >
                            <Video className="w-6 h-6 text-slate-400 mb-2" />
                            <p className="text-sm text-slate-400">Upload course video</p>
                            <p className="text-xs text-slate-500 mt-1">MP4, WebM, MOV</p>
                        </label>
                    )}
                </div>
                {errors?.video?.file && (
                    <p className="mt-1 text-xs text-red-400">
                        {errors.video.file.message}
                    </p>
                )}
            </div>


            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Video Thumbnail <span className="text-red-400">*</span>
                </label>

                <input
                    type="file" accept="image/png,image/jpeg,image/webp" className="hidden"
                    id="videoThumbnail" ref={thumbnailFileInputRef} onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        setValue("video.thumbnailFile", file, { shouldValidate: true });
                        setValue(
                            "video.thumbnail_url", URL.createObjectURL(file), { shouldValidate: true }
                        );
                    }}
                />

                <div className="relative w-full h-40 rounded-xl border border-dashed border-slate-600 bg-slate-800/40 overflow-hidden">
                    {watch("video.thumbnail_url") ? (
                        <>
                            <img src={watch("video.thumbnail_url")} alt="Video Thumbnail" className="w-full h-full object-cover" />

                            <div className="absolute top-3 right-3 flex gap-2">
                                {/* Reload */}
                                <button type="button" onClick={handleReloadVideoThumbnail}
                                    className="px-3 py-1.5 bg-white/10 text-white rounded-md text-xs font-medium hover:bg-blue-600 transition">
                                    <RotateCcw className="w-4 h-4" />
                                </button>

                                {/* Delete */}
                                <button
                                    type="button" onClick={handleRemoveVideoThumbnail}
                                    className="px-3 py-1.5 bg-red-500/80 hover:bg-red-600 text-white rounded-md text-xs font-medium transition">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <label
                            htmlFor="videoThumbnail"
                            className="flex flex-col items-center justify-center h-full cursor-pointer"
                        >
                            <Upload className="w-5 h-5 text-slate-400 mb-2" />
                            <p className="text-sm text-slate-400">Upload video thumbnail</p>
                            <p className="text-xs text-slate-500">JPG, PNG, WebP</p>
                        </label>
                    )}
                </div>

                {/* SAME AS BASIC TAB */}
                <input
                    type="hidden"
                    {...register("video.thumbnail_url", {
                        required: "Video thumbnail is required",
                    })}
                />

                {errors?.video?.thumbnail_url && (
                    <p className="mt-1 text-xs text-red-400">
                        {errors.video.thumbnail_url.message}
                    </p>
                )}
            </div>


        </div>
    );
}
