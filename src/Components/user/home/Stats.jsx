import React, { useState, useEffect } from 'react';
import { Box, Typography, Container } from '@mui/material';
import { motion, useAnimation, useInView } from 'framer-motion';

// Custom hook for animated counter
const useAnimatedCounter = (end, duration = 2000, shouldStart = false) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!shouldStart) return;
    
    let startTime;
    let animationFrame;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, shouldStart]);
  
  return count;
};

// Individual stat item component
const StatItem = ({ icon, number, label, delay = 0 }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });
  const animatedNumber = useAnimatedCounter(number, 2000, isInView);
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Icon Circle */}
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              '& svg': {
                width: '100%',
                height: '100%',
                color: '#e53e3e', // Red color for icons
              }
            }}
            dangerouslySetInnerHTML={{ __html: icon }}
          />
        </Box>
        
        {/* Number */}
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            fontWeight: 700,
            color: '#2d3748',
            mb: 1,
            lineHeight: 1,
          }}
        >
          {animatedNumber}
        </Typography>
        
        {/* Label */}
        <Typography
          variant="h6"
          sx={{
            fontSize: '1.1rem',
            color: '#718096',
            fontWeight: 500,
          }}
        >
          {label}
        </Typography>
      </Box>
    </motion.div>
  );
};

const StatsSection = () => {
  const stats = [
    {
      icon: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'>
        <path stroke-linecap='round' stroke-linejoin='round' d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'/>
        <circle cx="12" cy="8" r="2"/>
      </svg>`,
      number: 1080,
      label: "Visa Categories"
    },
    {
      icon: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'>
        <path stroke-linecap='round' stroke-linejoin='round' d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'/>
      </svg>`,
      number: 970,
      label: "Team Members"
    },
    {
      icon: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'>
        <path stroke-linecap='round' stroke-linejoin='round' d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'/>
        <path stroke-linecap='round' stroke-linejoin='round' d='M12 6v6l4 2'/>
      </svg>`,
      number: 125,
      label: "Visa Process"
    },
    {
      icon: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2'>
        <path stroke-linecap='round' stroke-linejoin='round' d='M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11'/>
      </svg>`,
      number: 98,
      label: "Success Rates"
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '200px',
        backgroundImage: 'url(/Bagroundimg.png)', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative',
        py: 8,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)'
            },
            gap: { xs: 4, md: 6 },
            alignItems: 'center',
            justifyItems: 'center',
          }}
        >
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              icon={stat.icon}
              number={stat.number}
              label={stat.label}
              delay={index * 0.2}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default StatsSection;