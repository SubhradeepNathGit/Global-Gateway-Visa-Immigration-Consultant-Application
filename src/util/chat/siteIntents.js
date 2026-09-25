/** Knowledge base for the free local assistant (no API). */

export const LOCAL_CONFIDENCE_MIN_SCORE = 2;

export const SORRY_NO_ANSWER =
  "Sorry, I couldn't find a clear answer to that question.\n\n" +
  "Please reach our team:\n" +
  "• Contact us page\n" +
  "• needhelp@globalgateway.com\n" +
  "• +91-8978564530\n\n" +
  "If you're signed in, mention your registered email and any application or payment reference.";

export const INTENTS = [
  // ─── Greetings & Meta ───
  {
    id: 'greeting',
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'good afternoon', 'namaste', 'hola', 'yo', 'sup', 'howdy'],
    reply:
      "Hi there! Welcome to Global Gateway. I am your expert visa & study assistant.\n\n" +
      "I can assist you with:\n" +
      "• Country visa applications (Student, Tourist, Work, Resident, Family, Business)\n" +
      "• IELTS & language coaching courses\n" +
      "• Embassy appointments & status tracking\n" +
      "• Visa fees & checkout payment steps\n\n" +
      "How can I help you today?",
  },
  {
    id: 'goodbye',
    keywords: ['bye', 'goodbye', 'see you', 'later', 'exit', 'close'],
    reply: "Goodbye! Safe travels — come back anytime if you need help with visas or courses. We're here 24/7!",
  },
  {
    id: 'thanks',
    keywords: ['thank', 'thanks', 'thx', 'appreciate', 'helpful', 'great help', 'awesome'],
    reply: "You're welcome! Happy to help. Feel free to ask anything else about visas, courses, or your application.",
  },
  {
    id: 'capabilities',
    keywords: [
      'what can you make me know', 'what can you tell me', 'what can you help', 'what do you know',
      'what can i ask', 'what can you do', 'what do you offer', 'tell me everything',
      'what information', 'how can you help', 'what are your features', 'what can i learn',
      'what do you cover', 'what services do you provide', 'tell me about your services'
    ],
    reply:
      "I can provide complete guidance on all Global Gateway services:\n\n" +
      "1. Visa Applications & Eligibility: Step-by-step guidance for Student, Tourist, Work, Family, Business & Resident visas across global destinations.\n" +
      "2. Country Requirements: Detailed document checklists, eligibility criteria, and country specific rules.\n" +
      "3. Coaching & IELTS Preparation: Information on enrollment, courses, study materials, and Band 7+ prep.\n" +
      "4. Embassy Appointments & Tracking: How to view, schedule, reschedule, or track biometrics & interview appointments on your Dashboard.\n" +
      "5. Fees & Payments: Clear breakdown of service fees, payment methods, receipts, and refund policies.\n\n" +
      "What specific country or service would you like to explore?",
  },
  {
    id: 'chatbot_meta',
    keywords: ['who are you', 'are you ai', 'are you robot', 'real person', 'bot', 'chatbot', 'artificial'],
    reply:
      "I'm Global Gateway's AI assistant. I can answer questions about our visa services, courses, fees, and how to use the platform. For complex case-specific advice, I'd recommend reaching out to our team via the Contact us page.",
  },

  // ─── Visa Services Overview ───
  {
    id: 'visa_services',
    keywords: [
      'visa service', 'what visa', 'types of visa', 'visa types', 'do you offer',
      'what do you offer', 'services offered', 'immigration service', 'visa category',
      'what services', 'your services', 'visa options', 'available visa',
    ],
    reply:
      "We offer comprehensive visa services for 6 visa categories:\n\n" +
      "1. Student Visa — study abroad at universities worldwide\n" +
      "2. Tourist Visa — travel and holiday visas\n" +
      "3. Work Visa — employment and work permits\n" +
      "4. Business Visa — conferences, meetings, trade\n" +
      "5. Family Visa — spouse, dependent, reunion visas\n" +
      "6. Resident Visa — permanent residency, settlement\n\n" +
      "Visit the Countries page to see available destinations and start your application.",
  },

  // ─── Specific Visa Types ───
  {
    id: 'student_visa',
    keywords: ['student visa', 'study abroad', 'university', 'college', 'education visa', 'study visa', 'student permit', 'masters abroad', 'bachelors abroad', 'scholarship'],
    reply:
      "Student Visa Process:\n\n" +
      "1. Go to Countries page → select your target country.\n" +
      "2. Click Visa Process → choose Student Visa.\n" +
      "3. Review required documents (offer letter, financial proof, academic transcripts, passport).\n" +
      "4. Sign in to your account and submit the online application.\n" +
      "5. Complete fee payment and track your application status in your Dashboard.",
  },
  {
    id: 'tourist_visa',
    keywords: ['tourist visa', 'visitor visa', 'travel visa', 'vacation visa', 'holiday visa', 'sightseeing'],
    reply:
      "Tourist & Visitor Visa Process:\n\n" +
      "1. Go to Countries page → pick your travel destination.\n" +
      "2. Select Tourist Visa under Visa Process.\n" +
      "3. Prepare passport, proof of funds, hotel/itinerary, and travel insurance.\n" +
      "4. Submit application form online and complete payment.\n" +
      "5. Track status and receive embassy updates in your Dashboard.",
  },
  {
    id: 'work_visa',
    keywords: ['work visa', 'job visa', 'employment visa', 'work permit', 'working visa', 'job offer'],
    reply:
      "Work & Employment Visa Process:\n\n" +
      "1. Open Countries page → choose the country where you have a job offer/sponsorship.\n" +
      "2. View Work Visa requirements under Visa Process.\n" +
      "3. Upload job offer letter, employer sponsorship, qualifications, and passport.\n" +
      "4. Submit application and track processing milestones in your Dashboard.",
  },
  {
    id: 'family_visa',
    keywords: ['family visa', 'spouse visa', 'dependent visa', 'reunion visa', 'marriage visa', 'parent visa'],
    reply:
      "Family & Dependent Visa Process:\n\n" +
      "1. Go to Countries page → select destination.\n" +
      "2. Check Family / Dependent Visa under Visa Process.\n" +
      "3. Gather relationship proof (marriage certificate, birth certificate, sponsor status).\n" +
      "4. Complete online application and track updates via your Dashboard.",
  },
  {
    id: 'business_visa',
    keywords: ['business visa', 'investor visa', 'trade visa', 'conference visa', 'commercial visa'],
    reply:
      "Business Visa Process:\n\n" +
      "1. Go to Countries page → choose destination country.\n" +
      "2. Select Business Visa in Visa Process.\n" +
      "3. Upload invitation letter, company registration, and purpose of visit.\n" +
      "4. Submit and complete checkout to initiate application processing.",
  },

  // ─── Destination Countries ───
  {
    id: 'countries',
    keywords: ['countries', 'destinations', 'where can i go', 'which countries', 'available countries', 'location', 'nations'],
    reply:
      "We support visa applications for top destination countries worldwide including Canada, USA, UK, Australia, Germany, France, South Africa, Japan, UAE, and more!\n\n" +
      "Visit the Countries page to explore all supported destinations and view specific requirements.",
  },

  // ─── Application Process & Tracking ───
  {
    id: 'how_to_apply',
    keywords: ['how to apply', 'application process', 'apply for visa', 'start application', 'step by step', 'how do i start'],
    reply:
      "Step-by-step Application Guide:\n\n" +
      "1. Select Country: Browse the Countries page and pick your destination.\n" +
      "2. Select Visa Type: View Visa Process to pick Student, Tourist, Work, etc.\n" +
      "3. Sign In / Register: Create an account or log in.\n" +
      "4. Fill & Upload: Fill the digital form and upload required documents.\n" +
      "5. Payment: Complete fee payment securely at checkout.\n" +
      "6. Track Status: Monitor application progress live in your Dashboard.",
  },
  {
    id: 'tracking',
    keywords: ['track', 'status', 'application status', 'where is my visa', 'check status', 'progress', 'dashboard tracking'],
    reply:
      "To track your application status:\n\n" +
      "1. Sign in to your Global Gateway account.\n" +
      "2. Open your Dashboard.\n" +
      "3. Click on Applications to see real-time updates, embassy stage, and next steps.",
  },
  {
    id: 'appointments',
    keywords: ['appointment', 'interview', 'biometric', 'embassy date', 'slot', 'booking appointment', 'reschedule'],
    reply:
      "Embassy Appointments & Rescheduling:\n\n" +
      "• Appointments (biometrics/interviews) are assigned by the embassy after review.\n" +
      "• View scheduled dates and locations on your Dashboard.\n" +
      "• To reschedule: Check if a Reschedule option is available on your application in the Dashboard. If not, contact support with your application ID.",
  },

  // ─── Courses & Coaching ───
  {
    id: 'courses',
    keywords: ['course', 'courses', 'ielts', 'coaching', 'prep', 'preparation', 'classes', 'learn english', 'toefl', 'gre', 'gmat'],
    reply:
      "Our IELTS & Coaching Courses:\n\n" +
      "• Band 7+ IELTS Prep — Live interactive classes & practice tests\n" +
      "• Visa Interview Coaching — 1-on-1 mock interview preparation\n" +
      "• Language Proficiency — Academic English & communication\n\n" +
      "Visit the Courses page to view curriculum, pricing, and enroll.",
  },

  // ─── Fees & Payments ───
  {
    id: 'fees',
    keywords: ['fee', 'fees', 'cost', 'price', 'pricing', 'charges', 'how much', 'payment', 'pay'],
    reply:
      "Pricing & Payments:\n\n" +
      "• Visa service fees vary by country and visa type, clearly displayed under Visa Process before checkout.\n" +
      "• Course fees are shown on the Courses page.\n" +
      "• We accept Credit/Debit Cards, Net Banking, and UPI.\n" +
      "• All receipts are saved in your Dashboard under Payment History.",
  },
  {
    id: 'refund',
    keywords: ['refund', 'cancellation', 'money back', 'cancel application', 'refund policy'],
    reply:
      "Refund & Cancellation Policy:\n\n" +
      "• Service fees are refundable prior to document submission to embassy.\n" +
      "• Government embassy fees are non-refundable once paid to embassy authorities.\n" +
      "• To request a cancellation/refund, contact support with your transaction reference.",
  },

  // ─── Contact & Support ───
  {
    id: 'contact',
    keywords: ['contact', 'support', 'email', 'phone', 'call', 'number', 'address', 'human agent', 'talk to human'],
    reply:
      "Contact Global Gateway Team:\n\n" +
      "• Email: needhelp@globalgateway.com\n" +
      "• Phone: +91 8976564530\n" +
      "• Office: Sector V, Bidhannagar, Kolkata, West Bengal 700091, India\n" +
      "• Form: Fill the contact form on the Contact us page for 24-hour response.",
  },
];
