import React from 'react';
import { Box, Typography, Breadcrumbs } from '@mui/material';
import { Link } from 'react-router-dom';
import {
    pageBannerOuterSx,
    pageBannerOverlaySx,
    pageBannerInnerSx,
    pageBannerTitleSx,
} from '../../../util/pageBannerStyles';

const CourseBanner = () => {
    return (
        <Box sx={pageBannerOuterSx}>
            <Box sx={pageBannerOverlaySx} />
            <Box sx={pageBannerInnerSx}>
                <Typography variant="h3" sx={pageBannerTitleSx}>
                    Courses
                </Typography>
                <Breadcrumbs sx={{ color: 'red', mt: 1 }} separator="›">
                    <Link underline="hover" to="/" sx={{ color: 'red' }} className='cursor-pointer'>
                        Home
                    </Link>
                    <Typography sx={{ color: 'red' }}>Courses</Typography>
                </Breadcrumbs>
            </Box>
        </Box>
    );
};

export default CourseBanner;