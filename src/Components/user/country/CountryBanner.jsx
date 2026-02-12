import React from 'react'
import { Box, Breadcrumbs, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const CountryBanner = () => {
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
                    Countries to Immigrate
                </Typography>
                <Breadcrumbs sx={{ color: '#FF5252', mt: 1 }} separator="›">
                    <Link underline="hover" to="/" sx={{ color: '#FF5252', '&:hover': { color: '#fff' } }}>
                        Home
                    </Link>
                    <Typography sx={{ color: '#FF5252' }}>Countries</Typography>
                </Breadcrumbs>
            </Box>
        </Box>
    )
}

export default CountryBanner