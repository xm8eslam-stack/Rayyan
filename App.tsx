import React, { useState, useEffect } from 'react';
import { AppTab, UserSettings, Language, FastingType } from './types';
import { UI_TEXT, HADITHS } from './constants';
import { getHijriDate, getNextFastingOpportunities } from './utils/dateUtils';
import NextFastCard from './components/NextFastCard';
import Settings from './components/Settings';
import AiAssistant from './components/AiAssistant';
import CalendarView from './components/CalendarView';
import AudioLibrary from './components/AudioLibrary';
import { Home, Calendar, BookOpen, Settings as SettingsIcon, MessageCircle, Headphones } from 'lucide-react';
import { requestNotificationPermission, checkDailyNotifications } from './services/notificationService';

// Main App Component
const App = () => {
  // Initialize State
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('rayyan_settings');
    const defaults = {
      language: Language.ENGLISH,
      hijriAdjustment: 0,
      notifications: {
        mondayThursday: true,
        whiteDays: true,
        specialDays: true,
        reminderTime: "04:00"
      },
      location: null
    };

    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaults, ...parsed };
    }
    return defaults;
  });

  // Persist Settings
  useEffect(() => {
    localStorage.setItem('rayyan_settings', JSON.stringify(settings));
  }, [settings]);

  // Request Permissions & Check Notifications on Launch
  useEffect(() => {
    const initNotifications = async () => {
       await requestNotificationPermission();
       checkDailyNotifications(settings);
    };
    initNotifications();

    // Register Service Worker for PWA/Offline support
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('SW registered: ', registration);
        }).catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
      });
    }
  }, []);

  const isArabic = settings.language === Language.ARABIC;
  const t = UI_TEXT[settings.language];

  // Logic for Home Data
  const today = new Date();
  const hijriToday = getHijriDate(today, settings.hijriAdjustment);
  const nextOpportunities = getNextFastingOpportunities(today, settings.hijriAdjustment);
  const nextFast = nextOpportunities[0];

  const getTypeName = (type: FastingType) => {
    switch (type) {
        case FastingType.MONDAY_THURSDAY: return t.mondayThursday;
        case FastingType.WHITE_DAYS: return t.whiteDays;
        case FastingType.TASUA: return t.tasua;
        case FastingType.ASHURA: return t.ashura;
        case FastingType.ARAFAH: return t.arafah;
        case FastingType.DHUL_HIJJAH: return t.dhulHijjah;
        case FastingType.SHABAN: return t.shaban;
        default: return t.specialDays;
    }
  };

  // Render Functions for Views
  const renderHome = () => (
    <div className={`p-4 pb-24 space-y-6 ${isArabic ? 'rtl' : 'ltr'}`}>
      <header className="flex justify-between items-center py-2">
        <h1 className="font-serif text-3xl font-bold text-emerald-800">{t.appName}</h1>
        <div className="text-right">
             <div className="text-xs text-slate-500">{t.today}</div>
             <div className="font-serif text-emerald-700 font-bold">{hijriToday.day} {isArabic ? hijriToday.monthNameAr : hijriToday.monthNameEn} {hijriToday.year}</div>
        </div>
      </header>

      {nextFast && (
        <NextFastCard 
          date={nextFast.date} 
          hijri={nextFast.hijri} 
          type={nextFast.type} 
          language={settings.language} 
        />
      )}

      {/* Upcoming List */}
      <div>
        <h3 className="text-lg font-bold text-slate-700 mb-3">{t.calendar}</h3>
        <div className="space-y-3">
          {nextOpportunities.slice(1, 4).map((opp, idx) => (
             <div key={idx} className="bg-white p-4 rounded-xl border border-emerald-50 shadow-sm flex items-center justify-between">
                <div>
                   <p className="font-bold text-slate-800 text-sm">
                      {getTypeName(opp.type)}
                   </p>
                   <p className="text-xs text-slate-500 mt-1">{opp.date.toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
                </div>
                <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-serif font-bold">
                   {opp.hijri.day} {isArabic ? opp.hijri.monthNameAr : opp.hijri.monthNameEn}
                </div>
             </div>
          ))}
        </div>
      </div>
      
      {/* Daily Hadith/Virtue */}
      <div>
         <h3 className="text-lg font-bold text-slate-700 mb-3">{t.virtues}</h3>
         <div className="bg-sand-100 p-5 rounded-xl border border-sand-200">
             <BookOpen className="text-emerald-600 mb-2 opacity-80" size={24} />
             <p className={`text-slate-800 leading-relaxed ${isArabic ? 'font-serif text-lg' : 'italic'}`}>
                 "{isArabic ? HADITHS[0].textAr : HADITHS[0].textEn}"
             </p>
             <p className="text-xs text-slate-500 mt-3 font-semibold uppercase tracking-wide">
                 — {isArabic ? HADITHS[0].sourceAr : HADITHS[0].sourceEn}
             </p>
         </div>
      </div>
    </div>
  );

  const renderLearn = () => (
      <div className={`p-4 pb-24 space-y-4 ${isArabic ? 'rtl' : 'ltr'}`}>
          <h2 className="text-2xl font-bold text-emerald-900 mb-4">{t.virtues}</h2>
          {HADITHS.map(hadith => (
              <div key={hadith.id} className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-emerald-500">
                  <p className={`text-lg text-slate-800 mb-3 ${isArabic ? 'font-serif' : ''}`}>{isArabic ? hadith.textAr : hadith.textEn}</p>
                  <p className="text-sm text-emerald-600 font-medium">{isArabic ? hadith.sourceAr : hadith.sourceEn}</p>
              </div>
          ))}
      </div>
  );

  return (
    <div className="min-h-screen bg-sand-50 font-sans max-w-md mx-auto shadow-2xl overflow-hidden relative">
        
        <main className="h-full overflow-y-auto min-h-screen">
             {activeTab === AppTab.HOME && renderHome()}
             {activeTab === AppTab.CALENDAR && <CalendarView settings={settings} />}
             {activeTab === AppTab.LEARN && renderLearn()}
             {activeTab === AppTab.AUDIO && <AudioLibrary settings={settings} />}
             {activeTab === AppTab.ASK_AI && <AiAssistant settings={settings} />}
             {activeTab === AppTab.SETTINGS && <Settings settings={settings} updateSettings={setSettings} />}
        </main>

        {/* Bottom Navigation */}
        <nav className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 px-2 py-3 flex justify-between items-center z-50 ${isArabic ? 'flex-row-reverse' : ''}`}>
            <NavIcon icon={Home} label={t.home} active={activeTab === AppTab.HOME} onClick={() => setActiveTab(AppTab.HOME)} />
            <NavIcon icon={Calendar} label={t.calendar} active={activeTab === AppTab.CALENDAR} onClick={() => setActiveTab(AppTab.CALENDAR)} />
            
            {/* FAB for AI */}
            <div className="relative -top-6 mx-1">
                 <button 
                    onClick={() => setActiveTab(AppTab.ASK_AI)}
                    className={`w-14 h-14 rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-200 flex items-center justify-center transition-transform hover:scale-105 ${activeTab === AppTab.ASK_AI ? 'ring-4 ring-emerald-100' : ''}`}
                 >
                     <MessageCircle size={28} />
                 </button>
            </div>

            <NavIcon icon={Headphones} label={t.audio} active={activeTab === AppTab.AUDIO} onClick={() => setActiveTab(AppTab.AUDIO)} />
            <NavIcon icon={SettingsIcon} label={t.settings} active={activeTab === AppTab.SETTINGS} onClick={() => setActiveTab(AppTab.SETTINGS)} />
        </nav>
    </div>
  );
};

// Helper Subcomponent for Navigation
const NavIcon = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 min-w-[3.5rem] transition-colors ${active ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}>
        <Icon size={24} strokeWidth={active ? 2.5 : 2} />
        <span className="text-[10px] font-medium truncate max-w-full px-1">{label}</span>
    </button>
);

export default App;