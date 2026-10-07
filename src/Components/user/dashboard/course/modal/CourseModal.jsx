import React, { useEffect, useState, useCallback } from 'react'
import { Download, X } from 'lucide-react'
import CourseCertificate from '../../letter/CourseCertificate'
import { handleDownloadCertificate } from '../../../../../util/pdfUtils'

const CERT_W = 1056
const CERT_H = 816

const CourseModal = ({ course, certificateRef, certificate, userAuthData, setShowCertificateModal }) => {
    const [scale, setScale] = useState(1)

    const computeScale = useCallback(() => {
        // Reserve space: 56px for top bar + 32px vertical padding
        const availW = window.innerWidth - 32
        const availH = window.innerHeight - 56 - 32
        const s = Math.min(availW / CERT_W, availH / CERT_H, 1)
        setScale(s)
    }, [])

    useEffect(() => {
        computeScale()
        window.addEventListener('resize', computeScale)
        return () => window.removeEventListener('resize', computeScale)
    }, [computeScale])

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'rgba(0,0,0,0.88)',
                backdropFilter: 'blur(8px)',
            }}
        >
            {/* ── Top Bar ── */}
            <div
                style={{
                    height: '56px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 24px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.04)',
                }}
            >
                <div>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                        Course Certificate
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginTop: '2px' }}>
                        {course?.course_name}
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        onClick={() => handleDownloadCertificate(userAuthData, course, certificate)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 18px',
                            borderRadius: '10px',
                            border: 'none',
                            background: 'linear-gradient(135deg,#1d4ed8,#2563eb)',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '13px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(37,99,235,0.45)',
                        }}
                        type="button"
                    >
                        <Download style={{ width: 15, height: 15 }} />
                        Download PDF
                    </button>

                    <button
                        onClick={() => setShowCertificateModal(false)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            border: 'none',
                            background: 'rgba(255,255,255,0.1)',
                            cursor: 'pointer',
                        }}
                        type="button"
                        aria-label="Close"
                    >
                        <X style={{ width: 18, height: 18, color: 'rgba(255,255,255,0.8)' }} />
                    </button>
                </div>
            </div>

            {/* ── Certificate Viewport ── */}
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px',
                    overflow: 'hidden',
                }}
            >
                {/*
                  Outer shell: sized to exactly what the scaled certificate occupies,
                  so box-shadow / rounded corners wrap it cleanly.
                */}
                <div
                    style={{
                        width: `${CERT_W * scale}px`,
                        height: `${CERT_H * scale}px`,
                        position: 'relative',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
                        flexShrink: 0,
                    }}
                >
                    {/* Scale the certificate from its top-left origin */}
                    <div
                        style={{
                            width: `${CERT_W}px`,
                            height: `${CERT_H}px`,
                            transform: `scale(${scale})`,
                            transformOrigin: 'top left',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                        }}
                    >
                        <CourseCertificate
                            ref={certificateRef}
                            userAuthData={userAuthData}
                            course={course}
                            certificateData={certificate}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseModal