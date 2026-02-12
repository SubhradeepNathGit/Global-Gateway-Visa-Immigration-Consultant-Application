import React from 'react'
import { Box } from '@mui/material';
import VisaProcessCard from './VisaProcessCard';

const VisaProcessSteps = () => {

    const steps = [
        {
            id: '01',
            title: 'Complete Online Form',
            description: 'Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet.',
            image: '/Process1.jpg',
            delay: 0.2
        },
        {
            id: '02',
            title: 'Documents & Payments',
            description: 'Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet.',
            image: '/Process2.jpg',
            delay: 0.4
        },
        {
            id: '03',
            title: 'Receive Your Visa',
            description: 'Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet.',
            image: '/Process3.jpg',
            delay: 0.6
        }
    ];

    return (
        <Box
            display="grid"
            gridTemplateColumns={{ xs: '1fr', lg: 'repeat(3, 1fr)' }}
            gap={{ xs: 6, md: 4 }}
            position="relative"
            zIndex={1}
        >
            {steps.map((step) => (
                <VisaProcessCard key={step.id} id={step.id} title={step.title} description={step.description} image={step.image} delay={step.delay} />
            ))}
        </Box>
    )
}

export default VisaProcessSteps