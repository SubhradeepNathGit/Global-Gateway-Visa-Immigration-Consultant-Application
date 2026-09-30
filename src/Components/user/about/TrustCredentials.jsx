import React, { useState } from 'react';
import { Box, Typography, Container, Grid, Button } from '@mui/material';
import { motion } from 'framer-motion';
import {
  VerifiedUser,
  Shield,
  FactCheck,
  CheckCircle,
  AccountBalance,
  SupportAgent,
  ArrowForward,
  Autorenew,
} from '@mui/icons-material';

const MotionBox = motion(Box);

const coreGuarantees = [
  {
    icon: <VerifiedUser sx={{ fontSize: 22, color: '#ef4444' }} />,
    tag: 'HUMAN CARE',
    title: 'Dedicated Case Specialist',
    shortDesc: 'Work 1-on-1 with a licensed immigration specialist who personally reviews your transcripts and credentials.',
    fullDescription:
      'You are paired directly with a licensed legal advisor who thoroughly audits your transcripts, employment history, and points. We never use automated screening bots to decide your application—every dossier receives meticulous human review.',
    detailedPoints: [
      '1-on-1 dedicated immigration attorney',
      'Direct phone & email support access',
      'Pre-submission documentation audit',
      'Personalized consular interview coaching',
    ],
  },
  {
    icon: <AccountBalance sx={{ fontSize: 22, color: '#ef4444' }} />,
    tag: 'OFFICIAL LODGEMENT',
    title: 'Verifiable Embassy Tracking',
    shortDesc: 'Lodged directly through official government portals with authentic reference IDs provided on day one.',
    fullDescription:
      'We submit every visa petition directly through official destination portals (IRCC Canada, Home Affairs Australia, UK Visas & Immigration, US USCIS). You receive your official government acknowledgement letter immediately to verify status independently.',
    detailedPoints: [
      'Official consular reference numbers',
      'Direct portal access without middlemen',
      'Real-time status change alerts',
      'Zero risk of unauthorized filings',
    ],
  },
  {
    icon: <FactCheck sx={{ fontSize: 22, color: '#ef4444' }} />,
    tag: 'HONEST RETAINERS',
    title: 'Transparent Feasibility & Fees',
    shortDesc: 'Honest pre-evaluation and milestone agreements. If a visa is not viable, we tell you frankly before fees.',
    fullDescription:
      'We perform a rigorous legal assessment before accepting your case. If your profile is not viable, we advise you candidly. When proceeding, your written retainer details every government and legal fee with milestone-based payment protection.',
    detailedPoints: [
      'Legally binding fee schedule upfront',
      'Milestone-based payment protection',
      'Zero hidden surcharges or surprise fees',
      'Strict anti-fraud document policy',
    ],
  },
];

