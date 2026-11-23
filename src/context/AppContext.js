import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
  LISTINGS,
  SEED_USER,
  SEED_PURCHASES,
  SEED_PAYMENTS,
  SEED_NOTIFICATIONS,
  SEED_INSPECTIONS,
} from '../data/mock';
import { addMonthsISO, makeRef } from '../utils';

const AppContext = createContext(null);

export const useApp = () => useContext(AppContext);

const applyToSchedule = (schedule, amount) => {
  let left = amount;
  return schedule.map((item) => {
    if (left <= 0) return item;
    const room = item.amount - item.paid;
    const used = Math.min(room, left);
    left -= used;
    return { ...item, paid: item.paid + used };
  });
};

const buildSchedule = (total, planMonths) => {
  if (planMonths === 0) {
    return [{ id: 's1', label: 'Full payment', due: addMonthsISO(0), amount: total, paid: 0 }];
  }
  const deposit = Math.round(total * 0.3);
  const rest = total - deposit;
  const each = Math.floor(rest / planMonths);
  const items = [{ id: 's1', label: 'Initial deposit', due: addMonthsISO(0), amount: deposit, paid: 0 }];
  for (let i = 1; i <= planMonths; i++) {
    const amount = i === planMonths ? rest - each * (planMonths - 1) : each;
    items.push({ id: 's' + (i + 1), label: `Installment ${i}`, due: addMonthsISO(i), amount, paid: 0 });
  }
  return items;
};

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState(LISTINGS);
  const [purchases, setPurchases] = useState(SEED_PURCHASES);
  const [payments, setPayments] = useState(SEED_PAYMENTS);
  const [notifications, setNotifications] = useState(SEED_NOTIFICATIONS);
  const [inspections, setInspections] = useState(SEED_INSPECTIONS);

  const notify = useCallback((title, body, icon = 'notifications-outline') => {
    setNotifications((prev) => [
      { id: 'n' + Date.now() + Math.random(), title, body, icon, date: new Date().toISOString(), read: false },
      ...prev,
    ]);
  }, []);

  const login = useCallback((profile) => {
    setUser({ ...SEED_USER, ...profile });
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const updateUser = useCallback((patch) => setUser((u) => ({ ...u, ...patch })), []);

  const getListing = useCallback((id) => listings.find((l) => l.id === id), [listings]);

  const createPurchase = useCallback(
    (listing, plots, planMonths) => {
      const total = listing.pricePerPlot * plots;
      const purchase = {
        id: 'p' + Date.now(),
        listingId: listing.id,
        plots,
        planMonths,
        total,
        paid: 0,
        createdAt: new Date().toISOString(),
        schedule: buildSchedule(total, planMonths),
      };
      setPurchases((prev) => [purchase, ...prev]);
      setListings((prev) =>
        prev.map((l) => {
          if (l.id !== listing.id) return l;
          const left = l.plotsAvailable - plots;
          return { ...l, plotsAvailable: left, status: left <= 0 ? 'Sold Out' : l.status };
        })
      );
      notify('Plot reserved', `${plots} plot(s) at ${listing.title} reserved. Make your first payment to secure them.`, 'checkmark-circle-outline');
      return purchase;
    },
    [notify]
  );

  const makePayment = useCallback(
    (purchaseId, amount, method) => {
      const purchase = purchases.find((p) => p.id === purchaseId);
      if (!purchase) return null;
      const applied = Math.min(amount, purchase.total - purchase.paid);
      const payment = {
        id: 'pay' + Date.now(),
        purchaseId,
        amount: applied,
        method,
        date: new Date().toISOString(),
        reference: makeRef(),
      };
      setPayments((prev) => [payment, ...prev]);
      setPurchases((prev) =>
        prev.map((p) =>
          p.id === purchaseId
            ? { ...p, paid: p.paid + applied, schedule: applyToSchedule(p.schedule, applied) }
            : p
        )
      );
      const listing = listings.find((l) => l.id === purchase.listingId);
      const done = purchase.paid + applied >= purchase.total;
      notify(
        done ? 'Payment complete' : 'Payment received',
        done
          ? `You have fully paid for ${listing ? listing.title : 'your plot'}. Your Deed of Assignment is now available.`
          : `We received your payment for ${listing ? listing.title : 'your plot'}. Ref: ${payment.reference}`,
        'cash-outline'
      );
      return payment;
    },
    [purchases, listings, notify]
  );

  const bookInspection = useCallback(
    (data) => {
      const item = { id: 'i' + Date.now(), status: 'Scheduled', ...data };
      setInspections((prev) => [item, ...prev]);
      const listing = listings.find((l) => l.id === data.listingId);
      notify(
        'Inspection booked',
        `${listing ? listing.title : 'Site'} visit on ${data.dateLabel} at ${data.time}.`,
        'calendar-outline'
      );
      return item;
    },
    [listings, notify]
  );

  const cancelInspection = useCallback((id) => {
    setInspections((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'Cancelled' } : i)));
  }, []);

  const markRead = useCallback((id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value = useMemo(
    () => ({
      user,
      listings,
      purchases,
      payments,
      notifications,
      inspections,
      unreadCount,
      login,
      logout,
      updateUser,
      getListing,
      createPurchase,
      makePayment,
      bookInspection,
      cancelInspection,
      markRead,
      markAllRead,
    }),
    [
      user,
      listings,
      purchases,
      payments,
      notifications,
      inspections,
      unreadCount,
      login,
      logout,
      updateUser,
      getListing,
      createPurchase,
      makePayment,
      bookInspection,
      cancelInspection,
      markRead,
      markAllRead,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
