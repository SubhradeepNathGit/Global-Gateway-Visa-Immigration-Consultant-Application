import React from 'react'
import { DollarSign } from 'lucide-react'

const CulturalFinancialSection = ({ SettingsSection, FormField, register, errors }) => {
    return (
        <SettingsSection title="Cultural & Financial" description="Currency and language" icon={DollarSign}>

            <FormField label="Currency" id="currency" placeholder="e.g., UAE dirham (د.إ)" register={
                register("currency",
                    { pattern: { value: /^[A-Za-z -]+$/, message: "Currency is not valid" } }
                )} error={errors.currency} helper="Full currency name" />

            <FormField label="Currency Code" id="currencyCode" placeholder="e.g., AED" register={
                register("currencyCode",
                    { pattern: { value: /^[A-Za-z]+$/, message: "Currency code is not valid" } }
                )
            } error={errors.currencyCode} />

            <FormField label="Currency Symbol" id="currencySymbol" placeholder="e.g., د.إ" register={
                register("currencySymbol")} helper="Symbol (optional)" error={errors.currencySymbol} />

            <FormField label="Primary Language(s)" id="language" placeholder="e.g., Arabic, English" register={
                register("language",
                    { pattern: { value: /^[A-Za-z, ]+$/, message: "Language is not valid" } }
                )} error={errors.language} helper="Comma-separated" />

        </SettingsSection>
    )
}

export default CulturalFinancialSection