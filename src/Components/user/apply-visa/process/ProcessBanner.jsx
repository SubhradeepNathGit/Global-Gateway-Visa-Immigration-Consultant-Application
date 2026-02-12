import React from 'react';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';

const ProcessBanner = () => {
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
                    Visa Process
                </Typography>
                <Breadcrumbs sx={{ color: 'red', mt: 1 }} separator="›">
                    <Link underline="hover" to="/" sx={{ color: 'red' }}>
                        Home
                    </Link>
                    <Typography sx={{ color: 'red' }}>Visa Process</Typography>
                </Breadcrumbs>
            </Box>
        </Box>
    )
}

export default ProcessBanner