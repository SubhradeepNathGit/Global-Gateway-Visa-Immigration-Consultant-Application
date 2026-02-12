import React from 'react';
import AppointmentLetter from './letter/AppointmentLetter';

const printStyles = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Arial, sans-serif;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    @page { size: A4; margin: 14mm; }
    .bg-white { background-color: white; }
    .bg-red-50 { background-color: #fef2f2; }
    .bg-gray-100 { background-color: #f3f4f6; }
    .text-gray-900 { color: #111827; }
    .text-gray-700 { color: #374151; }
    .text-gray-600 { color: #4b5563; }
    .text-gray-500 { color: #6b7280; }
    .text-red-800 { color: #991b1b; }
    .border-red-800 { border-color: #991b1b; }
    .border-gray-300 { border-color: #d1d5db; }
    .border-gray-400 { border-color: #9ca3af; }
    .border-red-200 { border-color: #fecaca; }
    .border-l-4 { border-left-width: 4px; }
    .border-b-2 { border-bottom-width: 2px; }
    .border-b { border-bottom-width: 1px; }
    .border-t { border-top-width: 1px; }
    .border { border-width: 1px; }
    .border-3 { border-width: 3px; }
    .rounded-full { border-radius: 9999px; }
    .uppercase { text-transform: uppercase; }
    .font-bold { font-weight: 700; }
    .font-semibold { font-weight: 600; }
    .font-mono { font-family: monospace; }
    .italic { font-style: italic; }
    .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
    .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
    .text-xs { font-size: 0.75rem; line-height: 1rem; }
    .tracking-wide { letter-spacing: 0.025em; }
    .p-8 { padding: 2rem; }
    .p-4 { padding: 1rem; }
    .p-3 { padding: 0.75rem; }
    .pb-4 { padding-bottom: 1rem; }
    .pb-3 { padding-bottom: 0.75rem; }
    .pt-2 { padding-top: 0.5rem; }
    .pt-3 { padding-top: 0.75rem; }
    .mb-6 { margin-bottom: 1.5rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-3 { margin-bottom: 0.75rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-1 { margin-bottom: 0.25rem; }
    .ml-2 { margin-left: 0.5rem; }
    .mx-auto { margin-left: auto; margin-right: auto; }
    .max-w-3xl { max-width: 48rem; }
    .w-16 { width: 4rem; }
    .h-16 { height: 4rem; }
    .w-32 { width: 8rem; }
    .w-24 { width: 6rem; }
    .flex { display: flex; }
    .grid { display: grid; }
    .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .gap-x-4 { column-gap: 1rem; }
    .items-center { align-items: center; }
    .justify-center { justify-content: center; }
    .justify-between { justify-content: space-between; }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .leading-relaxed { line-height: 1.625; }
  `;

export const handlePrint = (appointment, countryDetails, reason) => {
  const printContainer = document.createElement('div');
  printContainer.style.position = 'absolute';
  printContainer.style.left = '-9999px';
  document.body.appendChild(printContainer);

  import('react-dom/client').then(({ createRoot }) => {
    const root = createRoot(printContainer);

    root.render(
      React.createElement(AppointmentLetter, {
        appointment: appointment,
        countryDetails: countryDetails,
        reason: reason
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
              <title>Appointment Letter</title>
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