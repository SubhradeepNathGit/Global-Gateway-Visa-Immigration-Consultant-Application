import React from 'react';
import { Box, Typography, Button, Dialog, DialogContent, DialogActions } from '@mui/material';
import { useSnackbar } from 'notistack';
import TeamSection from '../../../Components/user/common/Team';
import CountrySupportSection from '../../../Components/user/common/Countries';
import AboutBanner from '../../../Components/user/about/AboutBanner';
import MainContent from '../../../Components/user/about/MainContent';

const AboutSection = () => {
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleConfirmBooking = () => {
    setOpenConfirmDialog(false);
    enqueueSnackbar(
      '🚀 Excellent Choice! Our team will contact you within 2 hours to confirm your slot!',
      { variant: 'success', autoHideDuration: 6000 }
    );
    // navigate('/book-consultation'); // optional navigation logic
  };

  return (
    <Box>
      <AboutBanner />

      {/* ---------- Main About Content ---------- */}
      <MainContent setOpenConfirmDialog={setOpenConfirmDialog} />

      {/* Team Section */}
      <TeamSection />

      {/* Country Support Section */}
      <CountrySupportSection />

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            🎯 Schedule Your Personal Immigration Consultation
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>🏆 What You Get:</strong><br />
            • 1-on-1 session with certified immigration expert<br />
            • Personalized visa strategy for your profile<br />
            • Complete documentation roadmap<br />
            • Success probability assessment<br />
            • Priority country recommendations<br /><br />
            <strong>⏱️ Session Details:</strong><br />
            • Duration: 60 minutes<br />
            • Format: Video call or in-person<br />
            • Follow-up: Written action plan<br /><br />
            <strong>💎 Investment:</strong> ₹2,999 (Adjustable from final fees)<br />
            <strong>🎁 Free</strong> for applications above ₹50,000
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenConfirmDialog(false)} variant="outlined">Cancel</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: '#FF5252', '&:hover': { bgcolor: '#E53935' } }}
            onClick={handleConfirmBooking}
          >
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AboutSection;
