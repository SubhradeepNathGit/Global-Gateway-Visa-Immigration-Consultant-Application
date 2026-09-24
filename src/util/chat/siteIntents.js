/** Knowledge base for the free local assistant (no API). */

export const LOCAL_CONFIDENCE_MIN_SCORE = 2;

export const SORRY_NO_ANSWER =
  "Sorry, I couldn't find a clear answer to that question.\n\n" +
  "Please reach our team:\n" +
  "• /contact\n" +
  "• needhelp@company.com\n" +
  "• +92 666 888 0000\n\n" +
  "If you're signed in, mention your registered email and any application or payment reference.";

export const INTENTS = [
  {
    id: 'greeting',
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'good afternoon', 'namaste', 'hola'],
    reply:
      "Hello! I'm the Global Gateway assistant. Ask me about visa types, how to apply, courses, payments, your dashboard, or contact options.",
  },
  {
    id: 'goodbye',
    keywords: ['bye', 'goodbye', 'see you', 'later', 'exit'],
    reply: "Goodbye! Safe travels — come back anytime if you need help with visas or the website.",
  },
  {
    id: 'visa_services',
    keywords: [
      'visa service',
      'what visa',
      'types of visa',
      'do you offer',
      'immigration service',
      'visa category',
    ],
    reply:
      "We help with Student, Family, Tourist, Resident, Working, and Business visas.\n\n• Explore: /country\n• Apply: Visa Process for your country\n• Track: /dashboard after login",
  },
  {
    id: 'student_visa',
    keywords: ['student', 'study abroad', 'university', 'college', 'education visa'],
    reply:
      "For a student visa, pick your destination at /country, open Visa Process, and review study-visa requirements and fees. Sign in at /authentication, complete the form, upload documents, and pay at checkout. Track everything in /dashboard.",
  },
  {
    id: 'tourist_visa',
    keywords: ['tourist', 'tourism', 'holiday', 'vacation', 'visit visa', 'travel visa'],
    reply:
      "Tourist visas are available for many countries. Go to /country, select your destination, and follow Visa Process for visitor/tourist options, documents, and fees.",
  },
  {
    id: 'work_visa',
    keywords: ['work visa', 'working', 'employment', 'job abroad', 'work permit'],
    reply:
      "Working visa options depend on the country. Browse /country → Visa Process to see work-visa types, employer documents, and processing steps for that destination.",
  },
  {
    id: 'business_visa',
    keywords: ['business visa', 'conference', 'meeting', 'trade'],
    reply:
      "Business visas are listed per country. Visit /country, choose your destination, and check Visa Process for business-visitor requirements and fees.",
  },
  {
    id: 'family_visa',
    keywords: ['family visa', 'spouse', 'dependent', 'wife', 'husband', 'children', 'reunion'],
    reply:
      "Family and dependent visas vary by country. Select the country at /country and review family-visa rules in Visa Process before starting your application.",
  },
  {
    id: 'resident_visa',
    keywords: ['resident', 'residence', 'pr', 'permanent', 'settle'],
    reply:
      "Resident or long-stay routes depend on the destination. Check /country → Visa Process for resident visa categories and eligibility shown for that country.",
  },
  {
    id: 'apply_how',
    keywords: [
      'how to apply',
      'apply for',
      'application process',
      'start application',
      'steps',
      'get started',
      'begin application',
    ],
    reply:
      "How to apply:\n\n1. /country — choose destination\n2. Visa Process — fees & requirements\n3. /authentication — sign in or register\n4. Application form — details & documents\n5. Payment — secure checkout\n6. /dashboard — track status",
  },
  {
    id: 'pricing',
    keywords: ['price', 'cost', 'fee', 'how much', 'charge', 'pricing', 'quote', 'estimate'],
    reply:
      "Visa fees are shown on each country's Visa Process and payment screens before you pay. Course prices are on /course. For a custom quote, use /contact or needhelp@company.com.",
  },
  {
    id: 'processing_time',
    keywords: [
      'processing time',
      'how long',
      'duration',
      'when will',
      'timeline',
      'days',
      'weeks',
      'fast',
      'express',
      'urgent',
    ],
    reply:
      "Processing times depend on the country, visa type, and embassy workload. The site shows estimates on the country's Visa Process page. After applying, monitor updates in /dashboard and embassy notifications.",
  },
  {
    id: 'courses_ielts',
    keywords: ['ielts', 'ielts prep', 'band', 'english test', 'toefl', 'pte'],
    reply:
      "IELTS and other prep courses are at /course. Open a course for syllabus, price, and duration → add to cart → checkout. Access purchased content from /dashboard.",
  },
  {
    id: 'courses_general',
    keywords: ['course', 'coaching', 'training', 'class', 'lesson', 'online course'],
    reply:
      "Browse all coaching at /course. You need an account (/authentication) to purchase. After payment, courses appear in /dashboard.",
  },
  {
    id: 'cart',
    keywords: ['cart', 'shopping cart', 'empty cart', 'add to cart'],
    reply:
      "Add courses from /course to your cart, then open the cart page to review items and pay. Sign in first at /authentication if prompted.",
  },
  {
    id: 'checkout',
    keywords: ['checkout', 'buy course', 'purchase course', 'order'],
    reply:
      "From /course → add items → cart → complete checkout. Payment methods (UPI, cards, etc.) appear on the payment screen. Save your transaction confirmation.",
  },
  {
    id: 'payment',
    keywords: [
      'payment',
      'pay',
      'upi',
      'card',
      'debit',
      'credit',
      'net banking',
      'wallet',
      'razorpay',
      'paid',
    ],
    reply:
      "Pay securely at checkout (UPI, cards, and other options shown at payment). Visa and course payments appear in /dashboard. For failed charges, retry or contact /contact with your transaction ID.",
  },
  {
    id: 'payment_failed',
    keywords: ['payment failed', 'failed payment', 'transaction failed', 'declined', 'not paid'],
    reply:
      "If payment failed, check your bank/UPI app, ensure sufficient balance, and try again. If money was deducted without confirmation, email /contact with transaction ID, amount, and time.",
  },
  {
    id: 'receipt',
    keywords: ['receipt', 'invoice', 'proof of payment', 'confirmation email'],
    reply:
      "After successful payment you should receive confirmation (email when configured). Check /dashboard for payment and application records. Missing receipt? Contact /contact with your registered email.",
  },
  {
    id: 'refund',
    keywords: ['refund', 'money back', 'cancel order', 'cancellation', 'return'],
    reply:
      "Refund rules depend on the visa service or course purchased. See terms at checkout or contact /contact with your email and transaction details.",
  },
  {
    id: 'account',
    keywords: [
      'login',
      'log in',
      'sign in',
      'sign up',
      'register',
      'create account',
      'new account',
    ],
    reply:
      "User sign-in and registration: /authentication\n\nAdmins and embassies use their own login pages — do not use the user form for those roles.",
  },
  {
    id: 'password',
    keywords: ['password', 'forgot password', 'reset password', 'change password'],
    reply:
      "On /authentication, use Forgot password to get a reset link by email. Reset page: /reset-password (from the link in your email).",
  },
  {
    id: 'verification',
    keywords: ['verify email', 'verification', 'otp', 'confirm email', 'activate account'],
    reply:
      "After registration you may need to verify email via the link sent to you. Check spam folder. Stuck? Use /contact with your registered email.",
  },
  {
    id: 'dashboard',
    keywords: [
      'dashboard',
      'my application',
      'track',
      'status',
      'application status',
      'where is my',
    ],
    reply:
      "/dashboard (after login) shows visa applications, embassy updates, appointments, payments, and purchased courses.",
  },
  {
    id: 'approved',
    keywords: ['approved', 'visa approved', 'success', 'granted'],
    reply:
      "When your visa is approved, status updates in /dashboard. Download or view details there. Embassy may also schedule collection or further steps — check notifications in the dashboard.",
  },
  {
    id: 'rejected',
    keywords: ['rejected', 'refused', 'denied', 'visa rejected'],
    reply:
      "If an application is rejected, reasons may appear in /dashboard. You may reapply if policy allows — review embassy notes and /contact for guidance on your case.",
  },
  {
    id: 'appointment',
    keywords: ['appointment', 'interview', 'biometric', 'vfs', 'embassy visit', 'schedule'],
    reply:
      "Embassies can schedule appointments through the platform. Check /dashboard and email/notifications for date, time, and documents to bring.",
  },
  {
    id: 'documents',
    keywords: [
      'document',
      'passport',
      'photo',
      'bank statement',
      'upload',
      'file',
      'requirement',
      'checklist',
    ],
    reply:
      "Required documents are listed in Visa Process and inside the application form for your country. Common items: passport, photo, financial proof, travel itinerary. Upload in the form before payment.",
  },
  {
    id: 'upload_issue',
    keywords: ['upload failed', 'file too large', 'cannot upload', 'jpg', 'png', 'pdf size'],
    reply:
      "Use clear JPG/PNG/PDF within size limits shown on the upload field. If upload fails, try a smaller file or stable connection. Still stuck? /contact with a screenshot of the error.",
  },
  {
    id: 'edit_application',
    keywords: ['edit application', 'change details', 'mistake', 'wrong information', 'update form'],
    reply:
      "Before submission/payment you can often go back in the form steps to edit. After submission, changes may require support — contact /contact with your application reference from /dashboard.",
  },
  {
    id: 'countries',
    keywords: ['country', 'countries', 'destination', 'which country', 'list of country'],
    reply:
      "See all supported destinations at /country. Click a country for visa types, policy, and Visa Process.",
  },
  {
    id: 'country_examples',
    keywords: [
      'usa',
      'united states',
      'uk',
      'britain',
      'canada',
      'australia',
      'germany',
      'france',
      'dubai',
      'uae',
      'schengen',
    ],
    reply:
      "Open /country and search or select your destination. Each country page shows available visa types, requirements, and how to start Visa Process.",
  },
  {
    id: 'policy',
    keywords: ['policy', 'visa policy', 'rules', 'eligibility', 'requirement'],
    reply:
      "Visa policy and eligibility are on each country's pages (Visa Process and policy sections). Always follow the requirements shown for your chosen destination.",
  },
  {
    id: 'embassy',
    keywords: ['embassy', 'consulate', 'embassy login', 'embassy portal'],
    reply:
      "Embassy staff use the embassy dashboard (separate login from users). End users apply via /country and track in /dashboard — not the embassy portal.",
  },
  {
    id: 'admin',
    keywords: ['admin', 'administrator', 'admin login', 'admin panel'],
    reply:
      "Site administrators use the admin login at /admin — not the public /authentication page.",
  },
  {
    id: 'contact',
    keywords: [
      'contact',
      'support',
      'email',
      'phone',
      'call',
      'help me',
      'human',
      'customer service',
      'complaint',
    ],
    reply:
      "Contact us:\n• /contact\n• needhelp@company.com\n• +92 666 888 0000\n• 66 Road Broklyn Street, 600 New York, USA",
  },
  {
    id: 'about',
    keywords: ['about', 'who are you', 'company', 'global gateway', 'about us'],
    reply: "Global Gateway offers online visa applications, coaching courses, and application tracking. More at /about and /country.",
  },
  {
    id: 'about_page',
    keywords: ['team', 'mission', 'vision', 'history'],
    reply: "Learn about our company and team on /about.",
  },
  {
    id: 'contact_page',
    keywords: ['get in touch', 'write to you', 'message you'],
    reply: "Use the form at /contact or email needhelp@company.com.",
  },
  {
    id: 'insurance',
    keywords: ['insurance', 'travel insurance'],
    reply:
      "Travel insurance needs depend on destination and visa type. Check requirements on your country's Visa Process page or ask via /contact.",
  },
  {
    id: 'security',
    keywords: ['secure', 'safe', 'ssl', 'privacy', 'data', 'personal data'],
    reply:
      "We use secure checkout for payments. Only share login details on official Global Gateway pages. Never send passwords or OTPs in chat — contact /contact for account help.",
  },
  {
    id: 'notifications',
    keywords: ['notification', 'alert', 'email update', 'sms'],
    reply:
      "Check the notification bell in the site header and /dashboard for application and payment updates when you're signed in.",
  },
  {
    id: 'thanks',
    keywords: ['thank', 'thanks', 'thx', 'appreciate', 'helpful'],
    reply: "You're welcome! Ask anytime about visas, courses, or using the site.",
  },
  {
    id: 'chatbot_meta',
    keywords: ['who are you chat', 'are you ai', 'are you robot', 'real person'],
    reply:
      "I'm Global Gateway's assistant. I answer from our site guide first; harder questions may use AI backup when available. For official case advice, use /contact.",
  },
];
