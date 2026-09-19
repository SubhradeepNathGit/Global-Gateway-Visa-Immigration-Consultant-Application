export const DEFAULT_APPOINTMENT_REASONS = [
    {
        id: "default-doc-verification",
        reason_id: "document-verification",
        type: "Document Verification",
        description: "Verification of original passport, identity proofs, and supporting documents in person.",
        status: true
    },
    {
        id: "default-biometrics",
        reason_id: "biometrics-collection",
        type: "Biometrics Collection",
        description: "Fingerprint scanning and digital photograph capture for visa processing.",
        status: true
    },
    {
        id: "default-interview",
        reason_id: "visa-interview",
        type: "Visa Interview",
        description: "In-person consular interview to assess visa eligibility and purpose of travel.",
        status: true
    },
    {
        id: "default-passport-submission",
        reason_id: "passport-submission",
        type: "Passport Submission",
        description: "Physical passport submission for official visa vignette sticker endorsement.",
        status: true
    }
];

export const getFallbackReasonById = (reasonId) => {
    if (!reasonId) return null;
    const found = DEFAULT_APPOINTMENT_REASONS.find(r => r.reason_id === reasonId);
    if (found) return found;

    return {
        reason_id: reasonId,
        type: reasonId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        description: 'Appointment requirement for visa processing'
    };
};
