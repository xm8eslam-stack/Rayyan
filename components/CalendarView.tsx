import React, { useState, useEffect } from 'react';
import { FastingType, HijriDate, Language, UserSettings, FastingDay } from '../types';
import { getHijriDate, getHijriMonthStart, getHijriMonthCalendar, formatDate } from '../utils/dateUtils';
import { UI_TEXT, HADITHS } from '../constants';
import { ChevronLeft, ChevronRight, X, Info, Heart, ExternalLink } from 'lucide-react';

interface Props {
  settings: UserSettings;
}

const CalendarView: React.FC<Props> = ({ settings }) => {
  const [viewDate, setViewDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<FastingDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<FastingDay | null>(null);
  
  const isArabic = settings.language === Language.ARABIC;
  const t = UI_TEXT[settings.language];

  // Load calendar data when viewDate changes
  useEffect(() => {
    const startOfMonth = getHijriMonthStart(viewDate, settings.hijriAdjustment);
    const days = getHijriMonthCalendar(startOfMonth, settings.hijriAdjustment);
    setCalendarDays(days);
  }, [viewDate, settings.hijriAdjustment]);

  const handlePrevMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setDate(newDate.getDate() - 30); // Move back enough to definitely be in prev month
    // Align to middle of month to avoid edge skipping
    setViewDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setDate(newDate.getDate() + 30);
    setViewDate(newDate);
  };

  const currentHijri = calendarDays.length > 0 ? calendarDays[15]?.hijri || calendarDays[0].hijri : getHijriDate(viewDate, settings.hijriAdjustment);

  const getDayColor = (type: FastingType) => {
    switch (type) {
      case FastingType.MONDAY_THURSDAY: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case FastingType.WHITE_DAYS: return 'bg-amber-100 text-amber-700 border-amber-200';
      case FastingType.ASHURA:
      case FastingType.ARAFAH: return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-white text-slate-700 border-transparent';
    }
  };

  const getDayIndicator = (type: FastingType) => {
    switch (type) {
        case FastingType.MONDAY_THURSDAY: return 'bg-emerald-500';
        case FastingType.WHITE_DAYS: return 'bg-amber-500';
        case FastingType.ASHURA:
        case FastingType.ARAFAH: return 'bg-rose-500';
        default: return null;
    }
  };

  const getRelevantHadith = (type: FastingType) => {
    return HADITHS.find(h => h.tags.includes(type));
  };

  const weekDays = isArabic 
    ? ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate empty slots for grid alignment (start day of week)
  const startDayOfWeek = calendarDays.length > 0 ? calendarDays[0].date.getDay() : 0;
  const blanks = Array(startDayOfWeek).fill(null);

  return (
    <div className={`flex flex-col h-full bg-sand-50 ${isArabic ? 'rtl' : 'ltr'}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white shadow-sm border-b border-emerald-100">
        <button onClick={isArabic ? handleNextMonth : handlePrevMonth} className="p-2 rounded-full hover:bg-slate-100 text-emerald-700">
          <ChevronLeft size={24} />
        </button>
        
        <div className="text-center">
          <h2 className="text-xl font-serif font-bold text-emerald-900">
            {isArabic ? currentHijri.monthNameAr : currentHijri.monthNameEn} {currentHijri.year}
          </h2>
          <p className="text-xs text-slate-500 uppercase tracking-widest">{t.hijri}</p>
        </div>

        <button onClick={isArabic ? handlePrevMonth : handleNextMonth} className="p-2 rounded-full hover:bg-slate-100 text-emerald-700">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 p-2 bg-emerald-50/50">
        {weekDays.map((d, i) => (
          <div key={i} className="text-center text-xs font-semibold text-emerald-600 py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-7 gap-2">
          {blanks.map((_, i) => <div key={`blank-${i}`} />)}
          
          {calendarDays.map((day, i) => {
             const isToday = new Date().toDateString() === day.date.toDateString();
             const indicatorColor = getDayIndicator(day.type);
             
             return (
              <button
                key={i}
                onClick={() => setSelectedDay(day)}
                className={`
                  aspect-square relative rounded-xl flex flex-col items-center justify-center border
                  transition-all active:scale-95
                  ${getDayColor(day.type)}
                  ${isToday ? 'ring-2 ring-emerald-500 ring-offset-1' : ''}
                `}
              >
                <span className={`text-lg font-serif font-bold ${day.type !== FastingType.NONE ? 'font-bold' : ''}`}>
                  {day.hijri.day}
                </span>
                
                {/* Gregorian tiny date */}
                <span className="text-[10px] opacity-60 absolute bottom-1">
                   {day.date.getDate()}
                </span>

                {/* Status Dot */}
                {indicatorColor && (
                    <span className={`absolute top-1 right-1 w-2 h-2 rounded-full ${indicatorColor}`}></span>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="mt-8 px-4 grid grid-cols-2 gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span>{t.mondayThursday}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span>{t.whiteDays}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span>{t.specialDays}</span>
            </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300 max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 className="font-bold text-lg text-emerald-900">{t.fastingDay}</h3>
                <button onClick={() => setSelectedDay(null)} className="p-1 hover:bg-slate-100 rounded-full">
                    <X size={20} />
                </button>
            </div>
            
            <div className="p-6 space-y-5">
                {/* Date Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-slate-500">{t.hijri}</p>
                        <p className="text-2xl font-serif font-bold text-emerald-600">
                            {selectedDay.hijri.day} {isArabic ? selectedDay.hijri.monthNameAr : selectedDay.hijri.monthNameEn} {selectedDay.hijri.year}
                        </p>
                    </div>
                    <div className="text-right">
                         <p className="text-sm text-slate-500">{t.gregorian}</p>
                         <p className="font-medium text-slate-800">
                            {formatDate(selectedDay.date, settings.language)}
                         </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-4">
                    {selectedDay.type !== FastingType.NONE ? (
                        <>
                            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                                <div className="flex items-center gap-2 mb-2 text-emerald-800 font-bold">
                                    <Info size={18} />
                                    <span>
                                        {selectedDay.type === FastingType.MONDAY_THURSDAY && t.mondayThursday}
                                        {selectedDay.type === FastingType.WHITE_DAYS && t.whiteDays}
                                        {selectedDay.type === FastingType.ASHURA && "Ashura"}
                                        {selectedDay.type === FastingType.ARAFAH && "Day of Arafah"}
                                    </span>
                                </div>
                                {getRelevantHadith(selectedDay.type) && (
                                    <p className={`text-sm text-slate-700 leading-relaxed ${isArabic ? 'font-serif' : 'italic'}`}>
                                        "{isArabic ? getRelevantHadith(selectedDay.type)?.textAr : getRelevantHadith(selectedDay.type)?.textEn}"
                                    </p>
                                )}
                            </div>

                            {/* Intention (Niyyah) */}
                            {(isArabic ? selectedDay.niyyahAr : selectedDay.niyyahEn) && (
                              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                                <div className="flex items-center gap-2 mb-2 text-amber-800 font-bold">
                                  <Heart size={18} />
                                  <span>{t.intention}</span>
                                </div>
                                <p className={`text-sm text-slate-800 leading-relaxed ${isArabic ? 'font-serif text-base' : ''}`}>
                                  "{isArabic ? selectedDay.niyyahAr : selectedDay.niyyahEn}"
                                </p>
                              </div>
                            )}

                            {/* Resource Link */}
                            {selectedDay.resourceLink && (
                              <a 
                                href={selectedDay.resourceLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-between w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                              >
                                <span className="text-sm font-medium">{t.readMore}</span>
                                <ExternalLink size={16} />
                              </a>
                            )}
                        </>
                    ) : (
                        <div className="bg-slate-50 rounded-xl p-6 text-center border border-slate-100">
                            <p className="text-slate-500">{t.noFasting}</p>
                        </div>
                    )}
                </div>

                <button 
                    onClick={() => setSelectedDay(null)}
                    className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                >
                    {t.close}
                </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CalendarView;