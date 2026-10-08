import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Avatar,
  IconButton,
  Paper,
  Container,
} from '@mui/material';
import { motion } from 'framer-motion';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import PinterestIcon from '@mui/icons-material/Pinterest';
import ShareIcon from '@mui/icons-material/Share';

const teamMembers = [
  {
    name: 'Mike Hardson',
    title: 'Consultant',
    img: '/team1.jpg',
    showIcons: true,
  },
  {
    name: 'Jessica Brown',
    title: 'Consultant',
    img: '/team2.jpg',
    showIcons: true,
  },
  {
    name: 'David Cooper',
    title: 'Consultant',
    img: '/team3.jpg',
    showIcons: true,
  },
  {
    name: 'Christine Eve',
    title: 'Consultant',
    img: '/team5.jpg',
    showIcons: true,
  },
];

const TeamSection = () => {
  return (
    <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: '#fdfdfd' }}>
      <Container maxWidth="xl" sx={{ maxWidth: '1400px', px: { xs: 2, sm: 4, md: 6, lg: 10 } }}>
        <Box
          flex={1}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            textAlign: 'center',
            mb: 6,
          }}
        >
          <Typography variant="subtitle2" component="strong" sx={{ color: '#ef4444', fontWeight: 700 }}>
            / OUR PANNEL
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem', lg: '2.5rem' },
              lineHeight: 1.2,
              color: '#2c3e50',
              mt: 1,
            }}
          >
            Meet Our Team
          </Typography>
          <Typography
            variant="body1"
            sx={{ mt: 2, color: '#64748b', maxWidth: 700, mx: 'auto' }}
          >
            With over 10+ years of combined experience, our dedicated team of consultants
            is committed to providing the highest level of service.
          </Typography>
        </Box>

        <Grid container justifyContent="center" spacing={{ xs: 4, sm: 4, md: 3, lg: 4 }}>
          {teamMembers.map((member, index) => (
            <Grid
              key={index}
              size={{ xs: 12, sm: 6, md: 3 }}
              component={motion.div}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Box sx={{ textAlign: 'center', position: 'relative' }}>
                {/* Avatar with semi-circle background */}
                <Box
                  sx={{
                    position: 'relative',
                    width: { xs: 200, sm: 220, md: 210, lg: 240, xl: 250 },
                    height: { xs: 200, sm: 220, md: 210, lg: 240, xl: 250 },
                    mx: 'auto',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '50%',
                      borderTopLeftRadius: '999px',
                      borderTopRightRadius: '999px',
                      background: member.showIcons
                        ? 'linear-gradient(135deg, #4A00E0, #FF416C)'
                        : '#e9ecf2',
                      zIndex: 1,
                    }}
                  />
                  <Avatar
                    src={member.img}
                    alt={member.name}
                    sx={{
                      width: '100%',
                      height: '100%',
                      zIndex: 2,
                      position: 'relative',
                    }}
                  />
                  {member.showIcons ? (
                    <Paper
                      elevation={3}
                      sx={{
                        px: 2,
                        py: 1,
                        borderRadius: 5,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 1,
                        position: 'absolute',
                        bottom: -20,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 3,
                      }}
                    >
                      <IconButton size="small">
                        <TwitterIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <FacebookIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <PinterestIcon fontSize="small" />
                      </IconButton>
                    </Paper>
                  ) : (
                    <IconButton
                      sx={{
                        backgroundColor: 'white',
                        boxShadow: 3,
                        position: 'absolute',
                        bottom: -15,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 3,
                      }}
                    >
                      <ShareIcon />
                    </IconButton>
                  )}
                </Box>

                {/* Text */}
                <Typography variant="h6" fontWeight={600} mt={6}>
                  {member.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {member.title}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TeamSection;
