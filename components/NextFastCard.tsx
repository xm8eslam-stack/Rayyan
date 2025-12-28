import React from 'react';
import { FastingType, HijriDate, Language } from '../types';
import { formatDate } from '../utils/dateUtils';
import { UI_TEXT } from '../constants';
import { Moon, Sunrise, Calendar } from 'lucide-react';

interface Props {
  date: Date;
  hijri: HijriDate;
  type: FastingType;
  language: Language;
}

const NextFastCard: React.FC<Props> = ({ date, hijri, type, language }) => {
  const isArabic = language === Language.ARABIC;

  const getTypeLabel = (t: FastingType) => {
    switch(t) {
      case FastingType.MONDAY_THURSDAY: return UI_TEXT[language].mondayThursday;
      case FastingType.WHITE_DAYS: return UI_TEXT[language].whiteDays;
      case FastingType.ARAFAH: return "Day of Arafah"; // Simplified for brevity in demo
      case FastingType.ASHURA: return "Ashura";
      default: return "";
    }
  };

  return (
    <div className={`w-full bg-emerald-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden ${isArabic ? 'rtl' : 'ltr'}`}>
      {/* Background Decorative Circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500 rounded-full opacity-30 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400 rounded-full opacity-20 blur-xl"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2 opacity-90">
          <Moon size={18} />
          <span className="uppercase tracking-wider text-xs font-semibold">{UI_TEXT[language].nextFast}</span>
        </div>

        <h2 className="text-3xl font-serif font-bold mb-4">
            {getTypeLabel(type)}
        </h2>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 bg-emerald-700/50 p-3 rounded-lg backdrop-blur-sm">
            <Calendar className="text-emerald-200" size={20} />
            <div>
              <p className="text-sm text-emerald-100">{UI_TEXT[language].gregorian}</p>
              <p className="font-medium">{formatDate(date, language)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-emerald-700/50 p-3 rounded-lg backdrop-blur-sm">
            <Sunrise className="text-emerald-200" size={20} />
            <div>
              <p className="text-sm text-emerald-100">{UI_TEXT[language].hijri}</p>
              <p className="font-medium font-serif">
                {hijri.day} {isArabic ? hijri.monthNameAr : hijri.monthNameEn} {hijri.year}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextFastCard;
