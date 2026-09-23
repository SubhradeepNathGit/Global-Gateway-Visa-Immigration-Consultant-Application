import React from 'react';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import {
    pageBannerOuterSx,
    pageBannerOverlaySx,
    pageBannerInnerSx,
    pageBannerTitleSx,
} from '../../../../util/pageBannerStyles';

const ProcessBanner = () => {
    return (
        <Box sx={pageBannerOuterSx}>
            <Box sx={pageBannerOverlaySx} />
            <Box sx={pageBannerInnerSx}>
                <Typography variant="h3" sx={pageBannerTitleSx}>
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