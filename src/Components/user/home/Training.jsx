import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent,
  IconButton, Avatar, Dialog, DialogContent, Container, CardMedia, Button, Skeleton
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        maxWidth: 280,
        width: '100%',
        height: 420,
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.4s ease',
        transform: isHovered ? 'translateY(-12px) scale(1.02)' : 'none',
        boxShadow: isHovered
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
          zIndex: 1,
          pointerEvents: 'none'
        }
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden', height: 200 }}>
        <CardMedia
          component="img"
          height="200"
          image={img}
          alt={title}
          sx={{
            objectFit: 'cover',
            backgroundColor: '#e5e7eb',
            transition: 'transform 0.4s ease',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          }}
        />

        <Avatar
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            bgcolor: '#ef4444',
            width: 40,
            height: 40,
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'none',
            transition: 'all 0.3s ease',
            zIndex: 2
          }}
        >
          {avatar}
        </Avatar>

        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.3))',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />
      </Box>

      <CardContent sx={{
        p: 3,
        height: 'calc(100% - 200px)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 2
      }}>
        <Typography variant="h6" sx={{
          fontWeight: 700,
          mb: 1,
          color: isHovered ? '#ef4444' : '#1a1a1a',
          transition: 'color 0.3s ease'
        }}>
          {title}
        </Typography>

        <Typography variant="body2" sx={{
          color: '#6b7280',
          lineHeight: 1.6,
          mb: 2,
          flexGrow: 1
        }}>
          {desc}
        </Typography>

        <Typography variant="caption" sx={{
          color: '#9ca3af',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: 0.5
        }}>
          Updated July 2025
        </Typography>

        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 2,
          opacity: isHovered ? 1 : 0.7,
          transition: 'opacity 0.3s ease'
        }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              size="small"
              sx={{
                color: '#ef4444',
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <FavoriteIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              sx={{
                color: '#6b7280',
                '&:hover': {
                  backgroundColor: 'rgba(107, 114, 128, 0.1)',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <ShareIcon fontSize="small" />
            </IconButton>
          </Box>
          <IconButton
            size="small"
            sx={{
              color: '#6b7280',
              transform: isHovered ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.3s ease'
            }}
          >
            <ExpandMoreIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

const Training = () => {
  const [openVideo, setOpenVideo] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const navigate = useNavigate();

  const handleGoToCourses = () => {
    navigate('/coachingcards');
  };

  const handlePlayVideo = () => {
    setVideoLoading(true);
    setOpenVideo(true);
  };

  return (
    <Box
      sx={{
        bgcolor: '#f8fafc',
        display: 'flex',
        alignItems: 'flex-start',
        py: { xs: 2, md: 4 }
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
            <Grid item xs={12} md={8}>
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

            <Grid item xs={12} md={4}>
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
            spacing={3}
            sx={{ justifyContent: 'center', m: 0 }}
          >
            {trainings.map((item, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx} sx={{ display: 'flex', justifyContent: 'center' }}>
                <TrainingCard {...item} />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 4, md: 6 } }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleGoToCourses}
            sx={{
              borderColor: '#ef4444',
              color: '#ef4444',
              px: 4,
              py: 1.5,
              borderRadius: 2,
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
                boxShadow: '0 8px 20px rgba(239, 68, 68, 0.3)',
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
