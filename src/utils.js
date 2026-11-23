export const naira = (n) =>
  '₦' + String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const formatDate = (iso) => {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

export const daysUntil = (iso) => {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.ceil(ms / 86400000);
};

export const purchaseStatus = (p) => {
  if (p.paid >= p.total) return 'Fully Paid';
  if (p.paid > 0) return 'Paying';
  return 'Reserved';
};

export const balanceOf = (p) => Math.max(p.total - p.paid, 0);

export const progressOf = (p) => (p.total ? Math.min(p.paid / p.total, 1) : 0);

export const nextDue = (p) => p.schedule.find((s) => s.paid < s.amount);

export const getDocuments = (p) => {
  const ratio = progressOf(p);
  return [
    { id: 'receipt', name: 'Payment Receipts', unlocked: p.paid > 0, rule: 'Available after your first payment' },
    { id: 'contract', name: 'Contract of Sale', unlocked: p.paid >= p.total * 0.3, rule: 'Unlocks after the 30% deposit' },
    { id: 'survey', name: 'Survey Plan', unlocked: ratio >= 0.5, rule: 'Unlocks when 50% is paid' },
    { id: 'deed', name: 'Deed of Assignment', unlocked: ratio >= 1, rule: 'Unlocks when fully paid' },
  ];
};

export const addDays = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

export const addMonthsISO = (months) => {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString();
};

export const makeRef = () => 'TRX-' + Math.floor(10000000 + Math.random() * 89999999);
