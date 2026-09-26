import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import PhoneIcon from '@mui/icons-material/AddIcCall';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { MdCheckCircle } from 'react-icons/md';
import ContactFAQ from '../../../Components/user/contact/ContactFAQ';
import ContactHeader from '../../../Components/user/contact/ContactHeader';
import GetInTouchSection from '../../../Components/user/contact/GetInTouchSection';
import ContactForm from '../../../Components/user/contact/ContactForm';

const contactItems = [
  {
    icon: <PhoneIcon sx={{ fontSize: 28, color: '#fff' }} />,
    title: 'Have any question?',
    content: '+91 8976564530',
  },
  {
    icon: <EmailIcon sx={{ fontSize: 28, color: '#fff' }} />,
    title: 'Write email',
    content: 'needhelp@globalgateway.com',
  },
  {
    icon: <LocationOnIcon sx={{ fontSize: 28, color: '#fff' }} />,
    title: 'Visit anytime',
    content: 'Sector V, Bidhannagar, Kolkata, West Bengal 700091, India',
  },
];

const faqs = [
  {
    question: "How do I start my visa application process with Global Gateway?",
    answer: "You can select your destination country from our Countries page, check eligibility requirements, and apply directly online or book a consultation with our licensed visa experts."
  },
  {
    question: "Which country is best for permanent residency and work permits?",
    answer: "Canada, Australia, Germany, and New Zealand offer high permanent residency opportunities for skilled workers, students, and professionals through point-based immigration systems."
  },
  {
    question: "What documents are required for student and study visas?",
    answer: "Key requirements include an Official Admission Letter from a certified institution, proof of financial funds, valid passport, language proficiency scores (IELTS/TOEFL), and health clearance."
  },
  {
    question: "How long does the visa application approval take?",
    answer: "Processing times vary depending on the country and visa type (usually between 2 to 8 weeks). You can track your real-time application status directly in your User Dashboard."
  }
];

const Contact = () => {
  const [showToast, setShowToast] = useState(false);

  return (
    <Box>
      {/* Toast Notification */}
      {showToast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          background: 'linear-gradient(to right, rgb(34, 197, 94), rgb(5, 150, 105))',
          color: 'white',
          padding: '16px 20px',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          width: 'calc(100% - 32px)',
          maxWidth: '28rem'
        }}>
          <MdCheckCircle style={{ fontSize: '24px', flexShrink: 0 }} />
          <p style={{ fontSize: '14px', fontWeight: 500, margin: 0 }}>
            Message sent successfully! We'll get back to you soon.
          </p>
        </div>
      )}

      {/* Top Banner */}
      <ContactHeader />

      {/* Contact Section - White Background */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#ffffff' }}>
        <Container
          maxWidth="xl"
          sx={{
            maxWidth: '1400px',
            px: { xs: 2, sm: 4, md: 6, lg: 10 }
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', lg: 'row' },
              justifyContent: 'space-between',
              alignItems: 'stretch',
              gap: { xs: 4, md: 6, lg: 8 },
            }}
          >
            {/* Left Content */}
            <GetInTouchSection contactItems={contactItems} />

            {/* Right Contact Form */}
            <ContactForm setShowToast={setShowToast} />

          </Box>
        </Container>
      </Box>

      {/* FAQ Section */}
      <ContactFAQ faqs={faqs} />

      {/* Full Width Map Section */}
      <Box sx={{ width: '100%', height: { xs: '350px', md: '450px' }, position: 'relative', bgcolor: '#f8f9fa' }}>
        <Box
          component="iframe"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14736.29367479413!2d88.42368325334073!3d22.576357221821645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0275b020703c0d%3A0xece6f8e0fc2e1613!2sSector%20V%2C%20Bidhannagar%2C%20Kolkata%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1754492538178!5m2!1sen!2sin"
          sx={{
            width: '100%',
            height: '100%',
            border: 0,
          }}
          allowFullScreen=""
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Box>
    </Box>
  );
};

export default Contact;