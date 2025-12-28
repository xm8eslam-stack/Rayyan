import { UserSettings, FastingType } from '../types';
import { getHijriDate, getFastingType } from '../utils/dateUtils';
import { UI_TEXT } from '../constants';

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notification');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const sendNotification = (title: string, body: string) => {
  if (Notification.permission === 'granted') {
    // Try to use Service Worker registration if available for better mobile support
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, {
          body,
          icon: '/icon-192.png', 
          badge: '/icon-192.png',
          vibrate: [200, 100, 200]
        } as any);
      });
    } else {
      new Notification(title, { body, icon: '/icon-192.png' });
    }
  }
};

export const checkDailyNotifications = (settings: UserSettings) => {
  if (Notification.permission !== 'granted') return;

  const today = new Date();
  const lastCheck = localStorage.getItem('rayyan_last_notif_date');
  
  // Only check once per day to avoid spam
  if (lastCheck === today.toDateString()) return;

  // We want to remind for TOMORROW's fast
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const hijri = getHijriDate(tomorrow, settings.hijriAdjustment);
  const type = getFastingType(tomorrow, hijri);
  const lang = settings.language;
  const t = UI_TEXT[lang];

  let shouldNotify = false;
  let title = t.appName;
  let body = "";

  if (type !== FastingType.NONE && type !== FastingType.FORBIDDEN) {
    // Check specific preferences
    if (type === FastingType.MONDAY_THURSDAY && settings.notifications.mondayThursday) shouldNotify = true;
    if (type === FastingType.WHITE_DAYS && settings.notifications.whiteDays) shouldNotify = true;
    
    // Special days bucket (Ashura, Tasua, Arafah, Dhul-Hijjah)
    if ([FastingType.ASHURA, FastingType.TASUA, FastingType.ARAFAH, FastingType.DHUL_HIJJAH].includes(type) && settings.notifications.specialDays) {
      shouldNotify = true;
    }

    // Construct Message
    if (shouldNotify) {
      title = `${t.nextFast}: ${getTypeName(type, t)}`;
      body = `Reminding you to fast tomorrow (${t.days}). Fasting is a shield.`;
    }
  }

  if (shouldNotify) {
    sendNotification(title, body);
    localStorage.setItem('rayyan_last_notif_date', today.toDateString());
  }
};

const getTypeName = (type: FastingType, t: any) => {
    switch(type) {
        case FastingType.MONDAY_THURSDAY: return t.mondayThursday;
        case FastingType.WHITE_DAYS: return t.whiteDays;
        case FastingType.TASUA: return t.tasua;
        case FastingType.ASHURA: return t.ashura;
        case FastingType.ARAFAH: return t.arafah;
        case FastingType.DHUL_HIJJAH: return t.dhulHijjah;
        case FastingType.SHABAN: return t.shaban;
        default: return t.fastingDay;
    }
};