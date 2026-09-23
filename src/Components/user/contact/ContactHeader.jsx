import React from 'react';
import { Box, Typography, Breadcrumbs } from '@mui/material';
import { Link } from 'react-router-dom';
import {
    pageBannerOuterSx,
    pageBannerOverlaySx,
    pageBannerInnerSx,
    pageBannerTitleSx,
} from '../../../util/pageBannerStyles';

const ContactHeader = () => {
    return (
        <Box sx={pageBannerOuterSx}>
            <Box sx={pageBannerOverlaySx} />
            <Box sx={pageBannerInnerSx}>
                <Typography variant="h3" sx={pageBannerTitleSx}>
                    Get in Touch
                </Typography>
                <Breadcrumbs sx={{ color: 'red', mt: 1 }} separator="›">
                    <Link underline="hover" to="/" sx={{ color: 'red' }} className='cursor-pointer'>
                        Home
                    </Link>
                    <Typography sx={{ color: 'red' }}>Get in Touch</Typography>
                </Breadcrumbs>
            </Box>
        </Box>
    );
};

export default ContactHeader;