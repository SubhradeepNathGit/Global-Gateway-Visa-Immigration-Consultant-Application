import React from 'react';
import ApproveLetter from '../Components/user/dashboard/letter/ApproveLetter';
import CourseCertificate from '../Components/user/dashboard/letter/CourseCertificate';

const printStyles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: Arial, sans-serif;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  @page { size: A4; margin: 15mm; }
  .bg-white { background-color: white; }
  .bg-green-50 { background-color: #f0fdf4; }
  .bg-yellow-50 { background-color: #fefce8; }
  .bg-gray-50 { background-color: #f9fafb; }
  .bg-gray-100 { background-color: #f3f4f6; }
  .text-green-700 { color: #15803d; }
  .text-green-800 { color: #166534; }
  .text-gray-600 { color: #4b5563; }
  .text-gray-700 { color: #374151; }
  .text-gray-800 { color: #1f2937; }
  .text-gray-900 { color: #111827; }
  .text-white { color: white; }
  .border-green-700 { border-color: #15803d; }
  .border-yellow-600 { border-color: #ca8a04; }
  .border-gray-300 { border-color: #d1d5db; }
  .border-gray-400 { border-color: #9ca3af; }
  .border-l-4 { border-left-width: 4px; }
  .border-b-4 { border-bottom-width: 4px; }
  .border-t-2 { border-top-width: 2px; }
  .border-2 { border-width: 2px; }
  .border-4 { border-width: 4px; }
  .border { border-width: 1px; }
  .border-t { border-top-width: 1px; }
  .border-b { border-bottom-width: 1px; }
  .rounded-lg { border-radius: 0.5rem; }
  .rounded-full { border-radius: 9999px; }
  .uppercase { text-transform: uppercase; }
  .font-bold { font-weight: 700; }
  .font-semibold { font-weight: 600; }
  .font-mono { font-family: monospace; }
  .italic { font-style: italic; }
  .text-2xl { font-size: 1.5rem; line-height: 2rem; }
  .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
  .text-base { font-size: 1rem; line-height: 1.5rem; }
  .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
  .text-xs { font-size: 0.75rem; line-height: 1rem; }
  .tracking-wide { letter-spacing: 0.025em; }
  .p-8 { padding: 2rem; }
  .p-4 { padding: 1rem; }
  .px-4 { padding-left: 1rem; padding-right: 1rem; }
  .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
  .pt-1 { padding-top: 0.25rem; }
  .pt-4 { padding-top: 1rem; }
  .pb-4 { padding-bottom: 1rem; }
  .pb-6 { padding-bottom: 1.5rem; }
  .mb-1 { margin-bottom: 0.25rem; }
  .mb-2 { margin-bottom: 0.5rem; }
  .mb-3 { margin-bottom: 0.75rem; }
  .mb-4 { margin-bottom: 1rem; }
  .mb-6 { margin-bottom: 1.5rem; }
  .mt-1 { margin-top: 0.25rem; }
  .mt-2 { margin-top: 0.5rem; }
  .mx-auto { margin-left: auto; margin-right: auto; }
  .ml-auto { margin-left: auto; }
  .max-w-4xl { max-width: 56rem; }
  .w-3 { width: 0.75rem; }
  .h-3 { height: 0.75rem; }
  .w-4 { width: 1rem; }
  .h-4 { height: 1rem; }
  .w-6 { width: 1.5rem; }
  .h-6 { height: 1.5rem; }
  .w-10 { width: 2.5rem; }
  .h-10 { height: 2.5rem; }
  .w-20 { width: 5rem; }
  .h-20 { height: 5rem; }
  .h-16 { height: 4rem; }
  .flex { display: flex; }
  .grid { display: grid; }
  .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .gap-2 { gap: 0.5rem; }
  .gap-3 { gap: 0.75rem; }
  .gap-4 { gap: 1rem; }
  .gap-8 { gap: 2rem; }
  .items-start { align-items: flex-start; }
  .items-center { align-items: center; }
  .justify-center { justify-content: center; }
  .flex-shrink-0 { flex-shrink: 0; }
  .text-center { text-align: center; }
  .text-right { text-align: right; }
  .space-y-2 > * + * { margin-top: 0.5rem; }
  .space-y-3 > * + * { margin-top: 0.75rem; }
  .bg-blue-900 { background-color: #1e3a8a !important; }
  .bg-blue-50 { background-color: #eff6ff !important; }
  .bg-yellow-500 { background-color: #eab308 !important; }
  .text-blue-900 { color: #1e3a8a !important; }
  .text-blue-800 { color: #1e40af !important; }
  .text-yellow-500 { color: #eab308 !important; }
  .border-blue-900 { border-color: #1e3a8a !important; }
  .border-double { border-style: double !important; }
  .border-[16px] { border-width: 16px !important; }
  .opacity-[0.03] { opacity: 0.03 !important; }
  .flex { display: flex !important; }
  .justify-center { justify-content: center !important; }
  .items-center { align-items: center !important; }
  .text-4xl { font-size: 2.25rem !important; }
  .text-3xl { font-size: 1.875rem !important; }
  .text-xl { font-size: 1.25rem !important; }
  .italic { font-style: italic !important; }
  .font-serif { font-family: Georgia, serif !important; }
  .tracking-[0.2em] { letter-spacing: 0.2em !important; }
  .tracking-[0.4em] { letter-spacing: 0.4em !important; }
  .tracking-[0.3em] { letter-spacing: 0.3em !important; }
  .overflow-hidden { overflow: hidden !important; }
`;

export const handlePrintApproval = (visa, countryDetails, visaData, applicationDetails) => {
  const printContainer = document.createElement('div');
  printContainer.style.position = 'absolute';
  printContainer.style.left = '-9999px';
  document.body.appendChild(printContainer);

  import('react-dom/client').then(({ createRoot }) => {
    const root = createRoot(printContainer);

    root.render(
      React.createElement(ApproveLetter, {
        visa: visa,
        countryDetails: countryDetails,
        visaData: visaData,
        applicationDetails: applicationDetails
      })
    );

    setTimeout(() => {
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Visa Approval Letter</title>
            <style>${printStyles}</style>
          </head>
          <body>${printContainer.innerHTML}</body>
        </html>
      `);
      doc.close();

      setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
          document.body.removeChild(printContainer);
          root.unmount();
        }, 100);
      }, 500);
    }, 300);
  });
};