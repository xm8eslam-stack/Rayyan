import { HijriDate, FastingType, FastingDay } from "../types";
import { HIJRI_MONTHS_EN, HIJRI_MONTHS_AR, FASTING_DETAILS } from "../constants";

// Basic Hijri calculation logic using Intl API
export const getHijriDate = (date: Date, adjustment: number = 0): HijriDate => {
  // Apply adjustment to the date before conversion
  const adjustedDate = new Date(date);
  adjustedDate.setDate(adjustedDate.getDate() + adjustment);

  const format = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });

  const parts = format.formatToParts(adjustedDate);
  const day = parseInt(parts.find(p => p.type === 'day')?.value || '1', 10);
  const month = parseInt(parts.find(p => p.type === 'month')?.value || '1', 10);
  const year = parseInt(parts.find(p => p.type === 'year')?.value || '1445', 10);

  return {
    day,
    month, // 1-12
    year,
    monthNameEn: HIJRI_MONTHS_EN[month - 1],
    monthNameAr: HIJRI_MONTHS_AR[month - 1]
  };
};

export const getFastingType = (date: Date, hijri: HijriDate): FastingType => {
  const dayOfWeek = date.getDay(); // 0 = Sun, 1 = Mon, 4 = Thu
  
  // Arafah (9 Dhul-Hijjah)
  if (hijri.month === 12 && hijri.day === 9) return FastingType.ARAFAH;
  
  // Ashura (10 Muharram)
  if (hijri.month === 1 && hijri.day === 10) return FastingType.ASHURA;

  // White Days (13, 14, 15 of any month except Ramadan)
  if ([13, 14, 15].includes(hijri.day)) return FastingType.WHITE_DAYS;

  // Monday (1) & Thursday (4)
  if (dayOfWeek === 1 || dayOfWeek === 4) return FastingType.MONDAY_THURSDAY;

  // Shawwal (User needs to track count manually, but we can highlight the month)
  if (hijri.month === 10) return FastingType.SHAWWAL;

  return FastingType.NONE;
};

export const getNextFastingOpportunities = (startDate: Date, adjustment: number = 0, limit: number = 5): FastingDay[] => {
  const opportunities: FastingDay[] = [];
  let current = new Date(startDate);
  // Start from tomorrow to find next opportunities if we want strictly upcoming, 
  // but usually users want to know if *today* is one too. Let's keep existing logic.
  current.setDate(current.getDate()); 

  while (opportunities.length < limit) {
    const hijri = getHijriDate(current, adjustment);
    const type = getFastingType(current, hijri);

    if (type !== FastingType.NONE && type !== FastingType.SHAWWAL) {
       const details = FASTING_DETAILS[type] || {};
       opportunities.push({
         date: new Date(current),
         hijri,
         type,
         ...details
       });
    }
    
    current.setDate(current.getDate() + 1);
  }
  return opportunities;
};

export const formatDate = (date: Date, locale: string) => {
    return new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

// Calendar Generation Utilities

export const getHijriMonthStart = (referenceDate: Date, adjustment: number = 0): Date => {
  let current = new Date(referenceDate);
  const targetHijri = getHijriDate(current, adjustment);
  
  current.setDate(current.getDate() - (targetHijri.day - 1));
  
  let check = getHijriDate(current, adjustment);
  
  while (check.day > 1) {
    current.setDate(current.getDate() - 1);
    check = getHijriDate(current, adjustment);
  }
  
  return current;
};

export const getHijriMonthCalendar = (monthStart: Date, adjustment: number = 0): FastingDay[] => {
  const days: FastingDay[] = [];
  let current = new Date(monthStart);
  const startHijri = getHijriDate(current, adjustment);
  const targetMonth = startHijri.month;

  // Loop until month changes
  while (true) {
    const hijri = getHijriDate(current, adjustment);
    
    if (hijri.month !== targetMonth) break;

    const type = getFastingType(current, hijri);
    const details = FASTING_DETAILS[type] || {};

    days.push({
      date: new Date(current),
      hijri,
      type,
      ...details
    });

    current.setDate(current.getDate() + 1);
  }
  return days;
};

// Auto-detect Adjustment using Aladhan API
export const detectHijriAdjustment = async (): Promise<number> => {
  try {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    const response = await fetch(`https://api.aladhan.com/v1/gToH?date=${dd}-${mm}-${yyyy}`);
    if (!response.ok) throw new Error("Network response was not ok");
    
    const data = await response.json();
    const apiHijri = data.data.hijri; 
    
    const targetDay = parseInt(apiHijri.day, 10);
    const targetMonth = apiHijri.month.number;
    const targetYear = parseInt(apiHijri.year, 10);

    for (let offset = -3; offset <= 3; offset++) {
      const local = getHijriDate(today, offset);
      if (local.day === targetDay && local.month === targetMonth && local.year === targetYear) {
        return offset;
      }
    }
    
    return 0; // Default if no match found
  } catch (error) {
    console.error("Failed to detect Hijri adjustment", error);
    throw error;
  }
};