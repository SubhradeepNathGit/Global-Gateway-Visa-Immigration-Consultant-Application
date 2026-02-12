import { formatDateTimeMeridian } from "../dateFormat/dateFormatConvertion"

const handleDownload = (application) => {
    const content = `
VISA APPLICATION DETAILS
========================

Application ID: ${application?.id ?? 'N/A'}
Status: ${application?.status ?? 'N/A'}
Submitted: ${formatDateTimeMeridian(application?.applied_at)}

PERSONAL INFORMATION
-------------------
Name: ${application?.application_personal_info?.first_name} ${application?.application_personal_info?.last_name}
Date of Birth: ${application.application_personal_info?.date_of_birth ?? 'N/A'}
Gender: ${application?.application_personal_info?.gender?? 'N/A'}
Nationality: ${application?.application_personal_info?.nationality??'N/A'}
Email: ${application?.application_personal_info?.email??'N/A'}
Phone: ${application?.application_personal_info?.phone??'N/A'}
Marital Status: ${application?.application_personal_info?.maritalStatus??'N/A'}

ADDRESS
-------
${application?.application_personal_info?.address?? 'N/A'}
${application?.application_personal_info?.city}, ${application?.application_personal_info?.state} ${application?.application_personal_info?.postal_code}
${application?.application_personal_info?.country?? 'N/A'}

PASSPORT INFORMATION
------------------
Passport Number: ${application?.application_passport?.passport_number??'N/A'}
Issue Date: ${application?.application_passport?.issue_date?? 'N/A'}
Expiry Date: ${application?.application_passport?.expiry_date?? 'N/A'}
Issue Place: ${application?.application_passport?.place_of_issue?? 'N/A'}

VISA INFORMATION
--------------
Type: ${application?.application_visa_details?.visa_type?? 'N/A'}
Purpose: ${application?.application_visa_details?.purpose?? 'N/A'}
Duration: ${application?.application_visa_details?.duration?? 'N/A'}
Entry Type: ${application?.application_visa_details?.entryType?? 'N/A'}
Travel Date: ${formatDateTimeMeridian(application?.application_visa_details?.travelDate)?? 'N/A'}
Return Date: ${formatDateTimeMeridian(application?.application_visa_details?.returnDate)?? 'N/A'}

EMPLOYMENT
---------
Status: ${application?.employment?.status?? 'N/A'}
Occupation: ${application?.employment?.occupation?? 'N/A'}
Company: ${application?.employment?.company?? 'N/A'}
Monthly Income: ${application?.employment?.monthlyIncome?? 'N/A'}

${application?.staus && appointmentDetails ? `
APPOINTMENT DETAILS
-----------------
Date: ${appointmentDetails?.date?? 'N/A'}
Time: ${appointmentDetails?.time?? 'N/A'}
Status: Approved
` : ''}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Application-${application.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};

export default handleDownload;