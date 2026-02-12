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
        <Container maxWidth="xl" sx={{ py: 10 }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 6,
                }}
            >
                <Box flex={1} sx={{ position: 'relative', minHeight: 500 }}>
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
                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ position: 'absolute', bottom: 30, left: 30 }}
                    >
                        <Card
                            sx={{
                                bgcolor: 'transparent',
                                px: 3,
                                py: 2,
                                border: '3px solid #FF5252',
                                boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
                                borderRadius: 2,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <TrendingUp sx={{ fontSize: 40, color: '#FF5252' }} />
                                <Box>
                                    <Typography variant="h4" color="rgba(255, 254, 254, 1)" fontWeight="bold">
                                        15+
                                    </Typography>
                                    <Typography variant="body2" color="#FF5252">
                                        Years Experience
                                    </Typography>
                                </Box>
                            </Box>
                        </Card>
                    </motion.div>
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
                        }}
                    >
                        India Based Immigration Consultant Agency
                    </Typography>

                    <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
                        At Global Gateway, we provide comprehensive immigration services with a
                        personal touch. Our experienced team understands that immigration is not
                        just a process, but a life-changing journey
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 4 }}>
                        <MotionCard
                            whileHover={{ y: -5 }}
                            sx={{
                                p: 3,
                                flex: 1,
                                minWidth: 240,
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
                                p: 3,
                                flex: 1,
                                minWidth: 240,
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
                                sx={{ mb: 1.5, color: '#2c3e50', fontSize: '1.3rem' }}
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