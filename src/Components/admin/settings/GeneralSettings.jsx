import React, { useState } from 'react'
import { Globe } from 'lucide-react'

const GeneralSettings = ({ SettingsSection, FormField, userAuthData }) => {

    const [siteName, setSiteName] = useState("Global Gateway");
    const [siteDescription, setSiteDescription] = useState("Visa Immigration Services Platform-connecting Users with Embessies");
    const [adminEmail, setAdminEmail] = useState(userAuthData?.email);
    const [supportEmail, setSupportEmail] = useState("support@globalgateway.com");

    return (
        <SettingsSection
            title="General"
            description="Basic application settings"
            icon={Globe}
        >
            <FormField
                label="Site Name"
                id="siteName"
                placeholder="Enter site name"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                disabled={true}
            />
            <FormField
                label="Site Description"
                id="siteDescription"
                placeholder="Enter site description"
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                disabled={true}
            />
            <FormField
                label="Admin Email"
                id="adminEmail"
                type="email"
                placeholder="admin@example.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                helper="Primary contact for system notifications"
                disabled={true}
            />
            <FormField
                label="Support Email"
                id="supportEmail"
                type="email"
                placeholder="support@example.com"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                helper="Customer support contact email"
                disabled={true}
            />
        </SettingsSection>
    )
}

export default GeneralSettings