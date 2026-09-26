import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SecurityIcon from '@mui/icons-material/Security';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const GetInTouchSection = ({ contactItems }) => {
  return (
    <Box
      sx={{
        flex: { xs: '1 1 auto', lg: '0 0 45%' },
        width: { xs: '100%', lg: 'auto' },
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mt: 1,
            color: '#0f172a',
            fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem', lg: '2.2rem' }
          }}
        >
          Get in touch with us
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mt: 2,
            color: '#64748b',
            fontSize: { xs: '0.9rem', md: '1rem' },
            lineHeight: 1.6
          }}
        >
          Have questions about visa applications, country eligibility, or coaching courses?
          Our expert immigration consultants and support team are here to guide you every step of the way.
        </Typography>

        {/* Contact Items */}
        <Box sx={{ mt: { xs: 3, md: 3.5 }, display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 2.2 } }}>
          {contactItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    bgcolor: 'rgba(50, 132, 209, 1)',
                    width: { xs: 54, md: 62 },
                    height: { xs: 54, md: 62 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                    mr: { xs: 1.5, md: 2 },
                    flexShrink: 0,
                  }}
                >
                  {React.isValidElement(item.icon) ? React.cloneElement(item.icon, {
                    sx: { fontSize: { xs: 24, md: 28 }, color: '#fff' }
                  }) : item.icon}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      color: '#0f172a',
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: '#475569',
                      fontSize: { xs: '0.85rem', md: '0.95rem' },
                      wordBreak: 'break-word',
                    }}
                  >
                    {item.content}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Box>

      {/* Working Hours & Support Card with clean spacing and 3 trust badges */}
      <Box
        sx={{
          mt: { xs: 4, lg: 'auto' },
          pt: { lg: 3 },
        }}
      >
        <Box
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: 2,
            bgcolor: '#ffffff',
            border: '1px solid #e2e8f0',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1.8 }}>
            <AccessTimeIcon sx={{ color: 'rgba(50, 132, 209, 1)', fontSize: 24 }} />
            <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>
              Working Hours & Support
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
              <Typography sx={{ color: '#64748b', fontSize: '0.88rem', fontWeight: 500 }}>
                Monday – Saturday:
              </Typography>
              <Typography sx={{ color: '#0f172a', fontWeight: 600, fontSize: '0.88rem' }}>
                9:00 AM – 7:00 PM IST
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
              <Typography sx={{ color: '#64748b', fontSize: '0.88rem', fontWeight: 500 }}>
                Sunday & Holidays:
              </Typography>
              <Typography sx={{ color: '#059669', fontWeight: 600, fontSize: '0.88rem' }}>
                Emergency Support Available
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1.2,
              pt: 1.8,
              borderTop: '1px solid #e2e8f0',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <VerifiedUserIcon sx={{ color: 'rgba(50, 132, 209, 1)', fontSize: 18, flexShrink: 0 }} />
              <Typography sx={{ color: '#334155', fontWeight: 600, fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                99.2% Visa Approvals
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <SecurityIcon sx={{ color: 'rgba(50, 132, 209, 1)', fontSize: 18, flexShrink: 0 }} />
              <Typography sx={{ color: '#334155', fontWeight: 600, fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                Certified Consultants
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <SmartToyIcon sx={{ color: 'rgba(50, 132, 209, 1)', fontSize: 18, flexShrink: 0 }} />
              <Typography sx={{ color: '#334155', fontWeight: 600, fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                24/7 Gateway AI Support
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GetInTouchSection;