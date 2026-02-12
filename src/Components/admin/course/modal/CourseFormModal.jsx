import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Tabs from "./tabs/Tabs";
import BasicTab from "./tabs/BasicTab";
import DetailsTab from "./tabs/DetailsTab";
import InstructorTab from "./tabs/InstructorTab";
import FeaturesTab from "./tabs/FeaturesTab";
import VideoTab from "./tabs/VideoTab";
import DocumentsTab from "./tabs/DocumentsTab";
import PricingTab from "./tabs/PricingTab";
import FooterActions from "./tabs/FooterActions";
import { X } from "lucide-react";

export default function CourseFormModal({ isOpen, onClose, onSave, course, iconOptions }) {

    const [activeTab, setActiveTab] = useState("basic");

    const { register, control, handleSubmit, watch, setError, clearErrors, setValue, reset, formState: { errors } } = useForm({
        defaultValues: course || {

            // Basic Tab
            course_name: "", description: "", fullDescription: "", skillLevel: "Beginner", language: "", status: "active", icon: "",

            // Instructor Tab
            instructor: "", instructorBio: "",

            // Features Tab
            features: [],

            // Video Tab
            video: { title: "", preview: "", thumbnail_url: "", isFree: false },

            // Documents Tab
            documents: [],

            // Pricing Tab
            pricing: "",
        },
        mode: "onSubmit",
        shouldUnregister: false,
    });

    const onError = (errors) => {
        if (errors?.course_name || errors?.description || errors?.skillLevel || errors?.language || errors?.status || errors?.icon || errors?.img_url) {
            setActiveTab("basic");
        } else if (errors?.fullDescription) {
            setActiveTab("details");
        } else if (errors?.instructor || errors?.instructorTitle) {
            setActiveTab("instructor");
        } else if ((Array.isArray(errors?.features) && errors.features.some(Boolean)) || errors?.features?.message) {
            setActiveTab("features");
        } else if (errors?.video?.title || errors?.video?.file || errors?.video?.thumbnail_url) {
            setActiveTab("video");
        } else if ((Array.isArray(errors?.documents) && errors.documents.some(Boolean)) || errors?.documents?.message) {
            setActiveTab("documents");
        } else if (errors?.pricing) {
            setActiveTab("pricing");
        }
    }

    const features = useFieldArray({
        control,
        name: "features",
    });

    const { fields: documentFields, append: appendDocument, remove: removeDocument } = useFieldArray({
        control,
        name: "documents",
    });

    useEffect(() => {
        if (!course) {
            reset({
                course_name: course?.course_name || "",
                description: course?.description || "",
                fullDescription: course?.full_description || "",
                skillLevel: course?.skill_level || "Beginner",
                language: course?.language || "",
                status: course?.status || "active",
                icon: course?.icon || "",
                img_url: course?.img_url || "",

                instructor: course?.instructor?.name || "",
                instructorBio: course?.instructor?.bio || "",

                features: course?.course_content?.[0]?.features || [],
                video: {
                    title: course?.course_content?.[0]?.video?.title || "",
                    preview: course?.course_content?.[0]?.video?.video_url || "",
                    thumbnail_url: course?.course_content?.[0]?.video?.thumbnail_url || "",
                    isFree: course?.course_content?.[0]?.video?.isFree || false,
                },

                documents: course?.course_content?.[0]?.documents || [],
                pricing: course?.pricing || "",
            });
            return;
        }

        reset({
            course_name: course?.course_name || "",
            description: course?.description || "",
            fullDescription: course?.full_description || "",
            skillLevel: course?.skill_level || "Beginner",
            language: course?.language || "",
            status: course?.status || "active",
            icon: course?.icon || "",
            img_url: course?.img_url || "",

            instructor: course?.instructor?.name || "",
            instructorBio: course?.instructor?.bio || "",

            features: course?.course_content?.[0]?.features || [],

            video: {
                title: course?.course_content?.[0]?.video?.title || "",
                preview: course?.course_content?.[0]?.video?.video_url || "",
                thumbnail_url: course?.course_content?.[0]?.video?.thumbnail_url || "",
                isFree: course?.course_content?.[0]?.video?.isFree || false,
            },

            documents: course?.course_content?.[0]?.documents || [],
            pricing: course?.pricing || "",
        });
    }, [course, reset]);

    const handleClose = () => {
        reset();
        setActiveTab('basic');
        onClose();
    };

    const onSubmit = (data) => {
        let hasError = false;

        const validFeatures = Array.isArray(data.features) && data.features.some(f => f?.trim());
        if (!validFeatures) {
            setError("features", { type: "manual", message: "At least one feature is required" });
            hasError = true;
        }

        const validDocuments = Array.isArray(data.documents) && data.documents.some(doc => doc?.file || doc?.file_url);
        if (!validDocuments) {
            setError("documents", { type: "manual", message: "At least one document is required" });
            hasError = true;
        }

        const hasVideo = Boolean(data?.video?.file || data?.video?.preview || data?.video?.video_url);
        if (!hasVideo) {
            setError("video.file", { type: "manual", message: "Course video is required" });
            hasError = true;
        }

        if (hasError) return;

        onSave(data, course?.id, course);
        reset();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="w-full max-w-6xl max-h-[90vh] bg-slate-800 rounded-xl border border-slate-700 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
                    <div>
                        <h2 className="text-xl font-bold text-white">
                            {course ? 'Edit Course' : 'Add New Course'}
                        </h2>
                        <p className="text-sm text-slate-400 mt-1">
                            {course ? 'Update course information' : 'Create a new immigration course'}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
                {/* Tabs */}
                <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit, onError)} className="flex-1 overflow-y-auto p-6">

                    <div className={activeTab === "basic" ? "block" : "hidden"}>
                        <BasicTab register={register} errors={errors} iconOptions={iconOptions} watch={watch} setValue={setValue} isEdit={!!course} />
                    </div>

                    <div className={activeTab === "details" ? "block" : "hidden"}>
                        <DetailsTab register={register} errors={errors} />
                    </div>

                    <div className={activeTab === "instructor" ? "block" : "hidden"}>
                        <InstructorTab register={register} errors={errors} />
                    </div>

                    <div className={activeTab === "features" ? "block" : "hidden"}>
                        <FeaturesTab featureFields={features.fields} appendFeature={features.append} removeFeature={features.remove} register={register}
                            errors={errors} clearErrors={clearErrors} />
                    </div>

                    <div className={activeTab === "video" ? "block" : "hidden"}>
                        <VideoTab register={register} watch={watch} setValue={setValue} errors={errors} control={control}
                            clearErrors={clearErrors} />
                    </div>

                    <div className={activeTab === "documents" ? "block" : "hidden"}>
                        <DocumentsTab documentFields={documentFields} appendDocument={appendDocument} removeDocument={removeDocument} control={control}
                            register={register} watch={watch} setValue={setValue} errors={errors} clearErrors={clearErrors} />
                    </div>

                    <div className={activeTab === "pricing" ? "block" : "hidden"}>
                        <PricingTab register={register} errors={errors} />
                    </div>

                    {/* Footer */}
                    <FooterActions onClose={handleClose} isEdit={Boolean(course)} />
                </form>
            </div>
        </div>
    );
}