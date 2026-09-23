import React, { useState } from 'react';
import {
    FileText, Lock, GraduationCap, Plane, Briefcase,
    Building2, HeartPulse, Users, Shuffle, FlaskConical,
    Globe, ArrowRight, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

/* ─── Visa type → theme ─────────────────────────────────────────────────── */
const getVisaInfo = (visaType = '') => {
    const t = (visaType || '').toLowerCase();
    if (t.includes('student') || t.includes('education') || t.includes('study'))
        return { icon: GraduationCap, tag: 'EDUCATION', color: '#1d4ed8', light: '#eff6ff' };
    if (t.includes('tourist') || t.includes('travel') || t.includes('visit'))
        return { icon: Plane, tag: 'TOURISM', color: '#b91c1c', light: '#fff5f5' };
    if (t.includes('work') || t.includes('employ') || t.includes('labor'))
        return { icon: Briefcase, tag: 'EMPLOYMENT', color: '#065f46', light: '#f0fdf4' };
    if (t.includes('business') || t.includes('investor') || t.includes('commerce'))
        return { icon: Building2, tag: 'BUSINESS', color: '#92400e', light: '#fffbeb' };
    if (t.includes('medical') || t.includes('health') || t.includes('treatment'))
        return { icon: HeartPulse, tag: 'MEDICAL', color: '#6b21a8', light: '#faf5ff' };
    if (t.includes('family') || t.includes('spouse') || t.includes('dependent'))
        return { icon: Users, tag: 'FAMILY', color: '#9a3412', light: '#fff7ed' };
    if (t.includes('transit') || t.includes('transfer'))
        return { icon: Shuffle, tag: 'TRANSIT', color: '#1e3a5f', light: '#f8fafc' };
    return { icon: Globe, tag: 'GENERAL', color: '#374151', light: '#f9fafb' };
};

/* ─── Compact White Visa Card ──────────────────────────────────────────── */
const VisaCard = ({ item, index, encodedCountryId, userAuthData }) => {
    const visaTypeTitle = item?.visa?.visa_type || item?.visa_type || 'Travel Visa';
    const { icon: Icon, tag, color, light } = getVisaInfo(visaTypeTitle);
    const applyLink = encodedCountryId ? `/visaprocess/${encodedCountryId}` : '#';

    const processingTime = item?.visa_details?.[0]?.visa_processing_time || item?.visa_processing_time || '5-10 Days';
    const rawValidity = item?.visa_details?.[0]?.visa_validity || item?.visa_validity || 'Multi-Entry';
    // Enforce minimum display of 10 days (not 1 day)
    const validity = (() => {
        if (!rawValidity || rawValidity === 'N/A') return '10 Days';
        const str = String(rawValidity).trim();
        const numMatch = str.match(/\d+/);
        if (numMatch) {
            const num = parseInt(numMatch[0], 10);
            const lower = str.toLowerCase();
            if ((lower.includes('day') || (!lower.includes('month') && !lower.includes('year') && !lower.includes('week'))) && num < 10) {
                return '10 Days';
            }
        }
        return str;
    })();
    const fee = item?.visa_details?.[0]?.visa_fees || item?.visa_fees;
    const refNo = `GGW${String(index + 1).padStart(4, '0')}`;
    const issueYear = new Date().getFullYear();

    // Holder name with initial(s) + surname (e.g. "T. DAS"), truncated with ... if too big
    const holderName = (() => {
        const raw = (userAuthData?.name || 'Traveller').trim();
        const parts = raw.split(/\s+/);
        if (parts.length === 1) return parts[0].toUpperCase();
        const initials = parts.slice(0, -1).map(p => p[0].toUpperCase() + '.').join(' ');
        const lastName = parts[parts.length - 1].toUpperCase();
        return `${initials} ${lastName}`;
    })();

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.36, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
        >
            <Link to={applyLink} className="group block focus:outline-none">
                <div
                    className="relative rounded-xl overflow-hidden bg-white transition-all duration-300 group-hover:-translate-y-1"
                    style={{
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = color;
                        e.currentTarget.style.boxShadow = `0 0 0 1px ${color}40, 0 4px 20px ${color}18`;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
                    }}
                >
                    <div className="relative flex">

                        {/* ════ LEFT MAIN BODY ════ */}
                        <div className="flex-1 px-4 py-3 min-w-0 relative">

                            {/* Security watermark */}
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    opacity: 0.02,
                                    backgroundImage: `repeating-linear-gradient(60deg,${color} 0,${color} 1px,transparent 0,transparent 10px),
                                                      repeating-linear-gradient(-60deg,${color} 0,${color} 1px,transparent 0,transparent 10px)`,
                                }}
                            />

                            {/* Row 1: ✈ Global Gateway + ref */}
                            <div className="flex items-center justify-between mb-2 relative z-10">
                                <div className="flex items-center gap-1.5">
                                    <Plane className="w-3 h-3 flex-shrink-0" style={{ color }} />
                                    <span
                                        className="text-[9px] font-bold uppercase tracking-[0.16em] whitespace-nowrap"
                                        style={{ color }}
                                    >
                                        Global Gateway
                                    </span>
                                </div>
                                <span className="text-[8px] font-semibold tracking-wider flex-shrink-0 ml-2" style={{ color: `${color}99` }}>
                                    {refNo}
                                </span>
                            </div>

                            {/* Row 2: Stamp + Visa type */}
                            <div className="flex items-center gap-2.5 mb-2.5 relative z-10">
                                {/* Circular ink stamp */}
                                <div className="flex-shrink-0 relative" style={{ width: 46, height: 46 }}>
                                    <svg viewBox="0 0 46 46" className="absolute inset-0 w-full h-full">
                                        <circle cx="23" cy="23" r="21" fill={light} />
                                        <circle cx="23" cy="23" r="21" fill="none" stroke={color} strokeWidth="1.1" strokeOpacity="0.55" />
                                        <circle cx="23" cy="23" r="17.5" fill="none" stroke={color} strokeWidth="0.5" strokeOpacity="0.3" />
                                        {Array.from({ length: 20 }).map((_, i) => {
                                             const rad = ((i * 360) / 20) * (Math.PI / 180);
                                             return (
                                                 <circle key={i} cx={23 + 20 * Math.cos(rad)} cy={23 + 20 * Math.sin(rad)} r="0.8" fill={color} fillOpacity="0.4" />
                                             );
                                        })}
                                        <defs>
                                            <path id={`ta-${index}`} d="M 4,23 A 19,19 0 0,1 42,23" />
                                            <path id={`ba-${index}`} d="M 6,26 A 19,19 0 0,0 40,26" />
                                        </defs>
                                        <text fontSize="4" fill={color} fillOpacity="0.75" fontWeight="700" letterSpacing="1.5">
                                            <textPath href={`#ta-${index}`} startOffset="50%" textAnchor="middle">{tag}</textPath>
                                        </text>
                                        <text fontSize="3.5" fill={color} fillOpacity="0.6" fontWeight="600" letterSpacing="1">
                                            <textPath href={`#ba-${index}`} startOffset="50%" textAnchor="middle">{issueYear}</textPath>
                                        </text>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Icon className="w-3.5 h-3.5" style={{ color, opacity: 0.8 }} />
                                    </div>
                                </div>

                                {/* Visa name + eligibility */}
                                <div className="min-w-0 flex-1">
                                    <p className="text-[13px] font-bold text-gray-900 tracking-tight leading-tight truncate uppercase">
                                        {visaTypeTitle}
                                    </p>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <CheckCircle2 className="w-3 h-3 flex-shrink-0" style={{ color }} />
                                        <span className="text-[9px] font-medium text-gray-500">
                                            Eligible · <span className="font-semibold text-gray-700">{userAuthData?.country || 'Your Country'}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Row 3: Info fields — Equal distance across Holder, Processing, Validity */}
                            <div className="grid grid-cols-3 gap-2 mb-2.5 relative z-10">
                                <div className="min-w-0">
                                    <p className="text-[7.5px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Holder</p>
                                    <p className="text-[10px] font-bold text-gray-800 uppercase truncate" title={userAuthData?.name || 'Traveller'}>
                                        {holderName}
                                    </p>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[7.5px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Processing</p>
                                    <p className="text-[10px] font-bold text-gray-800 truncate" title={processingTime}>
                                        {processingTime}
                                    </p>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[7.5px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Validity</p>
                                    <p className="text-[10px] font-bold text-gray-800 truncate" title={validity}>
                                        {validity}
                                    </p>
                                </div>
                            </div>

                            {/* Row 4: MRZ */}
                            <div className="rounded px-2 py-0.5 mb-2.5 relative z-10" style={{ background: '#f7f7f7' }}>
                                <p className="font-mono text-[5.5px] tracking-[0.05em] text-gray-300 overflow-hidden whitespace-nowrap">
                                    {'V<GGW<<' + (userAuthData?.name || 'HOLDER').replace(/\s+/g, '<').toUpperCase().padEnd(20, '<')}
                                </p>
                            </div>

                            {/* Row 5: Check Process — left aligned, single line */}
                            <div className="flex items-center relative z-10">
                                <div
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 group-hover:opacity-90"
                                    style={{ background: color }}
                                >
                                    <span className="text-[9px] font-bold text-white uppercase tracking-wider whitespace-nowrap">Check Process</span>
                                    <ArrowRight className="w-3 h-3 text-white group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                                </div>
                            </div>
                        </div>

                        {/* ── Vertical dashed divider ── */}
                        <div className="flex-shrink-0 flex items-stretch py-3" style={{ width: 0 }}>
                            <div style={{ width: 0, borderLeft: `2px dashed ${color}30` }} />
                        </div>

                        {/* ════ RIGHT COLORED STUB ════ */}
                        <div
                            className="flex-shrink-0 flex flex-col items-center justify-between py-3 px-3"
                            style={{ width: 82, background: light }}
                        >
                            {/* Category / Fee */}
                            <div className="text-center w-full">
                                <p className="text-[7.5px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                                    {fee ? 'Fee' : 'Category'}
                                </p>
                                <p className="text-[11px] font-bold leading-tight text-center uppercase tracking-wide" style={{ color }}>
                                    {fee ? (String(fee).startsWith('$') ? fee : `$${fee}`) : tag}
                                </p>
                            </div>

                            {/* Barcode stripes */}
                            <div className="flex gap-[2px] items-end my-2">
                                {[6, 10, 4, 14, 6, 8, 12, 5, 10, 7, 4, 11, 6, 9].map((h, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            width: i % 3 === 0 ? 2 : 1,
                                            height: h,
                                            background: color,
                                            opacity: 0.5,
                                            borderRadius: 1,
                                        }}
                                    />
                                ))}
                            </div>
                            <p className="text-[7px] font-semibold tracking-wider text-center" style={{ color: `${color}99` }}>{refNo}</p>
                        </div>

                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

