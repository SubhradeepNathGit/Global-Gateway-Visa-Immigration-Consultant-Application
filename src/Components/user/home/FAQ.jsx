import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Paper
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import DescriptionIcon from '@mui/icons-material/Description';

const faqs = [
  {
    question: "How to get free immigration?",
    answer: "Sed rhoncus facilisis purus, at accumsan purus sagittis vitae. Nullam acelit at eros imperdiet. Pellentesque sit."
  },
  {
    question: "Which country is good for residents?",
    answer: "Canada, Australia, and New Zealand are popular destinations for permanent residency due to their immigration-friendly policies, quality of life, and opportunities for skilled workers."
  },
  {
    question: "Canada study visa requirements?",
    answer: "To obtain a Canadian study visa, you need an acceptance letter from a designated learning institution, proof of financial support, no criminal record, and may need to complete a medical exam."
  }
];

const FAQSection = () => {
  const [expanded, setExpanded] = useState('panel0');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', py: 6 }}>
      <Container maxWidth="lg">
        {/* Flex layout for left and right side */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            alignItems: 'stretch'
          }}
        >
          {/* Left Side */}
          <Box flex={1} minWidth={0}>
            <Typography
              variant="body2"
              sx={{
                color: '#ef4444',
                fontWeight: 600,
                fontSize: '14px',
                mb: 2,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              / OUR FAQS
            </Typography>

            <Typography
              variant="h2"
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '2rem', lg: '2.5rem' },
                lineHeight: 1.2,
                color: '#2c3e50',
                mb: 3
              }}
            >
              Frequently Asked Questions
            </Typography>

            <Typography
              sx={{
                color: '#6c757d',
                fontSize: '1rem',
                lineHeight: 1.6,
                mb: 4
              }}
            >
              Sed rhoncus facilisis purus, at accumsan purus sagittis vitae. Nullam acelit at eros.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {faqs.map((faq, index) => (
                <Accordion
                  key={index}
                  expanded={expanded === `panel${index}`}
                  onChange={handleChange(`panel${index}`)}
                  sx={{
                    boxShadow: 'none',
                    bgcolor: expanded === `panel${index}` ? 'white' : '#f1f3f4',
                    borderRadius: '8px !important',
                    '&:before': { display: 'none' },
                    '&.Mui-expanded': {
                      margin: '0 0 16px 0',
                    }
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      expanded === `panel${index}` ? (
                        <ExpandMoreIcon sx={{ color: '#ef4444', fontSize: 28 }} />
                      ) : (
                        <KeyboardArrowRightIcon sx={{ color: '#6c757d', fontSize: 28 }} />
                      )
                    }
                    sx={{
                      py: 2,
                      px: 3,
                      minHeight: '70px',
                      '& .MuiAccordionSummary-content': {
                        alignItems: 'center',
                      }
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        color: '#2c3e50'
                      }}
                    >
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 3, pb: 3 }}>
                    <Typography
                      sx={{
                        color: '#6c757d',
                        fontSize: '0.95rem',
                        lineHeight: 1.6
                      }}
                    >
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Box>

          {/* Right Side */}
          <Box flex={1} minWidth={0} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Red Banner */}
            <Paper
              elevation={0}
              sx={{
                bgcolor: '#ef4444',
                borderRadius: '12px',
                p: 4,
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 20,
                  left: 30,
                  opacity: 0.3
                }}
              >
                <DescriptionIcon sx={{ fontSize: '3rem' }} />
              </Box>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '1.5rem', lg: '1.8rem' },
                  lineHeight: 1.3,
                  position: 'relative',
                  zIndex: 1
                }}
              >
                Have 30+ Years Immigration Experience for Give you Visa Approval
              </Typography>
            </Paper>

            {/* Image with Text Overlay */}
            <Box
              sx={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                height: '300px'
              }}
            >
              <Box
                component="img"
                src="/Faq2.jpg"
                alt="Immigration Consultant Agency"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />

              <Paper
                elevation={0}
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  bgcolor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  p: 3
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 'bold',
                    color: '#2c3e50',
                    fontSize: '1.4rem'
                  }}
                >
                 Global Gateway- Visa Consultant  Agency
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default FAQSection;
