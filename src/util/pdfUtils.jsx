import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import React from 'react';
import CourseCertificate from '../Components/user/dashboard/letter/CourseCertificate';
import toast from 'react-hot-toast';

export const handleDownloadCertificate = async (userAuthData, course, certificateData) => {
    console.log('Starting direct certificate download...', { courseId: course?.id });
    const toastId = toast.loading('Generating your certificate PDF...');

    let printContainer = null;
    try {
        // Create a fixed-size container for capturing
        printContainer = document.createElement('div');
        printContainer.id = 'certificate-capture-container';
        printContainer.style.position = 'fixed';
        printContainer.style.left = '-9999px'; // Off-screen
        printContainer.style.top = '0';
        printContainer.style.width = '1056px'; // Exact width of the certificate
        printContainer.style.height = '816px'; // Exact height of the certificate
        printContainer.style.zIndex = '-9999';
        printContainer.style.background = '#ffffff';
        document.body.appendChild(printContainer);

        const { createRoot } = await import('react-dom/client');
        const root = createRoot(printContainer);

        // Render the Certificate exactly as it should look
        root.render(
            <div style={{ width: '1056px', height: '816px', padding: 0, margin: 0, backgroundColor: '#ffffff' }}>
                <CourseCertificate
                    userAuthData={userAuthData}
                    course={course}
                    certificateData={certificateData}
                    ref={null}
                />
            </div>
        );

        // Wait for rendering (fonts, icons, styles)
        await new Promise(resolve => setTimeout(resolve, 2500));

        const canvas = await html2canvas(printContainer, {
            scale: 4, // High Resolution (approx 300 DPI)
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            width: 1056,
            height: 816,
            scrollX: 0,
            scrollY: 0,
            logging: true,
            onclone: (clonedDoc) => {
                const element = clonedDoc.getElementById('certificate-capture-container');
                if (element) {
                    element.style.display = 'block'; // Ensure it's not hidden in clone
                }
            }
        });

        // console.log('Canvas captured successfully');

        const imgData = canvas.toDataURL('image/png', 1.0);

        // A4 Landscape is 297mm x 210mm. 
        // 1px = 1/96 inch. 
        // 1056px / 96 = 11 inches. 816px / 96 = 8.5 inches. (Letter size actually, close to A4).
        // Let's use exact pixel mapping for best results.
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [1056, 816]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, 1056, 816);
        const fileName = `Certificate_${course?.course_name?.replace(/\s+/g, '_')}.pdf`;
        pdf.save(fileName);

        // Cleanup
        setTimeout(() => {
            root.unmount();
            if (document.body.contains(printContainer)) {
                document.body.removeChild(printContainer);
            }
        }, 100);

        toast.success('Certificate downloaded successfully!', { id: toastId });
    } catch (error) {
        console.error('Direct PDF download failed:', error);

        // Cleanup on error
        if (printContainer && document.body.contains(printContainer)) {
            document.body.removeChild(printContainer);
        }

        toast.error(`Failed to generate PDF: ${error.message}`, { id: toastId });
    }
};
