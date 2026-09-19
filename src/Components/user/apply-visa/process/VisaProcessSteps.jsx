import React from 'react';
import VisaProcessCard from './VisaProcessCard';

const VisaProcessSteps = () => {
    const steps = [
        {
            id: '01',
            title: 'Complete Online Form',
            description: 'Fill in your personal, passport and visa details through our secure step-by-step online application form.',
            image: '/Process1.jpg',
            delay: 0.1
        },
        {
            id: '02',
            title: 'Documents & Payments',
            description: 'Upload the required supporting documents and complete your application fee payment through our secure gateway.',
            image: '/Process2.jpg',
            delay: 0.2
        },
        {
            id: '03',
            title: 'Receive Your Visa',
            description: 'Once approved by the embassy, your visa decision is notified instantly and your visa is delivered to you.',
            image: '/Process3.jpg',
            delay: 0.3
        }
    ];

    return (
        <div className="relative w-full max-w-5xl mx-auto">
            {/* Dashed connector line through centers of the circles on md+ screens */}
            <div
                className="hidden md:block absolute top-14 lg:top-16 left-[16.67%] right-[16.67%] -translate-y-1/2 z-0 pointer-events-none"
                aria-hidden="true"
            >
                <svg className="w-full h-1 overflow-visible" preserveAspectRatio="none">
                    <line
                        x1="0"
                        y1="0"
                        x2="100%"
                        y2="0"
                        stroke="#cbd5e1"
                        strokeWidth="2.5"
                        strokeDasharray="8 6"
                    />
                </svg>
            </div>

            {/* Grid of 3 step cards with equal heights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative z-10 items-stretch">
                {steps.map((step) => (
                    <VisaProcessCard
                        key={step.id}
                        id={step.id}
                        title={step.title}
                        description={step.description}
                        image={step.image}
                        delay={step.delay}
                    />
                ))}
            </div>
        </div>
    );
};

export default VisaProcessSteps;