import React from 'react'
import { Globe, Mail, Clock } from "lucide-react";

const ApplicationDetails = ({ personalInfo, InfoRow, visaData, visaSpecification }) => {

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
            <InfoRow icon={Mail} label="Applicant Email" value={personalInfo?.email ?? 'N/A'} />
            <InfoRow icon={Globe} label="Visa Type" value={visaData?.visa_type ?? 'N/A'} />
            <div className="sm:col-span-2">
                <InfoRow icon={Clock} label="Processing Time" value={visaSpecification?.visa_processing_time ?? 'N/A'} />
            </div>
        </div>
    )
}

export default ApplicationDetails