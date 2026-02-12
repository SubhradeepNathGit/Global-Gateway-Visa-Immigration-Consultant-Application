import jsPDF from "jspdf";

export const DownloadPolicyGuide = (currentPolicy, selectedCategory) => {
    const doc = new jsPDF();

    // Set up colors
    const primaryColor = [29, 43, 64]; // #1d2b40
    const accentColor = [255, 76, 76]; // #ff4c4c

    let yPos = 20;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);

    // Title
    doc.setFontSize(22);
    doc.setTextColor(...primaryColor);
    doc.setFont(undefined, 'bold');
    doc.text('VISA POLICY GUIDE', margin, yPos);

    // Red line under title
    yPos += 3;
    doc.setDrawColor(...accentColor);
    doc.setLineWidth(1);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    // Policy Title
    doc.setFontSize(16);
    doc.setTextColor(...accentColor);
    doc.text(currentPolicy?.title, margin, yPos);
    yPos += 8;

    // Description
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.setFont(undefined, 'normal');
    const descLines = currentPolicy?.description ? doc.splitTextToSize(currentPolicy?.description, maxWidth) : doc.splitTextToSize(currentPolicy?.country);
    doc.text(descLines, margin, yPos);
    yPos += (descLines.length * 5) + 8;

    // Info Box
    doc.setFillColor(248, 249, 250);
    doc.rect(margin, yPos, maxWidth, 32, 'F');
    doc.setDrawColor(...accentColor);
    doc.setLineWidth(2);
    doc.line(margin, yPos, margin, yPos + 32);

    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('Processing Time:', margin + 5, yPos + 7);
    doc.setFont(undefined, 'normal');
    doc.text(currentPolicy?.processingTime, margin + 45, yPos + 7);

    doc.setFont(undefined, 'bold');
    doc.text('Validity Period:', margin + 5, yPos + 14);
    doc.setFont(undefined, 'normal');
    doc.text(currentPolicy?.validityPeriod, margin + 45, yPos + 14);

    doc.setFont(undefined, 'bold');
    doc.text('Visa Type:', margin + 5, yPos + 21);
    doc.setFont(undefined, 'normal');
    doc.text(currentPolicy?.visaType, margin + 45, yPos + 21);

    doc.setFont(undefined, 'bold');
    doc.text('Application Fees:', margin + 5, yPos + 28);
    doc.setFont(undefined, 'normal');
    doc.text('RS.' + currentPolicy?.fees, margin + 45, yPos + 28);

    yPos += 45;

    // Required Documents Section
    doc.setFontSize(14);
    doc.setTextColor(...accentColor);
    doc.setFont(undefined, 'bold');
    doc.text('Required Documents & Eligibility Criteria', margin, yPos);
    yPos += 8;

    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.setFont(undefined, 'normal');
    doc.text('All applicants must provide the following documentation:', margin, yPos);
    yPos += 7;

    currentPolicy?.requirements.forEach((req, index) => {
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }
        doc.setFillColor(...accentColor);
        doc.circle(margin + 2, yPos - 1.5, 1, 'F');
        const reqLines = doc.splitTextToSize(req, maxWidth - 10);
        doc.text(reqLines, margin + 6, yPos);
        yPos += (reqLines.length * 5) + 2;
    });

    yPos += 5;

    // Application Process Section
    if (yPos > 220) {
        doc.addPage();
        yPos = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(...accentColor);
    doc.setFont(undefined, 'bold');
    doc.text('Step-by-Step Application Process', margin, yPos);
    yPos += 7;

    const steps = [
        'Complete comprehensive online application form with accurate information',
        'Upload all required documents in specified formats (PDF, JPG)',
        'Pay application fees through secure payment gateway',
        'Schedule biometric data collection appointment (if required)',
        'Attend mandatory interview session (if applicable)',
        'Track application status and await final processing decision',
    ];

    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.setFont(undefined, 'normal');

    steps.forEach((step, index) => {
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }
        doc.setFillColor(...primaryColor);
        doc.circle(margin + 3, yPos - 1, 2.5, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(7);
        doc.setFont(undefined, 'bold');
        doc.text(String(index + 1), margin + 2.2, yPos + 0.5);

        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
        doc.setFont(undefined, 'normal');
        const stepLines = doc.splitTextToSize(step, maxWidth - 12);
        doc.text(stepLines, margin + 8, yPos);
        yPos += (stepLines.length * 5) + 2;
    });

    yPos += 5;

    // Terms Section
    if (yPos > 240) {
        doc.addPage();
        yPos = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(...accentColor);
    doc.setFont(undefined, 'bold');
    doc.text('Policy Terms & Legal Framework', margin, yPos);
    yPos += 7;

    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.setFont(undefined, 'normal');
    const termsText = 'These policies are subject to change based on governmental regulations, international agreements, and bilateral treaties. All applicants must comply with current terms and conditions at the time of application submission.';
    const termsLines = doc.splitTextToSize(termsText, maxWidth);
    doc.text(termsLines, margin, yPos);
    yPos += (termsLines.length * 5) + 5;

    // Warning Box
    doc.setFillColor(255, 243, 205);
    doc.setDrawColor(255, 234, 167);
    doc.rect(margin, yPos, maxWidth, 12, 'FD');
    doc.setFontSize(9);
    doc.setTextColor(133, 100, 4);
    doc.setFont(undefined, 'bold');
    doc.text('⚠️ Important:', margin + 3, yPos + 5);
    doc.setFont(undefined, 'normal');
    doc.text('Policy compliance is mandatory. Non-compliance may result in rejection.', margin + 3, yPos + 9);
    yPos += 17;

    // Emergency Support
    doc.setFontSize(14);
    doc.setTextColor(...accentColor);
    doc.setFont(undefined, 'bold');
    doc.text('Emergency Support', margin, yPos);
    yPos += 7;

    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.setFont(undefined, 'normal');
    doc.text('24/7 hotline:', margin, yPos);
    doc.setFont(undefined, 'bold');
    doc.text('+91-9098909890', margin + 25, yPos);
    yPos += 10;

    // Footer
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 5;

    doc.setFontSize(8);
    doc.setTextColor(102, 102, 102);
    doc.setFont(undefined, 'bold');
    doc.text('Last Updated:', margin, yPos);
    doc.setFont(undefined, 'normal');
    doc.text('January 2025', margin + 25, yPos);

    // Save the PDF
    doc.save(`Policy_Guide_${selectedCategory.replace(/\s+/g, '_')}.pdf`);
}