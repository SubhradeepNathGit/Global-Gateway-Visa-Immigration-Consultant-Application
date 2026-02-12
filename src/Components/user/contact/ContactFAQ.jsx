import React, { useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import DescriptionIcon from '@mui/icons-material/Description';
import { Accordion, AccordionDetails, AccordionSummary, Box, Container, Paper, Typography } from '@mui/material';

const ContactFAQ = ({ faqs }) => {
    const [expanded, setExpanded] = useState('panel0');

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <Box sx={{ bgcolor: '#ffffff', py: { xs: 6, md: 10 } }}>
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
                        flexDirection: { xs: 'column', lg: 'row' },
                        gap: { xs: 4, md: 6, lg: 8 },
                        alignItems: 'stretch'
                    }}
                >
                    {/* Left Side - FAQ */}
                    <Box
                        sx={{
                            flex: '0 0 50%',
                            minWidth: 0,
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 'bold',
                                fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem', lg: '2.5rem' },
                                lineHeight: 1.2,
                                color: '#2c3e50',
                                mb: { xs: 2, md: 3 }
                            }}
                        >
                            Frequently Asked Questions
                        </Typography>

                        <Typography
                            sx={{
                                color: '#6c757d',
                                fontSize: { xs: '0.9rem', md: '1rem' },
                                lineHeight: 1.6,
                                mb: { xs: 3, md: 4 }
                            }}
                        >
                            Sed rhoncus facilisis purus, at accumsan purus sagittis vitae. Nullam acelit at eros.
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {faqs.map((faq, index) => (
                                <Accordion
                                    key={index}
                                    expanded={expanded === `panel${index}`}
                                    onChange={handleChange(`panel${index}`)}
                                    sx={{
                                        boxShadow: 'none',
                                        bgcolor: expanded === `panel${index}` ? 'white' : '#f8f9fa',
                                        borderRadius: '8px !important',
                                        border: '1px solid #e9ecef',
                                        '&:before': { display: 'none' },
                                        '&.Mui-expanded': {
                                            margin: '0 0 16px 0',
                                        }
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={
                                            expanded === `panel${index}` ? (
                                                <ExpandMoreIcon sx={{ color: '#ef4444', fontSize: { xs: 24, md: 28 } }} />
                                            ) : (
                                                <KeyboardArrowRightIcon sx={{ color: '#6c757d', fontSize: { xs: 24, md: 28 } }} />
                                            )
                                        }
                                        sx={{
                                            py: { xs: 1.5, md: 2 },
                                            px: { xs: 2, md: 3 },
                                            minHeight: { xs: '60px', md: '70px' },
                                            '& .MuiAccordionSummary-content': {
                                                alignItems: 'center',
                                            }
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: { xs: '1rem', md: '1.1rem' },
                                                color: '#2c3e50',
                                                pr: 1
                                            }}
                                        >
                                            {faq.question}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ px: { xs: 2, md: 3 }, pb: { xs: 2, md: 3 } }}>
                                        <Typography
                                            sx={{
                                                color: '#6c757d',
                                                fontSize: { xs: '0.9rem', md: '0.95rem' },
                                                lineHeight: 1.6
                                            }}
                                        >
                                            {faq.answer}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Box>
                    </Box>

                    {/* Right Side - Cards */}
                    <Box
                        sx={{
                            flex: '0 0 45%',
                            minWidth: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: { xs: 3, md: 4 }
                        }}
                    >
                        {/* Blue Banner */}
                        <Paper
                            elevation={0}
                            sx={{
                                bgcolor: 'rgba(50, 132, 209, 1)',
                                borderRadius: '12px',
                                p: { xs: 3, md: 4 },
                                color: 'white',
                                position: 'relative',
                                overflow: 'hidden',
                                minHeight: { xs: '160px', md: '200px' },
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: { xs: 15, md: 20 },
                                    left: { xs: 20, md: 30 },
                                    opacity: 0.3
                                }}
                            >
                                <DescriptionIcon sx={{ fontSize: { xs: '2.5rem', md: '3rem' } }} />
                            </Box>

                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 'bold',
                                    fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem', lg: '1.8rem' },
                                    lineHeight: 1.3,
                                    position: 'relative',
                                    zIndex: 1
                                }}
                            >
                                Have 30+ Years Immigration Experience for Give you Visa Approval
                            </Typography>
                        </Paper>

                        {/* Image with Text Overlay */}
                        <Box
                            sx={{
                                position: 'relative',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                height: { xs: '250px', md: '300px' }
                            }}
                        >
                            <Box
                                component="img"
                                src="/Faq2.jpg"
                                alt="Immigration Consultant Agency"
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />

                            <Paper
                                elevation={0}
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(10px)',
                                    p: { xs: 2.5, md: 3 }
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: '#2c3e50',
                                        fontSize: { xs: '1.1rem', md: '1.3rem', lg: '1.4rem' },
                                        lineHeight: 1.3
                                    }}
                                >
                                    Global Gateway - Visa Consultant Agency
                                </Typography>
                            </Paper>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    )
}

export default ContactFAQ