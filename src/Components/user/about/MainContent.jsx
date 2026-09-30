import React from 'react'
import { Box, Typography, Button, Card, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { TrendingUp, Public, Assignment, CheckCircle } from '@mui/icons-material';

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionButton = motion(Button);

const MainContent = ({ setOpenConfirmDialog }) => {

    const handleBookConsultation = () => {
        setOpenConfirmDialog(true);
    };

    return (
        <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#ffffff' }}>
            <Container
                maxWidth="xl"
                sx={{
                    maxWidth: '1400px',
                    px: { xs: 2, sm: 4, md: 6, lg: 10 }
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'stretch',
                        gap: { xs: 4, md: 6, lg: 8 },
                    }}
                >
                    <Box
                        component={motion.div}
                        initial={{ opacity: 0, x: -25 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                        sx={{
                            flex: { xs: '1 1 auto', md: '0 0 48%', lg: '0 0 46%' },
                            width: { xs: '100%', md: 'auto' },
                            position: 'relative',
                            minHeight: { xs: 340, sm: 420, md: '100%' },
                            backgroundColor: '#f1f5f9',
                            borderRadius: 2,
                        }}
                    >
                    <img
                        src="/About-banner4.jpg"
                        alt="Immigration Service"
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                            borderRadius: 16,
                            boxShadow: '0 8px 32px rgba(54, 46, 46, 0.15)',
                        }}
                    />
                    <Box
                        component={motion.div}
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                        sx={{
                            position: 'absolute',
                            bottom: { xs: 12, sm: 20, md: 30 },
                            left: { xs: 12, sm: 20, md: 30 },
                            right: { xs: 12, sm: 'auto' },
                            maxWidth: { xs: 'calc(100% - 24px)', sm: 'none' },
                            zIndex: 2,
                        }}
                    >
                        <Card
                            sx={{
                                bgcolor: 'transparent',
                                px: { xs: 2, md: 3 },
                                py: { xs: 1.5, md: 2 },
                                border: '3px solid #FF5252',
                                boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
                                borderRadius: 2,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2 } }}>
                                <TrendingUp sx={{ fontSize: { xs: 32, md: 40 }, color: '#FF5252' }} />
                                <Box>
                                    <Typography
                                        variant="h4"
                                        color="rgba(255, 254, 254, 1)"
                                        fontWeight="bold"
                                        sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}
                                    >
                                        15+
                                    </Typography>
                                    <Typography variant="body2" color="#FF5252" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                                        Years Experience
                                    </Typography>
                                </Box>
                            </Box>
                        </Card>
                    </Box>
                </Box>

                {/* Right Side */}
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, x: 25 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                    sx={{
                        flex: { xs: '1 1 auto', md: '0 0 48%', lg: '0 0 50%' },
                        width: { xs: '100%', md: 'auto' },
                        minWidth: 0,
                    }}
                >
                    <Typography
                        variant="overline"
                        sx={{
                            color: '#FF5252',
                            fontWeight: 600,
                            letterSpacing: 1.5,
                            fontSize: '0.9rem',
                        }}
                    >
                        / ABOUT OUR COMPANY
                    </Typography>

                    <Typography
                        variant="h2"
                        sx={{
                            color: '#2C3E50',
                            fontWeight: 700,
                            mt: 2,
                            mb: 2.5,
                            lineHeight: 1.2,
                            fontSize: { xs: '1.75rem', sm: '2.1rem', md: '2.25rem', lg: '2.5rem' },
                        }}
                    >
                        Immigration Services From Experienced Professionals
                    </Typography>

                    <Typography
                        variant="h5"
                        sx={{
                            color: '#4A90E2',
                            fontWeight: 600,
                            mb: 4,
                            fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                            lineHeight: 1.35,
                        }}
                    >
                        Global Immigration &amp; International Visa Consultancy
                    </Typography>

                    <Typography variant="body1" sx={{ color: '#666', mb: 4, lineHeight: 1.7 }}>
                        At Global Gateway, we provide comprehensive, accredited immigration services with a
                        personal touch. Our experienced team of international specialists understands that global
                        immigration is not just a process, but a transformative journey toward your future abroad.
                    </Typography>

                    <Box sx={{ display: 'flex', gap: { xs: 2, md: 2.5 }, flexDirection: { xs: 'column', sm: 'row' }, mb: 4 }}>
                        {/* Card 1 — Licensed Global Advisory */}
                        <MotionCard
                            elevation={0}
                            sx={{
                                flex: { xs: '1 1 100%', sm: 1 },
                                minWidth: { xs: 0, sm: 220 },
                                p: { xs: 2.2, md: 2.5 },
                                borderRadius: '16px',
                                background: 'linear-gradient(145deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.72) 100%)',
                                backdropFilter: 'blur(20px) saturate(180%)',
                                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                                border: '1px solid rgba(255,255,255,0.85)',
                                borderTop: '1px solid rgba(255,255,255,1)',
                                boxShadow: '0 6px 24px -4px rgba(15,23,42,0.09), inset 0 1px 2px rgba(255,255,255,0.95)',
                                cursor: 'default',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Box sx={{
                                    width: 46,
                                    height: 46,
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, rgba(254,242,242,0.95) 0%, rgba(254,226,226,0.8) 100%)',
                                    border: '1px solid rgba(239,68,68,0.15)',
                                    boxShadow: '0 4px 12px rgba(239,68,68,0.12), inset 0 1px 2px rgba(255,255,255,0.9)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <Public sx={{ fontSize: 24, color: '#ef4444' }} />
                                </Box>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography sx={{
                                        fontWeight: 700,
                                        fontSize: '0.95rem',
                                        color: '#1e293b',
                                        lineHeight: 1.3,
                                        letterSpacing: '-0.01em',
                                    }}>
                                        Licensed Global Advisory
                                    </Typography>
                                    <Typography sx={{
                                        color: '#64748b',
                                        fontSize: '0.78rem',
                                        mt: 0.4,
                                        lineHeight: 1.4,
                                        fontWeight: 500,
                                    }}>
                                        Regulated immigration specialists
                                    </Typography>
                                </Box>
                            </Box>
                        </MotionCard>

                        {/* Card 2 — Direct Embassy Submissions */}
                        <MotionCard
                            elevation={0}
                            sx={{
                                flex: { xs: '1 1 100%', sm: 1 },
                                minWidth: { xs: 0, sm: 220 },
                                p: { xs: 2.2, md: 2.5 },
                                borderRadius: '16px',
                                background: 'linear-gradient(145deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.72) 100%)',
                                backdropFilter: 'blur(20px) saturate(180%)',
                                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                                border: '1px solid rgba(255,255,255,0.85)',
                                borderTop: '1px solid rgba(255,255,255,1)',
                                boxShadow: '0 6px 24px -4px rgba(15,23,42,0.09), inset 0 1px 2px rgba(255,255,255,0.95)',
                                cursor: 'default',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Box sx={{
                                    width: 46,
                                    height: 46,
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, rgba(254,242,242,0.95) 0%, rgba(254,226,226,0.8) 100%)',
                                    border: '1px solid rgba(239,68,68,0.15)',
                                    boxShadow: '0 4px 12px rgba(239,68,68,0.12), inset 0 1px 2px rgba(255,255,255,0.9)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <Assignment sx={{ fontSize: 24, color: '#ef4444' }} />
                                </Box>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography sx={{
                                        fontWeight: 700,
                                        fontSize: '0.95rem',
                                        color: '#1e293b',
                                        lineHeight: 1.3,
                                        letterSpacing: '-0.01em',
                                    }}>
                                        Direct Embassy Submissions
                                    </Typography>
                                    <Typography sx={{
                                        color: '#64748b',
                                        fontSize: '0.78rem',
                                        mt: 0.4,
                                        lineHeight: 1.4,
                                        fontWeight: 500,
                                    }}>
                                        Verifiable tracking &amp; zero hidden fees
                                    </Typography>
                                </Box>
                            </Box>
                        </MotionCard>
                    </Box>

                    <Box display="flex" alignItems="flex-start" sx={{ mb: 3 }}>
                        <Box
                            sx={{
                                backgroundColor: '#e3f2fd',
                                borderRadius: '50%',
                                p: 1.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 3,
                                flexShrink: 0,
                            }}
                        >
                            <CheckCircle sx={{ color: '#1976d2', fontSize: 32 }} />
                        </Box>
                        <Box>
                            <Typography
                                variant="h6"
                                fontWeight={600}
                                sx={{ mb: 1, color: '#2c3e50', fontSize: { xs: '1.1rem', md: '1.25rem' } }}
                            >
                                Genuine Embassy Filings &amp; Real-Time Tracking
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: '#6c757d',
                                    lineHeight: 1.6,
                                    fontSize: '15px',
                                }}
                            >
                                We lodge every application directly through official consular and governmental portals with authentic reference numbers—protecting international applicants from unauthorized agents, falsified paperwork, or immigration penalties.
                            </Typography>
                        </Box>
                    </Box>

                    <Box display="flex" alignItems="flex-start" sx={{ mb: 4 }}>
                        <Box
                            sx={{
                                backgroundColor: '#fef2f2',
                                borderRadius: '50%',
                                p: 1.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 3,
                                flexShrink: 0,
                            }}
                        >
                            <TrendingUp sx={{ color: '#FF5252', fontSize: 32 }} />
                        </Box>
                        <Box>
                            <Typography
                                variant="h6"
                                fontWeight={600}
                                sx={{ mb: 1, color: '#2c3e50', fontSize: { xs: '1.1rem', md: '1.25rem' } }}
                            >
                                Transparent SLA &amp; Anti-Fraud Guarantee
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: '#6c757d',
                                    lineHeight: 1.6,
                                    fontSize: '15px',
                                }}
                            >
                                All processing milestones, official embassy fees, and service scopes are documented in a legally binding client agreement prior to intake, ensuring complete financial safety and zero hidden charges.
                            </Typography>
                        </Box>
                    </Box>


                </Box>
            </Box>
        </Container>
    </Box>
    )
}

export default MainContent