const FlipCard = ({ item, index }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped((prev) => !prev)}
      sx={{
        perspective: '1200px',
        height: 245,
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* FRONT FACE - LIQUID MORPHIC */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(255, 255, 255, 0.62) 100%)',
            backdropFilter: 'blur(18px) saturate(190%)',
            WebkitBackdropFilter: 'blur(18px) saturate(190%)',
            border: '1px solid rgba(255, 255, 255, 0.85)',
            borderTop: '1px solid rgba(255, 255, 255, 1)',
            boxShadow: '0 8px 28px -4px rgba(15, 23, 42, 0.06), inset 0 1px 2px 0 rgba(255, 255, 255, 0.95)',
            p: 2.4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Header Row */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(254, 242, 242, 0.95) 0%, rgba(254, 226, 226, 0.75) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </Box>
            <Typography
              sx={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: '#94a3b8',
                letterSpacing: 0.8,
                textTransform: 'uppercase',
              }}
            >
              {item.tag}
            </Typography>
          </Box>

          {/* Heading - Strictly 1 Line */}
          <Box sx={{ my: 'auto' }}>
            <Typography
              noWrap
              sx={{
                color: '#1e293b',
                fontWeight: 700,
                fontSize: { xs: '1.05rem', md: '1.14rem' },
                lineHeight: 1.25,
                mb: 1.2,
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
              title={item.title}
            >
              {item.title}
            </Typography>
            <Typography
              sx={{
                color: '#64748b',
                fontSize: '0.86rem',
                lineHeight: 1.6,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {item.shortDesc}
            </Typography>
          </Box>
        </Box>

        {/* BACK FACE - LIQUID MORPHIC WITH INVISIBLE SCROLLABLE CONTENT */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(255, 255, 255, 0.82) 100%)',
            backdropFilter: 'blur(20px) saturate(190%)',
            WebkitBackdropFilter: 'blur(20px) saturate(190%)',
            border: '1px solid rgba(255, 255, 255, 0.95)',
            borderTop: '1px solid rgba(255, 255, 255, 1)',
            boxShadow: '0 12px 34px -4px rgba(15, 23, 42, 0.08), inset 0 1px 2px 0 rgba(255, 255, 255, 1)',
            p: 2.4,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Back Header - Clean Title & Tag */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              pb: 1,
              mb: 1,
              borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
            }}
          >
            <Typography
              noWrap
              sx={{
                color: '#1e293b',
                fontWeight: 700,
                fontSize: '0.94rem',
                maxWidth: '75%',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
            >
              {item.title}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.64rem',
                fontWeight: 700,
                color: '#ef4444',
                letterSpacing: 0.8,
                textTransform: 'uppercase',
                background: 'rgba(255, 241, 242, 0.75)',
                px: 1,
                py: 0.25,
                borderRadius: '4px',
              }}
            >
              {item.tag}
            </Typography>
          </Box>

          {/* Scrollable Content Body - Completely Invisible Scrollbar */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none', // IE and Edge
              '&::-webkit-scrollbar': {
                display: 'none', // Chrome, Safari, Edge
                width: 0,
                height: 0,
              },
            }}
          >
            <Typography sx={{ color: '#475569', fontSize: '0.82rem', lineHeight: 1.55, mb: 1.3 }}>
              {item.fullDescription}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              {item.detailedPoints.map((pt, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.8 }}>
                  <CheckCircle sx={{ fontSize: 14, color: '#16a34a', mt: 0.25, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '0.78rem', color: '#1e293b', fontWeight: 500, lineHeight: 1.4 }}>
                    {pt}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const TrustCredentials = ({ setOpenConfirmDialog }) => {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 9 },
        backgroundColor: '#ffffff',
        position: 'relative',
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          maxWidth: '1400px',
          px: { xs: 2, sm: 4, md: 6, lg: 10 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Section Header */}
        <Box
          sx={{
            textAlign: 'center',
            maxWidth: '960px',
            mx: 'auto',
            mb: { xs: 5, md: 7 },
          }}
        >
          <Typography
            variant="overline"
            sx={{
              color: '#FF5252',
              fontWeight: 700,
              letterSpacing: 1.5,
              fontSize: '0.85rem',
              display: 'inline-block',
              mb: 0.8,
            }}
          >
            / HOW WE PROTECT YOU
          </Typography>

          <Typography
            variant="h2"
            sx={{
              color: '#2C3E50',
              fontWeight: 700,
              fontSize: { xs: '1.35rem', sm: '1.75rem', md: '2.1rem', lg: '2.35rem' },
              lineHeight: 1.25,
              mb: 1.6,
              whiteSpace: { md: 'nowrap' },
            }}
          >
            Real Legal Counsel. Verifiable Filings. Zero False Promises.
          </Typography>

          <Typography
            sx={{
              color: '#64748b',
              fontSize: { xs: '0.92rem', md: '1rem' },
              lineHeight: 1.65,
            }}
          >
            Moving across borders is one of the most significant life decisions you will ever make.
            Here is how Global Gateway protects international applicants with authentic consular lodgements,
            complete fee transparency, and dedicated personal guidance.
          </Typography>
        </Box>

        {/* 3 Compact Liquid Morphic Flip Cards with Scrollable Back Face */}
        <Grid container spacing={{ xs: 2.5, md: 3 }} sx={{ mb: { xs: 5, md: 6 } }}>
          {coreGuarantees.map((item, index) => (
            <Grid key={index} size={{ xs: 12, md: 4 }}>
              <FlipCard item={item} index={index} />
            </Grid>
          ))}
        </Grid>

        {/* Ethical Client Protection Charter Banner - Liquid Morphic */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          sx={{
            borderRadius: '20px',
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
            backdropFilter: 'blur(20px) saturate(190%)',
            WebkitBackdropFilter: 'blur(20px) saturate(190%)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            borderTop: '1px solid rgba(255, 255, 255, 1)',
            boxShadow: '0 12px 36px -4px rgba(15, 23, 42, 0.06), inset 0 1px 2px 0 rgba(255, 255, 255, 0.95)',
            p: { xs: 3, sm: 4.5, md: 5 },
            position: 'relative',
          }}
        >
          <Grid container spacing={{ xs: 3.5, md: 5 }} alignItems="center">
            <Grid size={{ xs: 12, md: 7.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.3, mb: 1.5 }}>
             
                <Typography
                  variant="h5"
                  sx={{
                    color: '#1e293b',
                    fontWeight: 700,
                    fontSize: { xs: '1.2rem', md: '1.4rem' },
                    lineHeight: 1.3,
                  }}
                >
                  Our Ethical Immigration Commitment
                </Typography>
              </Box>

              <Typography
                sx={{
                  color: '#475569',
                  fontSize: { xs: '0.88rem', md: '0.95rem' },
                  lineHeight: 1.7,
                  mb: 3,
                }}
              >
                We do not sell shortcuts, unverified work permits, or false expectations. Every client agreement includes clear service commitments, protected milestones, and official government lodgements—ensuring you stay fully protected against fraud and immigration complications.
              </Typography>

              <Grid container spacing={1.8}>
                {[
                  { label: 'Direct Consular Portals', desc: 'No unverified intermediaries' },
                  { label: 'Written Fee Contract', desc: 'All disbursements itemized upfront' },
                  { label: 'Confidential Records Vault', desc: 'Your documents are never shared' },
                  { label: 'Honest Eligibility Pre-Check', desc: 'Clear advice before any payment' },
                ].map((item, idx) => (
                  <Grid key={idx} size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <CheckCircle sx={{ color: '#16a34a', fontSize: 18, mt: 0.2, flexShrink: 0 }} />
                      <Box>
                        <Typography sx={{ color: '#0f172a', fontSize: '0.86rem', fontWeight: 600 }}>
                          {item.label}
                        </Typography>
                        <Typography sx={{ color: '#64748b', fontSize: '0.78rem' }}>
                          {item.desc}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid
              size={{ xs: 12, md: 4.5 }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'flex-start', md: 'center' },
                justifyContent: 'center',
                textAlign: { xs: 'left', md: 'center' },
                p: { xs: 2.5, md: 3.5 },
                background: 'rgba(248, 250, 252, 0.75)',
                backdropFilter: 'blur(12px)',
                borderRadius: '14px',
                border: '1px solid rgba(226, 232, 240, 0.8)',
              }}
            >
              <SupportAgent sx={{ fontSize: 40, color: '#FF5252', mb: 1 }} />
              <Typography sx={{ color: '#1e293b', fontWeight: 700, fontSize: '1.05rem', mb: 0.8 }}>
                Talk to a Case Specialist
              </Typography>
              <Typography sx={{ color: '#64748b', fontSize: '0.84rem', lineHeight: 1.55, mb: 2.5 }}>
                Get an authentic, no-pressure evaluation of your visa eligibility from experienced international advisors.
              </Typography>
              <Button
                variant="contained"
                onClick={() => setOpenConfirmDialog && setOpenConfirmDialog(true)}
                endIcon={<ArrowForward />}
                sx={{
                  bgcolor: '#FF5252',
                  color: '#ffffff',
                  px: 3,
                  py: 1.3,
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  borderRadius: 2,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    bgcolor: '#E53935',
                   
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                Schedule Consultation
              </Button>
            </Grid>
          </Grid>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default TrustCredentials;
