export const COMPANY = {
  name: 'Terra Estates Ltd',
  phone: '+2348000000000',
  whatsapp: '2348000000000',
  email: 'hello@terraestates.example',
  address: '12 Admiralty Way, Lekki Phase 1, Lagos',
  hours: 'Mon - Sat, 9:00am - 5:00pm',
  bank: { name: 'Terra Estates Ltd', bankName: 'Example Bank', number: '0123456789' },
};

export const PAYMENT_PLANS = [
  { months: 0, label: 'Outright', note: 'Pay 100% now' },
  { months: 3, label: '3 months', note: '30% deposit + 3 installments' },
  { months: 6, label: '6 months', note: '30% deposit + 6 installments' },
  { months: 12, label: '12 months', note: '30% deposit + 12 installments' },
];

export const PAYMENT_METHODS = [
  { id: 'transfer', label: 'Bank transfer', icon: 'business-outline' },
  { id: 'card', label: 'Debit card', icon: 'card-outline' },
  { id: 'ussd', label: 'USSD', icon: 'keypad-outline' },
];

export const LISTINGS = [
  {
    id: 'l1',
    title: 'Emerald Gardens Estate',
    city: 'Lekki',
    state: 'Lagos',
    sizeSqm: 600,
    pricePerPlot: 18500000,
    plotsAvailable: 14,
    status: 'Available',
    titleType: 'C of O',
    color: '#2F855A',
    description:
      'A gated residential estate with tarred roads, drainage, 24/7 security and perimeter fencing. Minutes from the Lekki-Epe expressway.',
    features: ['Gated estate', 'Tarred roads', 'Drainage', 'Perimeter fence', 'Electricity access', '24/7 security'],
  },
  {
    id: 'l2',
    title: 'Palm Crest Layout',
    city: 'Ibeju-Lekki',
    state: 'Lagos',
    sizeSqm: 450,
    pricePerPlot: 6200000,
    plotsAvailable: 6,
    status: 'Selling Fast',
    titleType: 'Governor\'s Consent',
    color: '#B7791F',
    description:
      'Affordable plots close to the new commercial corridor, ideal for investment or building your first home.',
    features: ['Close to commercial corridor', 'Survey ready', 'Flexible payment', 'Dry land'],
  },
  {
    id: 'l3',
    title: 'Maple Court Phase 2',
    city: 'Abuja',
    state: 'FCT',
    sizeSqm: 500,
    pricePerPlot: 9800000,
    plotsAvailable: 22,
    status: 'Available',
    titleType: 'Right of Occupancy',
    color: '#2B6CB0',
    description:
      'Well planned layout in a fast-growing district with road network, water supply and street lights.',
    features: ['Water supply', 'Street lights', 'Road network', 'Green areas', 'Gated entrance'],
  },
  {
    id: 'l4',
    title: 'Sunrise Farmland',
    city: 'Epe',
    state: 'Lagos',
    sizeSqm: 4000,
    pricePerPlot: 3500000,
    plotsAvailable: 40,
    status: 'Available',
    titleType: 'Registered Survey',
    color: '#6B8E23',
    description:
      'Large fertile parcels suited for farming, agro-processing or long-term land banking.',
    features: ['Fertile soil', 'Access road', 'Large parcels', 'Land banking'],
  },
  {
    id: 'l5',
    title: 'Royal Heights',
    city: 'Port Harcourt',
    state: 'Rivers',
    sizeSqm: 500,
    pricePerPlot: 7400000,
    plotsAvailable: 3,
    status: 'Selling Fast',
    titleType: 'Deed of Assignment',
    color: '#805AD5',
    description:
      'Premium plots in a secure neighbourhood near schools, hospitals and shopping centres.',
    features: ['Near schools', 'Near hospital', 'Secure area', 'Paved roads'],
  },
  {
    id: 'l6',
    title: 'Lakeview Terrace',
    city: 'Lekki',
    state: 'Lagos',
    sizeSqm: 300,
    pricePerPlot: 25000000,
    plotsAvailable: 0,
    status: 'Sold Out',
    titleType: 'C of O',
    color: '#718096',
    description: 'Waterfront plots, now fully sold. Join the waitlist for the next phase.',
    features: ['Waterfront', 'Gated', 'Underground cables'],
  },
];

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};
const daysAhead = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
};

export const SEED_USER = {
  name: 'Amina Yusuf',
  email: 'amina@example.com',
  phone: '08012345678',
};

export const SEED_PURCHASES = [
  {
    id: 'p1',
    listingId: 'l2',
    plots: 2,
    planMonths: 6,
    total: 12400000,
    paid: 3720000,
    createdAt: daysAgo(45),
    schedule: [
      { id: 's1', label: 'Initial deposit', due: daysAgo(45), amount: 3720000, paid: 3720000 },
      { id: 's2', label: 'Installment 1', due: daysAhead(3), amount: 1446667, paid: 0 },
      { id: 's3', label: 'Installment 2', due: daysAhead(33), amount: 1446667, paid: 0 },
      { id: 's4', label: 'Installment 3', due: daysAhead(63), amount: 1446667, paid: 0 },
      { id: 's5', label: 'Installment 4', due: daysAhead(93), amount: 1446667, paid: 0 },
      { id: 's6', label: 'Installment 5', due: daysAhead(123), amount: 1446667, paid: 0 },
      { id: 's7', label: 'Installment 6', due: daysAhead(153), amount: 1446665, paid: 0 },
    ],
  },
];

export const SEED_PAYMENTS = [
  {
    id: 'pay1',
    purchaseId: 'p1',
    amount: 3720000,
    method: 'transfer',
    date: daysAgo(45),
    reference: 'TRX-84721093',
  },
];

export const SEED_NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'Payment reminder',
    body: 'Your next installment on Palm Crest Layout is due in 3 days.',
    date: daysAgo(0),
    read: false,
    icon: 'alarm-outline',
  },
  {
    id: 'n2',
    title: 'Contract of Sale ready',
    body: 'Your Contract of Sale for Palm Crest Layout is now available to download.',
    date: daysAgo(40),
    read: true,
    icon: 'document-text-outline',
  },
  {
    id: 'n3',
    title: 'Welcome to Terra Estates',
    body: 'Browse available land, book inspections and track your payments right here.',
    date: daysAgo(46),
    read: true,
    icon: 'leaf-outline',
  },
];

export const SEED_INSPECTIONS = [];

export const FAQS = [
  {
    q: 'How do installment payments work?',
    a: 'You pay an initial deposit of 30%, then split the balance into equal monthly installments over 3, 6 or 12 months.',
  },
  {
    q: 'When do I receive my documents?',
    a: 'Your receipt is issued after each payment. The Contract of Sale unlocks after your deposit, the Survey Plan at 50% paid, and the Deed of Assignment once you have fully paid.',
  },
  {
    q: 'Can I visit the land before paying?',
    a: 'Yes. Use the Book Inspection option on any listing to choose a date and time. Our team will meet you on site.',
  },
  {
    q: 'What happens if I miss a payment?',
    a: 'Please contact support as soon as possible. Our team can discuss options before any penalty applies.',
  },
  {
    q: 'Can I transfer my plot to someone else?',
    a: 'Transfers are possible once the plot is fully paid. Contact support to start the process.',
  },
];
