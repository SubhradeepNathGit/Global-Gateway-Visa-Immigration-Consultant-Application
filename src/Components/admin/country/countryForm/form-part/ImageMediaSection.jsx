import React, { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import ImageUploadField from "../ImageUploadField";

const ImageMediaSection = ({ SettingsSection, setImageFile, uploading, register, watch, errors, setValue, country }) => {

    const [hasCountryImage, setHasCountryImage] = useState(!!country?.image_url);
    const flagFile = watch("flagImage");
    const countryFile = watch("countryImage");

    register("flagImage", {
        validate: (value) => {
            const file = value?.[0];
            if (file && file instanceof File) {
                if (!file.type.match(/image\/(png|jpeg|jpg)/)) return "Only PNG, JPG, JPEG allowed";
                if (file.size > 1 * 1024 * 1024) return "Max size 1 MB";
            }
            return true;
        }
    });

    register("countryImage", {
        validate: (value) => {
            const file = value?.[0];
            if (!file && !hasCountryImage) return "Country image is required";
            if (!file && !country?.image_url) return "Country image is required";
            if (file && file instanceof File) {
                if (!file.type.match(/image\/(png|jpeg|jpg)/)) return "Only PNG, JPG, JPEG allowed";
                if (file.size > 2 * 1024 * 1024) return "Max size 2 MB";
            }
            return true;
        }
    });

    const getPreviewUrl = (fileValue, fallback) => {

        // console.log(fileValue, fallback);

        // User selected a new file
        if (fileValue?.[0] instanceof File) {
            return URL.createObjectURL(fileValue[0]);
        }

        // fallback is already a URL string
        if (typeof fallback === "string") {
            return fallback;
        }

        // fallback is an object (your case)
        if (fallback && typeof fallback === "object") {
            return fallback.url || fallback.file?.url || null;
        }

        return null;
    };

    // console.log(getPreviewUrl('flag data',country?.country_details?.flag_url));


    return (
        <SettingsSection title="Images & Media" description="Upload images" icon={ImageIcon}>

            {/* FLAG IMAGE */}
            <ImageUploadField
                label="Flag Image"
                id="flagImage"
                helper="Upload an image (recommended: 320x240px)"
                onImageSelect={(file) => {
                    setValue("flagImage", file ? [file] : []);
                    setImageFile(file);
                }}
                preview={getPreviewUrl(flagFile, country?.country_details?.flag_url)}
                uploading={uploading}
                error={errors.flagImage?.message}
            />
            {errors.flagImage && <p className="mt-1 text-xs text-red-400">{errors.flagImage.message}</p>}

            {/* COUNTRY IMAGE */}
            <ImageUploadField
                label="Country Image"
                id="countryImage"
                helper="Upload an image (recommended: 800x600px)"
                onImageSelect={(file) => {
                    setValue("countryImage", file ? [file] : []);
                    setImageFile(file);
                    setHasCountryImage(!!file);
                }}
                preview={getPreviewUrl(countryFile, country?.image_url)}
                uploading={uploading}
                error={errors.countryImage?.message}
            />
            {errors.countryImage && <p className="mt-1 text-xs text-red-400">{errors.countryImage.message}</p>}

        </SettingsSection>
    );
};

export default ImageMediaSection;
