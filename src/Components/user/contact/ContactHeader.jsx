import React from 'react'
import { Box, Breadcrumbs, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const ContactHeader = () => {
    return (
        <Box
            sx={{
                height: { xs: '250px', md: '300px' },
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
                    px: { xs: 2, sm: 4, md: 6, lg: 10 },
                    maxWidth: '1400px',
                    mx: 'auto',
                }}
            >
                <Typography
                    variant="h3"
                    fontWeight="bold"
                    sx={{
                        fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem', lg: '3rem' }
                    }}
                >
                    Contact Us
                </Typography>
                <Breadcrumbs sx={{ color: '#FF5252', mt: 1 }} separator="›">
                    <Link
                        underline="hover"
                        to="/"
                        sx={{
                            color: '#FF5252',
                            '&:hover': { color: '#fff' },
                            fontSize: { xs: '0.9rem', md: '1rem' }
                        }}
                    >
                        Home
                    </Link>
                    <Typography
                        sx={{
                            color: '#FF5252',
                            fontSize: { xs: '0.9rem', md: '1rem' }
                        }}
                    >
                        Contact
                    </Typography>
                </Breadcrumbs>
            </Box>
        </Box>
    )
}

export default ContactHeader