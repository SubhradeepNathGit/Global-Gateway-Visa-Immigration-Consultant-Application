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
      "Hi there! Welcome to Global Gateway. I can help you with:\n\n• Visa services & applications\n• Country-specific requirements\n• IELTS & coaching courses\n• Fees & payment info\n• Application tracking\n\nWhat would you like to know?",
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
      "For a Student Visa, here's the process:\n\n" +
      "1. Go to the Countries page and select your destination\n" +
      "2. Click 'Visa Process' to see student visa requirements, fees & documents\n" +
      "3. Sign in or register on the Sign in page\n" +
      "4. Fill the application form with your details\n" +
      "5. Upload required documents (passport, admission letter, financial proof, etc.)\n" +
      "6. Complete payment at checkout\n" +
      "7. Track your application status in your Dashboard\n\n" +
      "Common documents needed: valid passport, university admission letter, bank statements, passport photos, and academic transcripts.",
  },
  {
    id: 'tourist_visa',
    keywords: ['tourist visa', 'tourism', 'holiday', 'vacation', 'visit visa', 'travel visa', 'visitor visa', 'sightseeing', 'trip'],
    reply:
      "For a Tourist/Visitor Visa:\n\n" +
      "1. Visit the Countries page and select your destination\n" +
      "2. Check 'Visa Process' for tourist visa requirements and fees\n" +
      "3. Sign in and complete the application\n" +
      "4. Upload documents (passport, travel itinerary, hotel bookings, financial proof)\n" +
      "5. Pay and track status in your Dashboard\n\n" +
      "Processing times vary by country — check the specific country page for estimates.",
  },
  {
    id: 'work_visa',
    keywords: ['work visa', 'working visa', 'employment visa', 'job abroad', 'work permit', 'work abroad', 'employment abroad', 'h1b', 'skilled worker'],
    reply:
      "For a Work/Employment Visa:\n\n" +
      "1. Go to the Countries page and select the destination country\n" +
      "2. Open 'Visa Process' to review work visa types, employer documents & fees\n" +
      "3. Sign in and fill the application with employment details\n" +
      "4. Upload documents (passport, job offer, qualifications, employer letter)\n" +
      "5. Complete payment and track in your Dashboard\n\n" +
      "Requirements vary significantly by country — some require a job offer first, others accept skilled worker applications directly.",
  },
  {
    id: 'business_visa',
    keywords: ['business visa', 'conference', 'meeting visa', 'trade visa', 'business travel', 'corporate visa'],
    reply:
      "For a Business Visa:\n\n" +
      "1. Select the destination on the Countries page\n" +
      "2. Check 'Visa Process' for business visa requirements\n" +
      "3. Apply with business invitation letter, company details\n" +
      "4. Upload supporting documents and pay\n\n" +
      "Business visas typically require an invitation letter from the host company and proof of business purpose.",
  },
  {
    id: 'family_visa',
    keywords: ['family visa', 'spouse visa', 'dependent visa', 'wife visa', 'husband visa', 'children visa', 'reunion', 'join family', 'family reunion'],
    reply:
      "For a Family/Dependent Visa:\n\n" +
      "1. Visit the Countries page and select where your family member resides\n" +
      "2. Check 'Visa Process' for family visa types and requirements\n" +
      "3. You'll typically need: relationship proof, sponsor's documents, financial evidence\n" +
      "4. Apply, upload documents, and track in your Dashboard\n\n" +
      "Family visa rules vary by country — some require minimum income of the sponsor.",
  },
  {
    id: 'resident_visa',
    keywords: ['resident visa', 'residence permit', 'pr visa', 'permanent residency', 'settle abroad', 'immigration', 'green card', 'pr', 'permanent resident'],
    reply:
      "For a Resident/PR Visa:\n\n" +
      "1. Check available countries on the Countries page\n" +
      "2. Open 'Visa Process' for residency routes and eligibility\n" +
      "3. Requirements often include: points system score, work experience, language tests, clean record\n" +
      "4. Apply through our platform with full documentation\n\n" +
      "Residency processes are typically longer — plan for several months. Check specific country requirements for detailed timelines.",
  },

  // ─── Application Process ───
  {
    id: 'apply_how',
    keywords: [
      'how to apply', 'apply for visa', 'application process', 'start application',
      'steps to apply', 'get started', 'begin application', 'how apply', 'apply online',
      'application steps', 'process to apply', 'want to apply', 'need to apply',
    ],
    reply:
      "Here's how to apply for a visa on Global Gateway:\n\n" +
      "Step 1: Browse — Visit the Countries page and select your destination\n" +
      "Step 2: Research — Click 'Visa Process' to see requirements, fees & documents\n" +
      "Step 3: Sign In — Create an account or log in at the Sign in page\n" +
      "Step 4: Apply — Fill in your details in the application form\n" +
      "Step 5: Upload — Submit required documents (passport, photos, etc.)\n" +
      "Step 6: Pay — Complete secure payment at checkout\n" +
      "Step 7: Track — Monitor your application status in your Dashboard\n\n" +
      "You'll receive notifications about any updates or appointment schedules.",
  },

  // ─── Courses & IELTS ───
  {
    id: 'courses_ielts',
    keywords: ['ielts', 'ielts prep', 'ielts preparation', 'ielts course', 'band score', 'band 7', 'english test', 'toefl', 'pte', 'ielts coaching', 'ielts class', 'ielts training'],
    reply:
      "We offer IELTS and English test preparation courses:\n\n" +
      "• Expert coaching for IELTS Academic & General\n" +
      "• Band 7+ targeted preparation\n" +
      "• Practice tests and mock exams\n" +
      "• Flexible online learning\n\n" +
      "How to enroll:\n" +
      "1. Visit the Courses page to browse available courses\n" +
      "2. Click on a course for details — syllabus, duration, price\n" +
      "3. Add to cart and complete checkout\n" +
      "4. Access your course materials from your Dashboard\n\n" +
      "IELTS is required for most student and some work visas.",
  },
  {
    id: 'courses_general',
    keywords: [
      'course', 'courses', 'coaching', 'training', 'class', 'lesson', 'online course',
      'what courses', 'courses offer', 'courses available', 'course list', 'course catalog',
      'available courses', 'course details', 'course price', 'enroll', 'enrollment',
    ],
    reply:
      "Our course offerings include:\n\n" +
      "• IELTS Preparation — Band 7+ coaching with expert instructors\n" +
      "• Visa Interview Prep — Practice sessions for embassy interviews\n" +
      "• Language & Communication courses\n\n" +
      "To browse and enroll:\n" +
      "1. Go to the Courses page to see all available courses\n" +
      "2. Click any course for full details (syllabus, price, duration)\n" +
      "3. Add to cart → checkout → access from your Dashboard\n\n" +
      "You need a registered account to purchase courses. Sign in or create one at the Sign in page.",
  },

  // ─── Pricing & Fees ───
  {
    id: 'pricing',
    keywords: [
      'price', 'cost', 'fee', 'fees', 'how much', 'charge', 'pricing', 'quote', 'estimate',
      'what does it cost', 'visa fee', 'course fee', 'total cost', 'charges', 'expensive',
      'affordable', 'cheap', 'budget',
    ],
    reply:
      "About our pricing:\n\n" +
      "Visa Application Fees:\n" +
      "• Fees vary by country and visa type\n" +
      "• Exact fees are shown on each country's 'Visa Process' page\n" +
      "• All taxes and charges are displayed at checkout before payment\n\n" +
      "Course Fees:\n" +
      "• Course prices are listed on the Courses page\n" +
      "• Click any course to see the full price breakdown\n\n" +
      "For a custom quote or special pricing, contact us at the Contact us page or email needhelp@globalgateway.com.",
  },

  // ─── Processing Time ───
  {
    id: 'processing_time',
    keywords: [
      'processing time', 'how long', 'duration', 'when will', 'timeline', 'days',
      'weeks', 'fast', 'express', 'urgent', 'how many days', 'waiting time',
      'turnaround', 'speed', 'quick',
    ],
    reply:
      "Processing times depend on several factors:\n\n" +
      "• Country and visa type\n" +
      "• Embassy workload and season\n" +
      "• Completeness of your application\n\n" +
      "Typical ranges:\n" +
      "• Tourist visas: 5-15 business days\n" +
      "• Student visas: 2-8 weeks\n" +
      "• Work visas: 4-12 weeks\n" +
      "• Resident/PR visas: Several months\n\n" +
      "Check your specific country's 'Visa Process' page for estimates. After applying, track real-time updates in your Dashboard.",
  },

  // ─── Payment ───
  {
    id: 'payment',
    keywords: [
      'payment', 'pay', 'upi', 'card', 'debit card', 'credit card', 'net banking',
      'wallet', 'razorpay', 'paid', 'payment method', 'how to pay', 'payment options',
      'online payment',
    ],
    reply:
      "Payment options:\n\n" +
      "• UPI (Google Pay, PhonePe, etc.)\n" +
      "• Debit/Credit Cards (Visa, Mastercard)\n" +
      "• Net Banking\n" +
      "• Other options shown at checkout\n\n" +
      "All payments are processed securely. After payment:\n" +
      "• You'll receive a confirmation\n" +
      "• Transaction details appear in your Dashboard\n" +
      "• Save your transaction ID for reference",
  },
  {
    id: 'payment_failed',
    keywords: ['payment failed', 'failed payment', 'transaction failed', 'declined', 'not paid', 'payment error', 'payment issue', 'money deducted'],
    reply:
      "If your payment failed:\n\n" +
      "1. Check your bank/UPI app for sufficient balance\n" +
      "2. Ensure your card is enabled for online transactions\n" +
      "3. Try again with a different payment method\n\n" +
      "If money was deducted but payment shows failed:\n" +
      "• Don't worry — it usually auto-refunds in 5-7 business days\n" +
      "• Contact us at the Contact us page with: transaction ID, amount, date & time\n" +
      "• Email: needhelp@globalgateway.com",
  },

  // ─── Cart & Checkout ───
  {
    id: 'cart',
    keywords: ['cart', 'shopping cart', 'empty cart', 'add to cart', 'my cart', 'view cart', 'cart items'],
    reply:
      "Your Shopping Cart:\n\n" +
      "• Add courses from the Courses page to your cart\n" +
      "• Open the cart to review items and pricing\n" +
      "• Apply promo codes if you have any\n" +
      "• Proceed to checkout for secure payment\n\n" +
      "You need to be signed in to use the cart. Sign in at the Sign in page.",
  },
  {
    id: 'checkout',
    keywords: ['checkout', 'buy course', 'purchase course', 'order', 'buy now', 'purchase', 'complete order'],
    reply:
      "To complete your purchase:\n\n" +
      "1. Add items to cart from the Courses page\n" +
      "2. Open your cart and review\n" +
      "3. Apply any promo/discount codes\n" +
      "4. Choose your payment method\n" +
      "5. Complete secure payment\n\n" +
      "After payment, access your courses from your Dashboard.",
  },
  {
    id: 'promo_code',
    keywords: ['promo', 'promo code', 'discount', 'coupon', 'offer', 'deal', 'discount code', 'voucher'],
    reply:
      "Promo codes can be applied at checkout:\n\n" +
      "1. Add items to your cart\n" +
      "2. Enter your promo code in the discount field\n" +
      "3. The discount will be applied to your total\n\n" +
      "For current offers and discount codes, check the Courses page or contact us.",
  },

  // ─── Refund ───
  {
    id: 'refund',
    keywords: ['refund', 'money back', 'cancel order', 'cancellation', 'return', 'refund policy', 'get refund', 'cancel payment'],
    reply:
      "Refund policy:\n\n" +
      "• Refund eligibility depends on the service/course purchased\n" +
      "• Check the terms shown at checkout before paying\n" +
      "• Processing time: 5-10 business days after approval\n\n" +
      "To request a refund, contact us at the Contact us page with:\n" +
      "• Your registered email\n" +
      "• Transaction ID / payment reference\n" +
      "• Reason for refund\n\n" +
      "Email: needhelp@globalgateway.com",
  },

  // ─── Account & Auth ───
  {
    id: 'account',
    keywords: [
      'login', 'log in', 'sign in', 'sign up', 'register', 'create account',
      'new account', 'registration', 'signup', 'signin', 'how to register',
    ],
    reply:
      "Account access:\n\n" +
      "• Sign in or Register: Visit the Sign in page\n" +
      "• Create a new account with your email\n" +
      "• Sign in to apply for visas, buy courses, and track applications\n\n" +
      "Note: Admin and Embassy users have separate login portals — don't use the regular sign-in page for those.",
  },
  {
    id: 'password',
    keywords: ['password', 'forgot password', 'reset password', 'change password', 'lost password', 'cant login'],
    reply:
      "Password help:\n\n" +
      "• Go to the Sign in page\n" +
      "• Click 'Forgot Password'\n" +
      "• Enter your registered email\n" +
      "• Check your inbox (and spam folder) for the reset link\n" +
      "• Follow the link to set a new password\n\n" +
      "If you don't receive the email, contact us at the Contact us page with your registered email.",
  },

  // ─── Dashboard & Tracking ───
  {
    id: 'dashboard',
    keywords: [
      'dashboard', 'my application', 'track', 'status', 'application status',
      'where is my', 'check status', 'track application', 'my visa', 'my courses',
      'application progress',
    ],
    reply:
      "Your Dashboard shows everything:\n\n" +
      "• Visa application status and progress\n" +
      "• Embassy updates and notifications\n" +
      "• Appointment schedules\n" +
      "• Payment history and receipts\n" +
      "• Purchased courses\n\n" +
      "Sign in and visit your Dashboard to see all your activity. You'll also receive notifications for important updates.",
  },
  {
    id: 'approved',
    keywords: ['approved', 'visa approved', 'success', 'granted', 'accepted', 'visa granted'],
    reply:
      "Congratulations on your approval! Here's what's next:\n\n" +
      "• Check your Dashboard for the full approval details\n" +
      "• Download any approval documents available\n" +
      "• The embassy may schedule collection or further steps\n" +
      "• Watch for notifications about next actions\n\n" +
      "If you need a receipt or official confirmation, check the payment section in your Dashboard.",
  },
  {
    id: 'rejected',
    keywords: ['rejected', 'refused', 'denied', 'visa rejected', 'not approved', 'visa denied'],
    reply:
      "If your visa application was rejected:\n\n" +
      "• Check your Dashboard for the rejection reason from the embassy\n" +
      "• Review what documents or criteria were flagged\n" +
      "• Some countries allow reapplication — check the embassy notes\n\n" +
      "For guidance on your specific case, contact us at the Contact us page with your application reference number. Our team can advise on next steps.",
  },

  // ─── Appointments ───
  {
    id: 'appointment',
    keywords: [
      'appointment', 'interview', 'biometric', 'vfs', 'embassy visit', 'schedule',
      'reschedule', 'rescheduling', 'change appointment', 'move appointment',
      'book appointment', 'appointment date', 'interview date',
    ],
    reply:
      "About visa appointments:\n\n" +
      "• Appointments (biometrics, interviews) are scheduled after you apply\n" +
      "• Check your Dashboard for date, time, and location\n" +
      "• Watch for email and in-app notifications\n\n" +
      "To reschedule:\n" +
      "• Check if a reschedule option is available on your application in the Dashboard\n" +
      "• If not, contact us via the Contact us page with your application reference\n" +
      "• Include your preferred new date/time if possible\n\n" +
      "Note: Slot availability depends on the embassy's schedule.",
  },

  // ─── Documents ───
  {
    id: 'documents',
    keywords: [
      'document', 'documents required', 'passport', 'photo', 'bank statement',
      'upload', 'file upload', 'requirement', 'checklist', 'what documents',
      'documents needed', 'required documents', 'paperwork',
    ],
    reply:
      "Required documents vary by visa type, but commonly include:\n\n" +
      "• Valid passport (6+ months validity)\n" +
      "• Passport-size photographs\n" +
      "• Financial proof (bank statements)\n" +
      "• Travel itinerary or admission letter\n" +
      "• Employment/education certificates\n\n" +
      "The complete checklist is shown on each country's 'Visa Process' page and inside the application form.\n\n" +
      "Upload tips: Use clear JPG, PNG, or PDF files within the size limits shown on each upload field.",
  },
  {
    id: 'upload_issue',
    keywords: ['upload failed', 'file too large', 'cannot upload', 'upload error', 'upload not working', 'file error', 'image upload'],
    reply:
      "Upload troubleshooting:\n\n" +
      "• Use JPG, PNG, or PDF format\n" +
      "• Keep files within the size limit shown on the upload field\n" +
      "• Ensure a stable internet connection\n" +
      "• Try compressing the file if it's too large\n" +
      "• Clear browser cache and try again\n\n" +
      "Still having issues? Contact us at the Contact us page with a screenshot of the error.",
  },

  // ─── Countries ───
  {
    id: 'countries',
    keywords: ['country', 'countries', 'destination', 'which country', 'list of countries', 'supported countries', 'available countries', 'where can i go'],
    reply:
      "We support visa applications for multiple countries worldwide.\n\n" +
      "To explore:\n" +
      "1. Visit the Countries page\n" +
      "2. Browse or search for your destination\n" +
      "3. Click on a country to see:\n" +
      "   — Available visa types\n" +
      "   — Requirements and fees\n" +
      "   — 'Visa Process' for step-by-step guidance\n\n" +
      "Can't find your country? Contact us — we may still be able to help!",
  },
  {
    id: 'country_examples',
    keywords: [
      'usa', 'united states', 'america', 'uk', 'united kingdom', 'britain', 'england',
      'canada', 'australia', 'germany', 'france', 'dubai', 'uae', 'schengen',
      'south africa', 'india', 'nigeria', 'kenya', 'singapore', 'japan',
      'new zealand', 'italy', 'spain', 'china', 'korea', 'europe', 'asia',
      'malaysia', 'thailand', 'turkey', 'russia', 'brazil', 'mexico',
    ],
    reply:
      "Great choice! Here's how to check visa options for that destination:\n\n" +
      "1. Go to the Countries page\n" +
      "2. Search for or select the country\n" +
      "3. View available visa types and requirements\n" +
      "4. Click 'Visa Process' for detailed step-by-step guidance\n\n" +
      "If the country is listed, you can apply directly online. If not listed yet, contact us at the Contact us page — we'll confirm availability.",
  },

  // ─── Policy ───
  {
    id: 'policy',
    keywords: ['policy', 'visa policy', 'rules', 'eligibility', 'visa requirement', 'visa rules', 'terms', 'terms and conditions'],
    reply:
      "Visa policies and eligibility:\n\n" +
      "• Each country has its own visa rules and requirements\n" +
      "• Check the 'Visa Process' and policy sections for your destination country\n" +
      "• Eligibility criteria, required documents, and fees are all listed there\n\n" +
      "Visit the Countries page and select your destination to see the full policy details.",
  },

  // ─── Contact & Support ───
  {
    id: 'contact',
    keywords: [
      'contact', 'support', 'email', 'phone', 'call', 'help me', 'human',
      'customer service', 'complaint', 'reach out', 'talk to someone',
      'speak to agent', 'customer support', 'helpline',
    ],
    reply:
      "Contact our support team:\n\n" +
      "• Visit: Contact us page (send us a message)\n" +
      "• Email: needhelp@globalgateway.com\n" +
      "• Phone: +91-8978564530\n\n" +
      "Our team typically responds within 2-4 hours during business hours. For urgent matters, call us directly.",
  },

  // ─── About ───
  {
    id: 'about',
    keywords: ['about', 'who are you', 'company', 'global gateway', 'about us', 'about global gateway', 'what is global gateway'],
    reply:
      "Global Gateway is your complete visa and immigration platform:\n\n" +
      "• Online visa applications for multiple countries\n" +
      "• IELTS and coaching courses\n" +
      "• Application tracking and status updates\n" +
      "• Embassy coordination and appointment scheduling\n" +
      "• Secure payment processing\n\n" +
      "Learn more on the About page, or visit the Countries page to get started.",
  },

  // ─── Embassy & Admin ───
  {
    id: 'embassy',
    keywords: ['embassy', 'consulate', 'embassy login', 'embassy portal', 'embassy dashboard'],
    reply:
      "Embassy information:\n\n" +
      "• Embassy staff use the embassy dashboard (separate login from regular users)\n" +
      "• Regular users apply via the Countries page and track in their Dashboard\n" +
      "• Embassy updates, appointments, and decisions appear in your Dashboard notifications\n\n" +
      "Don't use the embassy portal if you're a regular applicant.",
  },
  {
    id: 'admin',
    keywords: ['admin', 'administrator', 'admin login', 'admin panel', 'admin dashboard'],
    reply: "Site administrators use the admin portal with a separate login. This is not accessible to regular users. If you need admin support, please contact us via the Contact us page.",
  },

  // ─── Receipt & Invoice ───
  {
    id: 'receipt',
    keywords: ['receipt', 'invoice', 'proof of payment', 'confirmation', 'payment proof', 'transaction history', 'payment receipt'],
    reply:
      "Payment records and receipts:\n\n" +
      "• Check your Dashboard for complete payment and transaction history\n" +
      "• Each successful payment shows amount, date, and reference ID\n" +
      "• Download or screenshot the details for your records\n\n" +
      "Missing a receipt? Contact us at the Contact us page with your registered email and payment date.",
  },

  // ─── Misc ───
  {
    id: 'notifications',
    keywords: ['notification', 'notifications', 'alert', 'email update', 'sms', 'updates', 'bell icon'],
    reply:
      "Stay updated:\n\n" +
      "• Click the notification bell icon in the top navigation bar\n" +
      "• Check your Dashboard for application updates\n" +
      "• Watch your email for important notifications\n\n" +
      "Notifications include: application status changes, appointment schedules, payment confirmations, and embassy decisions.",
  },
  {
    id: 'security',
    keywords: ['secure', 'safe', 'ssl', 'privacy', 'data', 'personal data', 'security', 'is it safe', 'data protection'],
    reply:
      "Your security is our priority:\n\n" +
      "• All payments are processed through secure, encrypted channels\n" +
      "• Your personal data is protected and never shared with third parties\n" +
      "• Only share login details on official Global Gateway pages\n\n" +
      "Never send passwords or OTPs in chat. For account security concerns, contact us at the Contact us page.",
  },
  {
    id: 'insurance',
    keywords: ['insurance', 'travel insurance', 'health insurance', 'medical insurance'],
    reply:
      "Travel insurance requirements:\n\n" +
      "• Some countries require travel/health insurance for visa applications\n" +
      "• Check the specific requirements on your country's 'Visa Process' page\n" +
      "• Insurance details (coverage amount, duration) are listed in the requirements\n\n" +
      "For specific insurance questions, contact us via the Contact us page.",
  },
  {
    id: 'edit_application',
    keywords: ['edit application', 'change details', 'mistake', 'wrong information', 'update form', 'correct application', 'modify application'],
    reply:
      "Editing your application:\n\n" +
      "• Before submission/payment: You can go back through the form steps to make changes\n" +
      "• After submission: Changes may require support assistance\n\n" +
      "To request changes after submission, contact us at the Contact us page with:\n" +
      "• Your application reference (from your Dashboard)\n" +
      "• What needs to be corrected\n" +
      "• Correct information to update",
  },
  {
    id: 'verification',
    keywords: ['verify email', 'verification', 'otp', 'confirm email', 'activate account', 'email verification', 'verify account'],
    reply:
      "Email verification:\n\n" +
      "• After registration, check your email for a verification link\n" +
      "• Check your spam/junk folder if you don't see it\n" +
      "• Click the link to activate your account\n\n" +
      "Didn't receive the email? Contact us at the Contact us page with your registered email address.",
  },
  {
    id: 'language',
    keywords: ['language', 'hindi', 'english', 'spanish', 'french', 'translate', 'language support'],
    reply:
      "Our platform is currently available in English. The chatbot responds in English.\n\n" +
      "For language-specific support, contact us via the Contact us page and we'll do our best to assist in your preferred language.",
  },
  {
    id: 'mobile',
    keywords: ['mobile', 'phone app', 'android', 'ios', 'mobile app', 'responsive', 'mobile friendly'],
    reply:
      "Our website is fully responsive and works great on mobile browsers!\n\n" +
      "Simply visit our website on your phone's browser to:\n" +
      "• Browse countries and visa types\n" +
      "• Apply for visas\n" +
      "• Access courses\n" +
      "• Track applications in your Dashboard",
  },
];
