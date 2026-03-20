import React from 'react'
import { Globe } from "lucide-react";

const BasicFormSection = ({ SettingsSection, FormField, register, errors, country, handleAutoFetch, isDetecting }) => {

    return (
        <SettingsSection title="Basic Information" description="Essential country details" icon={Globe}>

            <div className="flex gap-2 items-start">
                <div className="flex-1">
                    <FormField label="Country Name *" id="name" placeholder="e.g., India" register={
                        register("name",
                            { required: "Country name is required" }
                        )} error={errors.name} readOnly={Boolean(country)} />
                </div>
                {!country && (
                    <button
                        type="button"
                        onClick={handleAutoFetch}
                        disabled={isDetecting}
                        className="mt-8 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-50 whitespace-nowrap"
                    >
                        {isDetecting ? "Detecting..." : "Detect Details"}
                    </button>
                )}
            </div>

            <FormField label="Country Code" id="code" placeholder="e.g., AE" register={
                register("code", {
                    pattern: { value: /^[A-Za-z]+$/, message: "Country Code is not valid" },
                    minLength: { value: 2, message: "Code must be 2 characters" },
                    maxLength: { value: 3, message: "Code must be 3 characters" }
                }
                )} error={errors.code} maxLength={3} helper="ISO country code" />

            <FormField label="Official Name" id="officialName" placeholder="e.g., United Arab Emirates" register={
                register("officialName",
                    { pattern: { value: /^[A-Za-z \-']+$/, message: "Official Name is not valid" } }
                )} error={errors.officialName} />

            <FormField label="Population" id="population" placeholder="e.g., 11,294,243" register={
                register("population",
                    { pattern: { value: /^\d+(\.\d+)?$/, message: "Population is not valid" } }
                )} error={errors.population} helper="Current population" />

            <FormField label="Capital" id="capital" placeholder="e.g., Abu Dhabi" register={
                register("capital",
                    { pattern: { value: /^[A-Za-z -]+$/, message: "Capital is not valid" } }
                )} error={errors.capital} />

        </SettingsSection>
    )
}

export default BasicFormSection