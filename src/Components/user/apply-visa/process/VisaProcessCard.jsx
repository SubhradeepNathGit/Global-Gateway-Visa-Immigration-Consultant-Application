import React from 'react'
import { Box, Typography, Card, CardContent, Avatar } from '@mui/material';
import { motion as Motion } from 'framer-motion';

const VisaProcessCard = ({ id, title, description, image, delay }) => {

    const stepVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: 'easeOut'
            }
        }
    };

    return (
        <Motion.div
            key={id}
            variants={stepVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: delay }}

        >
            <Box textAlign="center">
                <Box position="relative" display="inline-block" mb={4}>
                    <Box
                        sx={{
                            width: 200,
                            height: 200,
                            borderRadius: '50%',
                            overflow: 'hidden',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                            position: 'relative',
                            border: '4px solid white'
                        }}
                    >
                        <img
                            src={image}
                            alt={title}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'center'
                            }}
                        />
                    </Box>

                    <Avatar
                        sx={{
                            width: 60,
                            height: 60,
                            backgroundColor: '#dc2626',
                            color: 'white',
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            position: 'absolute',
                            bottom: 10,
                            right: 10,
                            border: '4px solid white',
                            boxShadow: '0 8px 20px rgba(220, 38, 38, 0.4)',
                            zIndex: 2
                        }}
                    >
                        {id}
                    </Avatar>
                </Box>

                <Card
                    elevation={0}
                    sx={{
                        backgroundColor: '#f1f5f9',
                        borderRadius: '16px',
                        boxShadow: 'none',
                        border: 'none',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            backgroundColor: '#e2e8f0',
                            transform: 'translateY(-2px)'
                        }
                    }}
                >
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontSize: { xs: '1.25rem', md: '1.5rem' },
                                fontWeight: 700,
                                color: '#1e293b',
                                mb: 2,
                                lineHeight: 1.3
                            }}
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                color: '#64748b',
                                fontSize: { xs: '0.95rem', md: '1rem' },
                                lineHeight: 1.6
                            }}
                        >
                            {description}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </Motion.div>
    )
}

export default VisaProcessCard