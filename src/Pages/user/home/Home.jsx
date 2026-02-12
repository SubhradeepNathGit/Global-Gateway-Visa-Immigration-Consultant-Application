import React from 'react'
import Banner from '../../../Components/user/home/Banner'
import About from '../../../Components/user/home/About'
import VisaServicesSection from '../../../Components/user/home/Visaservice'
import CountrySupportSection from '../../../Components/user/common/Countries'
import Training from '../../../Components/user/home/Training'
import WhyChooseUs from '../../../Components/user/home/Benifits'
import StatsSection from '../../../Components/user/home/Stats'
import VisaProcessSection from '../../../Components/user/home/Process'
import ContactBanner from '../../../Components/user/home/Contactbanner'
import TeamSection from '../../../Components/user/common/Team'
import FAQSection from '../../../Components/user/home/FAQ'
import Testimonials from '../../../Components/user/home/Testimonial'

const Home = () => {
  return (
    <>
      <Banner />
      <About />
      <VisaServicesSection />
      <CountrySupportSection />
      <Training />
      <WhyChooseUs />
      <StatsSection />
      <VisaProcessSection />
      <ContactBanner />
      <TeamSection />
      <FAQSection />
      <Testimonials />
    </>
  )
}

export default Home
