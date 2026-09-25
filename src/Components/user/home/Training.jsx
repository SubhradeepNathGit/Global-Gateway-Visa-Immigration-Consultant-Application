import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card,
  IconButton, Dialog, DialogContent, Container, CardMedia, Button, Skeleton
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useNavigate } from 'react-router-dom';

const trainings = [
  {
    title: "Citizenship Test",
    img: "Course1.jpg",
    desc: "Learn everything about the citizenship test including practice questions and resources.",
    avatar: "C"
  },
  {
    title: "Take IELTS",
    img: "Course2.jpg",
    desc: "Master IELTS with expert guidance and helpful strategies for every section.",
    avatar: "I"
  },
  {
    title: "PTE Coaching",
    img: "Course3.jpg",
    desc: "Achieve your desired PTE score with personalized coaching modules.",
    avatar: "P"
  },
  {
    title: "TOEFL Coaching",
    img: "Course4.jpg",
    desc: "Score high on the TOEFL exam with top-notch coaching and strategy support.",
    avatar: "T"
  }
];

const TrainingCard = ({ title, img, desc, avatar }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <Card
      elevation={0}
      onClick={() => navigate('/course')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(prev => !prev)}
      sx={{
        width: { xs: '100%', sm: 275, md: 285 },
        maxWidth: 290,
        height: 365,
        position: 'relative',
        borderRadius: '18px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: 'none',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isHovered ? 'translateY(-6px)' : 'none',
      }}
    >
      {/* Full-bleed background image */}
      <CardMedia
        component="img"
        image={img.startsWith('/') ? img : `/${img}`}
        alt={title}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: isHovered ? 'scale(1.08)' : 'scale(1)',
        }}
      />

      {/* Atmospheric gradient overlay for image depth */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.1) 40%, rgba(0, 0, 0, 0.65) 100%)',
          pointerEvents: 'none',
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Resting title pill at bottom (fades down when hovered) */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 14,
          left: 14,
          right: 14,
          zIndex: 2,
          opacity: isHovered ? 0 : 1,
          transform: isHovered ? 'translateY(12px)' : 'translateY(0)',
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'none'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            px: 2,
            py: 1.3,
            borderRadius: '8px',
            background: 'rgba(42, 43, 45, 0.55)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
          }}
        >
          <Typography
            sx={{
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.92rem',
              letterSpacing: 0.2,
              textAlign: 'center',
            }}
          >
            {title}
          </Typography>
        </Box>
      </Box>

      {/* On cursor: Liquid morphic div that slides up with name and slight overview */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          right: 12,
          zIndex: 4,
          borderRadius: '8px',
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0.78) 100%)',
          backdropFilter: 'blur(20px) saturate(190%)',
          WebkitBackdropFilter: 'blur(20px) saturate(190%)',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          borderTop: '1px solid rgba(255, 255, 255, 1)',
          boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.95)',
          p: 1.8,
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateY(0)' : 'translateY(105%)',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: isHovered ? 'auto' : 'none',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: '1.05rem',
            color: '#0f172a',
            mb: 0.5,
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#475569',
            fontSize: '0.78rem',
            lineHeight: 1.45,
            mb: 1.2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {desc}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              px: 1.2,
              py: 0.3,
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              border: '1px solid rgba(255, 255, 255, 0.9)',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: '#64748b',
                fontWeight: 600,
                fontSize: '0.64rem',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Updated July 2025
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

const Training = () => {
  const [openVideo, setOpenVideo] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const navigate = useNavigate();

  const handleGoToCourses = () => {
    navigate('/course');
  };

  const handlePlayVideo = () => {
    setVideoLoading(true);
    setOpenVideo(true);
  };

  return (
    <Box
      sx={{
        bgcolor: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-start',
        py: { xs: 2, md: 4 },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '340px',
          height: '340px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(40px)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '15%',
          right: '8%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(45px)',
        }
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 4, md: 6 } }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="body2"
            sx={{
              color: '#ef4444',
              fontWeight: 600,
              mb: 3,
              textTransform: 'uppercase',
              letterSpacing: 1
            }}
          >
            / Training & Certification
          </Typography>

          <Grid container spacing={4} alignItems="center" justifyContent="space-between">
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                  color: '#1a1a1a',
                  lineHeight: 1.2,
                  mb: { xs: 4, md: 0 },
                  textAlign: { xs: 'center', md: 'left' }
                }}
              >
                Get the Immigration<br />
                Trainings you Deserve
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'center', md: 'flex-end' }
                }}
              >
                <Box
                  onClick={handlePlayVideo}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'transform 0.3s ease',
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    cursor: 'pointer',
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 60, md: 70 },
                      height: { xs: 60, md: 70 },
                      borderRadius: '50%',
                      border: `2px solid ${isHovered ? '#dc2626' : '#ef4444'}`,
                      backgroundColor: isHovered ? '#ef4444' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <PlayArrowIcon
                      sx={{
                        fontSize: { xs: 28, md: 32 },
                        color: isHovered ? '#fff' : '#ef4444',
                        transition: 'color 0.3s ease'
                      }}
                    />
                  </Box>
                  <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                    <Typography fontWeight={600} variant="body1">
                      Play Video
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Watch training videos
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Grid
            container
            spacing={2}
            sx={{ justifyContent: 'center', m: 0, width: '100%', maxWidth: 1260 }}
          >
            {trainings.map((item, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx} sx={{ display: 'flex', justifyContent: 'center' }}>
                <TrainingCard {...item} />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleGoToCourses}
            sx={{
              borderColor: '#ef4444',
              color: '#ef4444',
              px: 4,
              py: 1.5,
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '16px',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#ef4444',
                color: 'white',
                borderColor: '#ef4444',
                transform: 'translateY(-2px)',
                boxShadow: 'none',
              },
            }}
          >
            Go to Courses
          </Button>
        </Box>
      </Container>

      <Dialog
        open={openVideo}
        onClose={() => setOpenVideo(false)}
        maxWidth="lg"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
            overflow: 'hidden',
            m: { xs: 2, sm: 4 },
            maxHeight: '90vh'
          }
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={() => setOpenVideo(false)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0,0,0,0.5)',
              color: 'white',
              zIndex: 1,
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.7)'
              }
            }}
          >
            ×
          </IconButton>

          <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
            {videoLoading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 1
                }}
              >
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height="100%"
                  animation="wave"
                />
              </Box>
            )}

            {openVideo && (
              <iframe
                src="https://www.youtube.com/embed/Elwg3kMRnfM?autoplay=1&rel=0&modestbranding=1"
                title="Training Video"
                loading="lazy"
                onLoad={() => setVideoLoading(false)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0,
                  zIndex: 2
                }}
              />
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Training;
