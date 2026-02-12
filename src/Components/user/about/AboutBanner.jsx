import React from 'react';
import { Box, Typography, Breadcrumbs } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AboutBanner = () => {
    return (
        <Box
            sx={{
                height: '300px',
                backgroundImage: 'url(/PageBanner.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                color: '#fff',
                position: 'relative',
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                }}
            />
            <Box
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    width: '100%',
                    px: { xs: 2, md: 10 },
                }}
            >
                <Typography variant="h3" fontWeight="bold">
                    About
                </Typography>
                <Breadcrumbs sx={{ color: 'red', mt: 1 }} separator="›">
                    <Link underline="hover" to="/" sx={{ color: 'red' }} className='cursor-pointer'>
                        Home
                    </Link>
                    <Typography sx={{ color: 'red' }}>About</Typography>
                </Breadcrumbs>
            </Box>
        </Box>
    )
}

export default AboutBanner