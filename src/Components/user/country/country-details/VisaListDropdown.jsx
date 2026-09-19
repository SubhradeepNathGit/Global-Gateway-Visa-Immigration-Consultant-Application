import React, { useState } from 'react';
import {
    FileText, LogIn, Lock, GraduationCap, Plane, Briefcase,
    Building2, HeartPulse, Users, Shuffle, FlaskConical,
    Globe, ArrowRight, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

/* ─── Visa type → icon mapping (no colors) ────────────────────────────── */
const getVisaIcon = (visaType = '') => {
    const type = visaType.toLowerCase();
    if (type.includes('student') || type.includes('education') || type.includes('study'))
        return { icon: GraduationCap, tag: 'Education' };
    if (type.includes('tourist') || type.includes('travel') || type.includes('visit'))
        return { icon: Plane, tag: 'Tourism' };
    if (type.includes('work') || type.includes('employ') || type.includes('labor'))
        return { icon: Briefcase, tag: 'Employment' };
    if (type.includes('business') || type.includes('investor') || type.includes('commerce'))
        return { icon: Building2, tag: 'Business' };
    if (type.includes('medical') || type.includes('health') || type.includes('treatment'))
        return { icon: HeartPulse, tag: 'Medical' };
    if (type.includes('family') || type.includes('spouse') || type.includes('dependent'))
        return { icon: Users, tag: 'Family' };
    if (type.includes('transit') || type.includes('transfer'))
        return { icon: Shuffle, tag: 'Transit' };
    if (type.includes('research') || type.includes('science') || type.includes('fellowship'))
        return { icon: FlaskConical, tag: 'Research' };
    return { icon: Globe, tag: 'General' };
};

/* ─── Single Visa Card ─────────────────────────────────────────────────── */
const VisaCard = ({ item, index, encodedCountryId }) => {
    const { icon: Icon, tag } = getVisaIcon(item?.visa?.visa_type);
    const applyLink = encodedCountryId ? `/visaprocess/${encodedCountryId}` : '#';

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className="group bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_30px_-8px_rgba(0,0,0,0.08)] transition-all duration-300"
        >
            {/* Icon + tag row */}
            <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#FAFAFA] border border-gray-50 flex items-center justify-center group-hover:bg-[#e53935] transition-all duration-400 shadow-sm">
                    <Icon className="w-5 h-5 text-[#6c757d]/70 group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-[9px] font-black text-[#6c757d] uppercase tracking-[0.2em] opacity-60 pt-1">
                    {tag}
                </span>
            </div>

            {/* Visa name + eligibility */}
            <div>
                <p className="font-bold text-[#2c3e50] text-[15px] leading-snug tracking-tight">
                    {item?.visa?.visa_type}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                    <CheckCircle2 className="w-3 h-3 text-[#e53935] flex-shrink-0" />
                    <span className="text-[11px] text-[#6c757d]/80">Eligible for your nationality</span>
                </div>
            </div>

            {/* CTA */}
            <Link
                to={applyLink}
                className="flex items-center justify-between gap-2 text-xs font-bold text-white bg-[#e53935] hover:bg-[#c62828] transition-colors duration-200 px-4 py-2.5 rounded-xl mt-auto"
            >
                <span>Check Process</span>
                <ArrowRight className="w-3.5 h-3.5" />
            </Link>
        </motion.div>
    );
};

/* ─── Main Component ───────────────────────────────────────────────────── */
const VisaListDropdown = ({ availableVisa = [] }) => {
    const [open, setOpen] = useState(false);
    const { isuserAuth, userAuthData } = useSelector(state => state.checkAuth);
    const { country_id } = useParams();   // already encoded — pass as-is for links

    const isLoggedInUser = isuserAuth && userAuthData?.role === 'user';

    return (
        <div>
            {/* ── Header toggle ── */}
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

            {/* ── Expandable content ── */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-6">
                            {!isLoggedInUser ? (
                                /* ── Sign-in prompt ── */
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-center gap-4 py-4 px-6 rounded-2xl bg-[#FAFAFA] border border-gray-100"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <Lock className="w-4 h-4 text-[#e53935]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-[#2c3e50] leading-snug">
                                            Sign in to discover available visas for you
                                        </p>
                                        <p className="text-[11px] text-[#6c757d]/70 mt-0.5">
                                            Visa options are personalised based on your nationality.
                                        </p>
                                    </div>
                                    <Link
                                        to="/authentication"
                                        className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#e53935] hover:bg-[#c62828] transition-colors px-4 py-2 rounded-xl whitespace-nowrap flex-shrink-0"
                                    >
                                        <LogIn className="w-3.5 h-3.5" />
                                        Sign In
                                    </Link>
                                </motion.div>

                            ) : availableVisa.length > 0 ? (
                                /* ── Visa cards ── */
                                <div>
                                    {/* Personalised note */}
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
                                            />
                                        ))}
                                    </div>
                                </div>

                            ) : (
                                /* ── No visa state ── */
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