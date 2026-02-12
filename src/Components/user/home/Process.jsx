import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent,
  Avatar
} from '@mui/material';
import { motion } from 'framer-motion';

const VisaProcessSection = () => {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: '#f8f9fa',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Header Section */}
          <Box textAlign="center" mb={{ xs: 6, md: 10 }}>
            <motion.div variants={itemVariants}>
              <Typography
                sx={{
                  color: '#9ca3af',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  fontSize: '0.875rem',
                  mb: 2,
                  display: 'block',
                  textTransform: 'uppercase'
                }}
              >
                / OUR WORK PROCESS
              </Typography>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.75rem', lg: '4.5rem' },
                  fontWeight: 700,
                  color: '#1e293b',
                  lineHeight: 1.1,
                  maxWidth: '900px',
                  mx: 'auto'
                }}
              >
                Get your Visa Approved in{' '}
                <Box component="span" sx={{ display: 'block' }}>
                  3 Simple Steps
                </Box>
              </Typography>
            </motion.div>
          </Box>

          {/* Steps Section */}
          <Box position="relative" mt={{ xs: 8, md: 12 }}>
            {/* Connection Lines - Dotted lines between circles */}
            <Box
              sx={{
                position: 'absolute',
                top: '100px', // Adjust based on circle position
                left: '20%',
                right: '20%',
                height: '2px',
                background: `repeating-linear-gradient(
                  90deg,
                  #cbd5e0 0px,
                  #cbd5e0 6px,
                  transparent 6px,
                  transparent 14px
                )`,
                zIndex: 0,
                display: { xs: 'none', lg: 'block' }
              }}
            />

            {/* Steps Grid */}
            <Box
              display="grid"
              gridTemplateColumns={{ xs: '1fr', lg: 'repeat(3, 1fr)' }}
              gap={{ xs: 6, md: 4 }}
              position="relative"
              zIndex={1}
            >
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  variants={stepVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: step.delay }}
                  whileHover={{ 
                  
                    transition: { duration: 0.3 }
                  }}
                >
                  <Box textAlign="center">
                    {/* Step Image with Number */}
                    <Box position="relative" display="inline-block" mb={4}>
                      {/* Main Image Circle with actual photo */}
                      <Box
                        sx={{
                          width: 200,
                          height: 200,
                          borderRadius: '50%',
                          overflow: 'hidden',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                          position: 'relative',
                          border: '4px solid white'
                        }}
                      >
                        <img
                          src={step.image}
                          alt={step.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center'
                          }}
                        />
                      </Box>

                      {/* Step Number Badge */}
                      <Avatar
                        sx={{
                          width: 60,
                          height: 60,
                          backgroundColor: '#dc2626',
                          color: 'white',
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          position: 'absolute',
                          bottom: 10,
                          right: 10,
                          border: '4px solid white',
                          boxShadow: '0 8px 20px rgba(220, 38, 38, 0.4)',
                          zIndex: 2
                        }}
                      >
                        {step.id}
                      </Avatar>
                    </Box>

                    {/* Step Content Card */}
                    <Card
                      elevation={0}
                      sx={{
                        backgroundColor: '#f1f5f9',
                        borderRadius: '16px',
                        boxShadow: 'none',
                        border: 'none',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#e2e8f0',
                          
                        }
                      }}
                    >
                      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontSize: { xs: '1.25rem', md: '1.5rem' },
                            fontWeight: 700,
                            color: '#1e293b',
                            mb: 2,
                            lineHeight: 1.3
                          }}
                        >
                          {step.title}
                        </Typography>
                        
                        <Typography
                          variant="body1"
                          sx={{
                            color: '#64748b',
                            fontSize: { xs: '0.95rem', md: '1rem' },
                            lineHeight: 1.6
                          }}
                        >
                          {step.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default VisaProcessSection;