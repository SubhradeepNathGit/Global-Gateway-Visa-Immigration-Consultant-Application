import React from 'react'
import { FileText } from 'lucide-react'

const ContentSection = ({ SettingsSection, FormField, register, errors }) => {
    return (
        <SettingsSection title="Content" description="Descriptive text" icon={FileText}>

            <FormField label="Description *" id="description" type="textarea" rows={5} placeholder="Brief description..." register={register("description", {
                required: "Description is required",
                pattern: {
                    value: /^[A-Za-z0-9,.;\-()[\]{}'"\s]+$/,
                    message: "Only letters, numbers, spaces, and characters , ; . - ( ) [ ] { } ' \" are allowed",
                },
            })} error={errors.description} helper="Full description" />

        </SettingsSection>
    )
}

export default ContentSection