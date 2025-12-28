export enum Language {
  ENGLISH = 'en',
  ARABIC = 'ar'
}

export enum AppTab {
  HOME = 'home',
  CALENDAR = 'calendar',
  LEARN = 'learn',
  AUDIO = 'audio',
  ASK_AI = 'ask_ai',
  SETTINGS = 'settings'
}

export interface HijriDate {
  day: number;
  month: number;
  year: number;
  monthNameEn: string;
  monthNameAr: string;
}

export enum FastingType {
  MONDAY_THURSDAY = 'monday_thursday',
  WHITE_DAYS = 'white_days',
  ASHURA = 'ashura',
  TASUA = 'tasua',
  ARAFAH = 'arafah',
  DHUL_HIJJAH = 'dhul_hijjah',
  SHAWWAL = 'shawwal',
  SHABAN = 'shaban',
  RAMADAN = 'ramadan',
  GENERAL = 'general',
  NONE = 'none',
  FORBIDDEN = 'forbidden'
}

export interface FastingDay {
  date: Date; // Gregorian Date
  hijri: HijriDate;
  type: FastingType;
  descriptionEn?: string;
  descriptionAr?: string;
  niyyahEn?: string;
  niyyahAr?: string;
  resourceLink?: string;
}

export interface UserSettings {
  language: Language;
  hijriAdjustment: number; // Days +/-
  notifications: {
    mondayThursday: boolean;
    whiteDays: boolean;
    specialDays: boolean;
    reminderTime: string; // "HH:mm" 24h format
  };
  location: string | null;
}

export interface Hadith {
  id: string;
  sourceEn: string;
  sourceAr: string;
  textEn: string;
  textAr: string;
  tags: FastingType[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type AudioCategory = 'quran' | 'dua';

export interface AudioTrack {
  id: string;
  titleEn: string;
  titleAr: string;
  artistEn: string;
  artistAr: string;
  category: AudioCategory;
  url: string;
  duration?: string;
}