/* ─── Main Component ───────────────────────────────────────────────────── */
const VisaListDropdown = ({ availableVisa = [] }) => {
    const [open, setOpen] = useState(false);
    const { isuserAuth, userAuthData } = useSelector(state => state.checkAuth);
    const { country_id } = useParams();

    const isLoggedInUser = isuserAuth && userAuthData?.role === 'user';

    return (
        <div>
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex justify-between items-center cursor-pointer"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow">
                        <FileText className="w-5 h-5 text-[#e53935]" />
                    </div>
                    <div className="text-left">
                        <span className="text-sm font-medium text-[#6c757d] uppercase tracking-wide block">
                            Available Visa
                        </span>
                        {isLoggedInUser && availableVisa.length > 0 && (
                            <span className="text-[11px] text-[#6c757d]/60">
                                {availableVisa.length} visa {availableVisa.length === 1 ? 'type' : 'types'} available for you
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isLoggedInUser && availableVisa.length > 0 && (
                        <span className="text-[10px] font-black text-white bg-[#e53935] rounded-full w-5 h-5 flex items-center justify-center">
                            {availableVisa.length}
                        </span>
                    )}
                    <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 text-[#6c757d]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </motion.div>
                </div>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-5">
                            {!isLoggedInUser ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-center gap-4 py-4 px-6 rounded-2xl bg-[#FAFAFA] border border-gray-100"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <Lock className="w-4 h-4 text-[#e53935]" />
                                    </div>
                                    <Link to="/authentication" className="flex-1 min-w-0 group cursor-pointer block">
                                        <p className="text-sm font-bold text-[#2c3e50] group-hover:text-[#e53935] transition-colors leading-snug">
                                            <span className="text-[#e53935] underline underline-offset-2">Sign in</span> to discover available visas for you
                                        </p>
                                        <p className="text-[11px] text-[#6c757d]/70 mt-0.5">
                                            Visa options are personalised based on your nationality.
                                        </p>
                                    </Link>
                                </motion.div>

                            ) : availableVisa.length > 0 ? (
                                <div>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-[11px] text-[#6c757d]/60 uppercase tracking-[0.15em] font-semibold mb-4"
                                    >
                                        Showing visas for citizens of{' '}
                                        <span className="text-[#2c3e50]">{userAuthData?.country}</span>
                                    </motion.p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {availableVisa.map((item, index) => (
                                            <VisaCard
                                                key={item?.id}
                                                item={item}
                                                index={index}
                                                encodedCountryId={country_id}
                                                userAuthData={userAuthData}
                                            />
                                        ))}
                                    </div>
                                </div>

                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="w-12 h-12 rounded-2xl bg-[#FAFAFA] border border-gray-100 flex items-center justify-center mb-3">
                                        <Globe className="w-5 h-5 text-[#6c757d]/50" />
                                    </div>
                                    <p className="text-sm font-bold text-[#2c3e50]">No visa currently available</p>
                                    <p className="text-[11px] text-[#6c757d]/60 mt-1">Check back later or contact us for assistance.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VisaListDropdown;