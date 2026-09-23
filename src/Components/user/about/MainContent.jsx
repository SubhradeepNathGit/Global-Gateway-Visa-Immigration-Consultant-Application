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
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, sm: 3, md: 3 } }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: { xs: 4, md: 6 },
                }}
            >
                <Box flex={1} sx={{ position: 'relative', minHeight: { xs: 280, sm: 360, md: 500 } }}>
                    <img
                        src="/About2.jpg"
                        alt="Immigration Service"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: 16,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                        }}
                    />
                    <Box
                        component={motion.div}
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                        sx={{
                            position: 'absolute',
                            bottom: { xs: 12, sm: 20, md: 30 },
                            left: { xs: 12, sm: 20, md: 30 },
                            right: { xs: 12, sm: 'auto' },
                            maxWidth: { xs: 'calc(100% - 24px)', sm: 'none' },
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
                <Box flex={1}>
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
                            mb: 3,
                            lineHeight: 1.2,
                            fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
                        }}
                    >
                        Immigration Services From{' '}
                        <Box component="span" sx={{ display: 'block' }}>
                            Experienced Professionals
                        </Box>
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
                        India Based Immigration Consultant Agency
                    </Typography>

                    <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
                        At Global Gateway, we provide comprehensive immigration services with a
                        personal touch. Our experienced team understands that immigration is not
                        just a process, but a life-changing journey
                    </Typography>

                    <Box sx={{ display: 'flex', gap: { xs: 2, md: 3 }, flexDirection: { xs: 'column', sm: 'row' }, flexWrap: 'wrap', mb: 4 }}>
                        <MotionCard
                            whileHover={{ y: -5 }}
                            sx={{
                                p: { xs: 2, md: 3 },
                                flex: { xs: '1 1 100%', sm: 1 },
                                minWidth: { xs: 0, sm: 240 },
                                border: '1px solid #eee',
                                borderRadius: 2,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            }}
                        >
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Public sx={{ fontSize: 40, color: '#FF5252' }} />
                                <Typography fontWeight={600}>
                                    Best Immigration Resources
                                </Typography>
                            </Box>
                        </MotionCard>

                        <MotionCard
                            whileHover={{ y: -5 }}
                            sx={{
                                p: { xs: 2, md: 3 },
                                flex: { xs: '1 1 100%', sm: 1 },
                                minWidth: { xs: 0, sm: 240 },
                                border: '1px solid #eee',
                                borderRadius: 2,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            }}
                        >
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Assignment sx={{ fontSize: 40, color: '#FF5252' }} />
                                <Typography fontWeight={600}>
                                    Return Visas Available
                                </Typography>
                            </Box>
                        </MotionCard>
                    </Box>

                    <Box display="flex" alignItems="flex-start" sx={{ mb: 4 }}>
                        <Box
                            sx={{
                                backgroundColor: '#e3f2fd',
                                borderRadius: '50%',
                                p: 1.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 3,
                            }}
                        >
                            <CheckCircle sx={{ color: '#1976d2', fontSize: 32 }} />
                        </Box>
                        <Box>
                            <Typography
                                variant="h6"
                                fontWeight={600}
                                sx={{ mb: 1.5, color: '#2c3e50', fontSize: { xs: '1.1rem', md: '1.3rem' } }}
                            >
                                The Best Visa Services
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: '#6c757d',
                                    lineHeight: 1.6,
                                    fontSize: '15px',
                                }}
                            >
                                There are many variations of passages of Lorem Ipsum available,
                                but the majority have suffered.
                            </Typography>
                        </Box>
                    </Box>

                    {/* CTA Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <MotionButton
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleBookConsultation}
                            sx={{
                                bgcolor: '#FF5252',
                                color: '#fff',
                                px: 4,
                                py: 1.5,
                                fontWeight: 600,
                                borderRadius: 2,
                                textTransform: 'uppercase',
                                '&:hover': {
                                    bgcolor: '#E53935',
                                },
                            }}
                        >
                            Book a Consultation
                        </MotionButton>
                    </Box>
                </Box>
            </Box>
        </Container>
    )
}

export default MainContent