import React, { forwardRef } from 'react';
import { Award, CheckCircle, Calendar, ShieldCheck, Star } from 'lucide-react';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import { formatDateDDMMYYYY } from '../../../../util/dateFormat/dateFormatConvertion';

const CourseCertificate = forwardRef(({ userAuthData, course, certificateData }, ref) => {
  const fullName = `${userAuthData?.first_name || ''} ${userAuthData?.last_name || ''}`.trim() || userAuthData?.name || 'N/A';
  const completionDate = certificateData?.certificate_reg_date
    ? formatDateDDMMYYYY(certificateData.certificate_reg_date)
    : formatDateDDMMYYYY(new Date());

  return (
    <div style={{ width: '100%', height: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0' }}>
      <div
        ref={ref}
        style={{
          fontFamily: 'Georgia, serif',
          lineHeight: '1.4',
          width: '1056px',
          height: '816px',
          background: 'linear-gradient(to bottom right, #ffffff, rgba(239, 246, 255, 0.3), #ffffff)',
          border: '1px solid #e2e8f0',
          boxSizing: 'border-box',
          backgroundColor: '#ffffff',
          color: '#111827', // gray-900 equivalent
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' // shadow-2xl equivalent
        }}
      >
        {/* Outer Decorative Border - Gold */}
        <div style={{ position: 'absolute', inset: '0', borderWidth: '20px', borderStyle: 'double', borderColor: '#B8860B', pointerEvents: 'none' }}></div>

        {/* Inner Premium Border - Navy */}
        <div style={{ position: 'absolute', inset: '24px', borderWidth: '2px', borderStyle: 'solid', borderColor: '#172554', pointerEvents: 'none' }}></div>

        {/* Accent Border - Gold */}
        <div style={{ position: 'absolute', inset: '30px', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(202, 138, 4, 0.4)', pointerEvents: 'none' }}></div>

        {/* Corner Ornaments */}
        <div style={{ position: 'absolute', top: '30px', left: '30px', width: '48px', height: '48px' }}>
          <Star style={{ position: 'absolute', top: '0', left: '0', width: '16px', height: '16px', color: '#ca8a04', fill: '#ca8a04' }} />
        </div>
        <div style={{ position: 'absolute', top: '30px', right: '30px', width: '48px', height: '48px' }}>
          <Star style={{ position: 'absolute', top: '0', right: '0', width: '16px', height: '16px', color: '#ca8a04', fill: '#ca8a04' }} />
        </div>
        <div style={{ position: 'absolute', bottom: '30px', left: '30px', width: '48px', height: '48px' }}>
          <Star style={{ position: 'absolute', bottom: '0', left: '0', width: '16px', height: '16px', color: '#ca8a04', fill: '#ca8a04' }} />
        </div>
        <div style={{ position: 'absolute', bottom: '30px', right: '30px', width: '48px', height: '48px' }}>
          <Star style={{ position: 'absolute', bottom: '0', right: '0', width: '16px', height: '16px', color: '#ca8a04', fill: '#ca8a04' }} />
        </div>

        {/* Subtle Background Watermark */}
        <div style={{ position: 'absolute', inset: '0', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: '0.015' }}>
          <FlightTakeoffIcon style={{ fontSize: '600px', color: '#172554' }} />
        </div>

        {/* Content Container */}
        <div style={{ position: 'relative', paddingLeft: '48px', paddingRight: '48px', paddingTop: '40px', paddingBottom: '40px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

          {/* Header Section */}
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            {/* Premium Logo & Emblem */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '64px', height: '64px', border: '2px solid #ca8a04', borderRadius: '9999px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'linear-gradient(to bottom right, #172554, #1e3a8a, #172554)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', position: 'relative'
                }}>
                  <FlightTakeoffIcon style={{ fontSize: '32px', color: '#eab308' }} />
                  <div style={{ position: 'absolute', inset: '0', borderRadius: '9999px', border: '1px solid rgba(250, 204, 21, 0.3)', margin: '2px' }}></div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '8px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#172554', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '4px', fontFamily: 'Palatino, serif' }}>
                Global Gateway
              </h1>
              <p style={{ fontSize: '12px', color: '#a16207', textTransform: 'uppercase', letterSpacing: '0.3em', fontWeight: '600' }}>
                Your Gateway to Global Opportunities
              </p>
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '48px', height: '1px', background: 'linear-gradient(to right, transparent, #ca8a04)' }}></div>
              <div style={{ width: '6px', height: '6px', backgroundColor: '#ca8a04', borderRadius: '9999px' }}></div>
              <div style={{ width: '48px', height: '1px', background: 'linear-gradient(to left, transparent, #ca8a04)' }}></div>
            </div>

            <h2 style={{ fontSize: '36px', fontFamily: 'Palatino, serif', fontWeight: 'bold', color: '#172554', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              Certificate
            </h2>
            <p style={{ fontSize: '18px', fontWeight: '300', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '12px' }}>
              of Completion
            </p>
          </div>

          {/* Certificate Content */}
          <div style={{ textAlign: 'center', flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '8px', paddingBottom: '8px' }}>
            <p style={{ fontSize: '20px', color: '#4b5563', marginBottom: '8px', fontFamily: 'Palatino, serif', fontStyle: 'italic' }}>
              This certifies that
            </p>

            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '36px', fontWeight: 'bold', color: '#172554', marginBottom: '8px', textTransform: 'capitalize', fontFamily: 'Palatino, serif' }}>
                {fullName}
              </h3>
              <div style={{ width: '192px', height: '1px', margin: '0 auto', backgroundColor: '#d1d5db' }}></div>
            </div>

            <p style={{ fontSize: '20px', color: '#4b5563', marginBottom: '16px', fontFamily: 'Palatino, serif', fontStyle: 'italic' }}>
              has successfully completed
            </p>

            {/* Course Name Box */}
            <div style={{
              paddingTop: '16px', paddingBottom: '16px', paddingLeft: '24px', paddingRight: '24px', marginBottom: '16px',
              borderTop: '1px solid rgba(202, 138, 4, 0.2)', borderBottom: '1px solid rgba(202, 138, 4, 0.2)',
              margin: '0 auto', maxWidth: '896px',
              background: 'linear-gradient(to right, rgba(23, 37, 84, 0.05), rgba(30, 58, 138, 0.1), rgba(23, 37, 84, 0.05))'
            }}>
              <h4 style={{ fontSize: '30px', fontWeight: 'bold', color: '#1e3a8a', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: '1.25', fontFamily: 'Palatino, serif' }}>
                {course?.course_name || 'N/A'}
              </h4>
            </div>

            <p style={{ fontSize: '16px', color: '#374151', maxWidth: '672px', margin: '0 auto', paddingLeft: '16px', paddingRight: '16px', lineHeight: '1.625', fontFamily: 'Palatino, serif' }}>
              demonstrating exceptional commitment and proficiency in all course modules,
              assessments, and practical requirements established by Global Gateway International.
            </p>
          </div>

          {/* Verification Details */}
          <div style={{ paddingTop: '16px', paddingBottom: '16px', marginBottom: '16px', background: 'linear-gradient(to right, transparent, rgba(23, 37, 84, 0.05), transparent)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '32px', maxWidth: '896px', margin: '0 auto', paddingLeft: '16px', paddingRight: '16px' }}>
              <div style={{ textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', flexShrink: '0', background: 'linear-gradient(to bottom right, #172554, #1e3a8a)' }}>
                  <Calendar style={{ width: '20px', height: '20px', color: '#facc15' }} strokeWidth={2} />
                </div>
                <div style={{ minWidth: '0' }}>
                  <p style={{ fontSize: '10px', textTransform: 'uppercase', color: '#a16207', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: '2px' }}>
                    Completion Date
                  </p>
                  <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#172554', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'Palatino, serif' }}>
                    {completionDate}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', gap: '12px' }}>
                <div style={{ textAlign: 'right', minWidth: '0' }}>
                  <p style={{ fontSize: '10px', textTransform: 'uppercase', color: '#a16207', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: '2px' }}>
                    Certificate ID
                  </p>
                  <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#172554', fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    GG-{certificateData?.id?.substring(0, 12).toUpperCase() || 'OFFICIAL'}
                  </p>
                </div>
                <div style={{ padding: '8px', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', flexShrink: '0', background: 'linear-gradient(to bottom right, #172554, #1e3a8a)' }}>
                  <ShieldCheck style={{ width: '20px', height: '20px', color: '#facc15' }} strokeWidth={2} />
                </div>
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px', alignItems: 'end', borderTop: '1px solid rgba(202, 138, 4, 0.2)', paddingTop: '16px', position: 'relative' }}>

            {/* Stamp Image */}
            <div style={{ position: 'absolute', top: '-60px', right: '18%', opacity: '0.9', transform: 'rotate(-10deg)', pointerEvents: 'none' }}>
              <img src="/Stamp3.png" alt="Official Stamp" style={{ width: '128px', height: '128px', objectFit: 'contain' }} />
            </div>

            <div style={{ textAlign: 'center', zIndex: '10' }}>
              <div style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                <p style={{ fontSize: '24px', color: '#1e3a8a', pointerEvents: 'none', userSelect: 'none', fontFamily: 'Brush Script MT, cursive' }}>
                  Global Gateway
                </p>
              </div>
              <div style={{ borderTop: '1px solid #d1d5db', paddingTop: '4px' }}>
                <p style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', color: '#374151', letterSpacing: '0.05em' }}>
                  Training Director
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', zIndex: '10' }}>
              <div style={{ position: 'relative', bottom: '16px' }}>
                <div style={{
                  width: '80px', height: '80px', border: '2px solid #ca8a04', borderRadius: '9999px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  background: 'linear-gradient(to bottom right, #172554, #1e3a8a, #172554)',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#facc15', lineHeight: '1.25', letterSpacing: '0.05em' }}>GG</div>
                  <ShieldCheck style={{ width: '24px', height: '24px', color: '#facc15', marginTop: '2px', marginBottom: '2px' }} strokeWidth={2.5} />
                  <div style={{ fontSize: '6px', fontWeight: 'bold', color: '#facc15', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Certified</div>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', zIndex: '10' }}>
              <div style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                <p style={{ fontSize: '24px', color: '#1e3a8a', pointerEvents: 'none', userSelect: 'none', fontFamily: 'Brush Script MT, cursive' }}>
                  Consular Services
                </p>
              </div>
              <div style={{ borderTop: '1px solid #d1d5db', paddingTop: '4px' }}>
                <p style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', color: '#374151', letterSpacing: '0.05em' }}>
                  Authorized Signature
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <p style={{ fontSize: '9px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: '300' }}>
              Global Gateway International • Professional Visa & Immigration Services
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

CourseCertificate.displayName = 'CourseCertificate';

export default CourseCertificate;